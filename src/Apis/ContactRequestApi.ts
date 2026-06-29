import { axiosInstance } from "./axiosInstance";
import type { ContactRequest, ContactRequestInfo } from "../Types/Notification";

// ─── Raw backend shapes ───────────────────────────────────────────────────────

interface BackendUser {
  id: string;
  name: string;
  avatar: string;
  tier: { id: string; name: string; badgeColor: string };
}

/**
 * The backend encodes direction+status into a "type" string:
 *   "SENT:ACCEPTED"     → direction=SENT, status=ACCEPTED
 *   "RECEIVED:PENDING"  → direction=RECEIVED, status=PENDING
 */
interface BackendContactRequest {
  id: string;
  /** "YOU" or a user object */
  requester: "YOU" | BackendUser;
  /** "YOU" or a user object */
  receiver: "YOU" | BackendUser;
  type: "SENT:ACCEPTED" | "RECEIVED:PENDING";
  lastActivityAt: string;
  isRead: boolean;
}

interface ContactRequestListResponse {
  status: string;
  data: {
    contactRequests: BackendContactRequest[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

interface ContactRequestDetailResponse {
  status: string;
  data: Record<string, unknown>;
}

interface CreateContactRequestResponse {
  status: string;
  data: Record<string, unknown>;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

/** Maps the backend ContactRequest list item to the frontend ContactRequest type */
function mapContactRequest(r: BackendContactRequest): ContactRequest {
  const isSent = r.type === "SENT:ACCEPTED";
  const direction = isSent ? ("SENT" as const) : ("RECEIVED" as const);
  const status = isSent ? ("ACCEPTED" as const) : ("PENDING" as const);

  // The "other" user is the one that is NOT "YOU"
  const otherUser = isSent
    ? (r.receiver as BackendUser)
    : (r.requester as BackendUser);

  return {
    id: r.id,
    direction,
    status,
    createdAt: r.lastActivityAt,
    user: {
      id: otherUser.id,
      name: otherUser.name,
      avatar: otherUser.avatar,
      tier: {
        name: otherUser.tier.name,
        badgeColor: otherUser.tier.badgeColor,
      },
    },
  };
}

// Map single detailed request response from backend containing contactMethod object
export function mapDetailedContactRequest(raw: any, currentUserId?: string): ContactRequest {
  const decryptedValue = raw.contactMethod?.value;
  const contactType = raw.contactMethod?.type;

  const contactInfo: ContactRequestInfo = {};
  if (contactType === "EMAIL") {
    contactInfo.email = decryptedValue;
  } else if (contactType === "WHATSAPP") {
    contactInfo.phone = decryptedValue;
    contactInfo.whatsapp = decryptedValue;
  } else if (contactType === "FACEBOOK") {
    contactInfo.facebook = decryptedValue;
  } else if (contactType === "INSTAGRAM") {
    contactInfo.instagram = decryptedValue;
  }

  // The "other" user is whoever is not the requester or receiver depending on direction
  const otherUser = raw.requesterId === currentUserId ? raw.receiver : raw.requester;

  return {
    id: raw.id,
    direction: raw.requesterId === currentUserId ? "SENT" : "RECEIVED",
    status: raw.status,
    createdAt: raw.lastActivityAt,
    reason: raw.reason,
    contactInfo,
    user: otherUser ? {
      id: otherUser.id,
      name: otherUser.name,
      avatar: otherUser.avatar,
      tier: {
        name: otherUser.tier.name,
        badgeColor: otherUser.tier.badgeColor,
      },
    } : {
      id: "",
      name: "",
      avatar: "",
      tier: { name: "", badgeColor: "" }
    }
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Fetch paginated contact requests visible to the current user:
 *  - RECEIVED & PENDING  (requests sent to me, waiting for my response)
 *  - SENT & ACCEPTED     (my sent requests that were accepted)
 */
export async function fetchContactRequests(cursor: string | null = null): Promise<{
  contactRequests: ContactRequest[];
  nextCursor: string | null;
  hasMore: boolean;
}> {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;

  const { data } =
    await axiosInstance.get<ContactRequestListResponse>(
      "/contact-requests",
      { params }
    );

  return {
    contactRequests: data.data.contactRequests.map(mapContactRequest),
    nextCursor: data.data.nextCursor,
    hasMore: data.data.hasMore,
  };
}

/**
 * Send a new contact request to another user.
 * @param receiverId  - ID of the user to contact
 * @param reason      - Requester's message / reason
 */
export async function createContactRequest(
  receiverId: string,
  reason: string
): Promise<Record<string, unknown>> {
  const { data } =
    await axiosInstance.post<CreateContactRequestResponse>(
      "/contact-requests",
      { receiverId, reason }
    );
  return data.data;
}

/**
 * Respond to a received contact request (ACCEPTED or DECLINED).
 * When accepting, supply the contact method type and value.
 *
 * @param id          - Contact request ID
 * @param status      - "ACCEPTED" | "DECLINED"
 * @param type        - contact method type: "FACEBOOK" | "WHATSAPP" | "INSTAGRAM" | "EMAIL" (required on ACCEPTED)
 * @param contactInfo - actual value e.g. "+201234567890" (required on ACCEPTED)
 */
export async function respondToContactRequest(
  id: string,
  status: "ACCEPTED" | "DECLINED",
  type?: "FACEBOOK" | "WHATSAPP" | "INSTAGRAM" | "EMAIL",
  contactInfo?: string
): Promise<Record<string, unknown>> {
  const body: Record<string, unknown> = { status };
  if (type) body.type = type;
  if (contactInfo) body.contactInfo = contactInfo;

  const { data } =
    await axiosInstance.patch<ContactRequestDetailResponse>(
      `/contact-requests/${id}`,
      body
    );
  return data.data;
}

/**
 * Fetch a single contact request by ID.
 * If accepted and you are the requester, the decrypted contact info is included.
 */
export async function fetchContactRequestById(
  id: string,
  currentUserId?: string
): Promise<ContactRequest | null> {
  try {
    const { data } =
      await axiosInstance.get<{ status: string; data: any }>(
        `/contact-requests/${id}`
      );
    return mapDetailedContactRequest(data.data, currentUserId);
  } catch {
    return null;
  }
}

/**
 * Report a contact request.
 */
export async function reportContactRequest(
  contactRequestId: string,
  reason: string
): Promise<void> {
  await axiosInstance.post("/reports", {
    targetId: contactRequestId,
    targetType: "CONTACT_REQUEST",
    reason,
  });
}
