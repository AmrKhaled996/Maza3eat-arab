import { axiosInstance } from "../axiosInstance";

/**
 * Fetches the Google OAuth URL from the backend.
 * The backend generates a unique URL with CSRF state protection.
 * The backend handles the Google callback internally at /auth/google/callback,
 * sets HttpOnly cookies, and redirects the user back to the frontend.
 */
export async function getGoogleAuthUrl(): Promise<string> {
  const { data } = await axiosInstance.get("/auth/google");
  console.log(data);
  return data.data.url;
}

/**
 * Fetches the current authenticated user's profile.
 * Requires a valid accessToken cookie to be present.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  tier: "copper" | "silver" | "gold" | null;
}

export async function getMe(): Promise<AuthUser> {
  const response = await axiosInstance.get<{ status: string; data: AuthUser }>(
    "/auth/me",
    {
      _skipAuthRedirect: true,
    } as never
  );
  return response.data.data;
}

/**
 * Logs the user out by clearing cookies and invalidating the refresh token.
 */
export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

/**
 * Refreshes the access token using the refresh token cookie.
 */
export async function refreshToken(): Promise<void> {
  await axiosInstance.post("/auth/refresh-token");
}
