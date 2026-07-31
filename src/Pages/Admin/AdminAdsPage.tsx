import React, { useState, useId } from "react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAds,
  createAdminAd,
  updateAdminAd,
  deleteAdminAd,
  getHomeAds,
  createHomeAd,
  updateHomeAd,
  deleteHomeAd,
} from "../../Apis/AdminApi";
import {
  Trash2,
  Plus,
  Pencil,
  ExternalLink,
  Image as ImageIcon,
  X,
  Home,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { safeFormatDate } from "../../utils/DateFormater";
import ConfirmModal from "../../Components/shared/ConfirmModal";
import { useLocale } from "../../i18n/useLocale";

/** Converts a UTC ISO string to the local wall-clock value a datetime-local input expects. */
const toLocalInputValue = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

interface AdFormData {
  title: string;
  text: string;
  buttonText: string;
  link: string;
  amountPaid: string;
  expireAt: string;
  image: File | null;
}

const EMPTY_AD_FORM: AdFormData = {
  title: "",
  text: "",
  buttonText: "",
  link: "",
  amountPaid: "",
  expireAt: "",
  image: null,
};

export default function AdminAdsPage() {
  const { t } = useTranslation();
  const { lang } = useLocale();
  const queryClient = useQueryClient();
  const fileInputId = useId();

  const [tab, setTab] = useState<"standard" | "home">("standard");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "ad" | "homeAd";
    id: string | null;
  }>({ isOpen: false, type: "ad", id: null });

  // Ad form modal state
  const [adFormOpen, setAdFormOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [adForm, setAdForm] = useState<AdFormData>(EMPTY_AD_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [adFormError, setAdFormError] = useState<string | null>(null);
  const [homeAdFormError, setHomeAdFormError] = useState<string | null>(null);

  const isAr = lang === "ar";

  const statusLabel = (isActive: boolean) =>
    isActive ? t("admin.active") : lang === "ar" ? "غير نشط" : "Inactive";

  const extractErrorMessage = (err: any): string => {
    if (!err) return lang === "ar" ? "حدث خطأ غير معروف" : "An unknown error occurred";
    if (typeof err === "string") return err;
    const data = err?.response?.data;
    if (data) {
      // Check if errors is a key-value dictionary e.g. { text: "...", expireAt: "..." }
      if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
        const messages = Object.entries(data.errors).map(([field, msg]) => {
          if (typeof msg === "string") return msg;
          if (msg && typeof msg === "object" && (msg as any).msg) return (msg as any).msg;
          return `${field} is invalid`;
        });
        if (messages.length > 0) return messages.join(" • ");
      }

      // Check if errors is an array e.g. [{ field: "text", msg: "..." }]
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors
          .map((e: any) => (typeof e === "string" ? e : e.msg || e.message || JSON.stringify(e)))
          .join(" • ");
      }

      if (typeof data.message === "string" && data.message !== "Validation failed") {
        return data.message;
      }
      if (typeof data.error === "string") {
        return data.error;
      }
    }
    if (err.message) return err.message;
    return lang === "ar"
      ? "فشل التحقق. يرجى مراجعة المدخلات."
      : "Validation failed. Please check your inputs.";
  };

  // Home ad assignment modal state
  const [homeAdModalOpen, setHomeAdModalOpen] = useState(false);
  const [homeAdForm, setHomeAdForm] = useState<{
    adId: string;
    adPosition: "top" | "middle" | "bottom";
  }>({ adId: "", adPosition: "top" });
  const [editingHomeAdId, setEditingHomeAdId] = useState<string | null>(null);

  // Detail modal for viewing full ad info
  const [detailAd, setDetailAd] = useState<any>(null);

  const {
    data: adsData,
    isLoading: isLoadingAds,
    fetchNextPage: fetchNextAds,
    hasNextPage: hasMoreAds,
    isFetchingNextPage: isFetchingMoreAds,
  } = useInfiniteQuery({
    queryKey: ["adminAds"],
    queryFn: ({ pageParam }) => getAdminAds(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) =>
      lastPage?.hasMore ? lastPage.nextCursor : undefined,
    enabled: tab === "standard" || homeAdModalOpen,
  });

  const allAds: any[] = adsData?.pages.flatMap((p: any) => p.ads ?? []) ?? [];

  const { data: homeAdsData, isLoading: isLoadingHomeAds } = useQuery({
    queryKey: ["adminHomeAds"],
    queryFn: getHomeAds,
    enabled: tab === "home",
  });

  // MUTATIONS — Standard Ads
  const createAdMutation = useMutation({
    mutationFn: (formData: FormData) => createAdminAd(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      closeAdForm();
    },
    onError: (err: any) => {
      setAdFormError(extractErrorMessage(err));
    },
  });

  const updateAdMutation = useMutation({
    mutationFn: ({ adId, formData }: { adId: string; formData: FormData }) =>
      updateAdminAd(adId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      closeAdForm();
    },
    onError: (err: any) => {
      setAdFormError(extractErrorMessage(err));
    },
  });

  const deleteAdMutation = useMutation({
    mutationFn: (adId: string) => deleteAdminAd(adId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      setConfirmModal({ ...confirmModal, isOpen: false, id: null });
    },
    onError: (err: any) => {
      alert(extractErrorMessage(err));
    },
  });

  // MUTATIONS — Home Ads
  const createHomeAdMutation = useMutation({
    mutationFn: ({
      adId,
      adPosition,
    }: {
      adId: string;
      adPosition: "top" | "middle" | "bottom";
    }) => createHomeAd(adId, adPosition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminHomeAds"] });
      closeHomeAdModal();
    },
    onError: (err: any) => {
      setHomeAdFormError(extractErrorMessage(err));
    },
  });

  const updateHomeAdMutation = useMutation({
    mutationFn: ({ homeAdId, adId }: { homeAdId: string; adId: string }) =>
      updateHomeAd(homeAdId, adId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminHomeAds"] });
      closeHomeAdModal();
    },
    onError: (err: any) => {
      setHomeAdFormError(extractErrorMessage(err));
    },
  });

  const deleteHomeAdMutation = useMutation({
    mutationFn: (homeAdId: string) => deleteHomeAd(homeAdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminHomeAds"] });
      setConfirmModal({ ...confirmModal, isOpen: false, id: null });
    },
    onError: (err: any) => {
      alert(extractErrorMessage(err));
    },
  });

  // FORM HANDLERS
  const closeAdForm = () => {
    setAdFormOpen(false);
    setEditingAdId(null);
    setAdForm(EMPTY_AD_FORM);
    setImagePreview(null);
    setAdFormError(null);
  };

  const openCreateAdForm = () => {
    setAdForm(EMPTY_AD_FORM);
    setEditingAdId(null);
    setAdFormError(null);
    setAdFormOpen(true);
  };

  const openEditAdForm = (ad: any) => {
    setEditingAdId(ad.id);
    setAdForm({
      title: ad.title || "",
      text: ad.text || "",
      buttonText: ad.buttonText || "",
      link: ad.link || "",
      amountPaid: ad.amountPaid ? String(ad.amountPaid) : "",
      expireAt: ad.expireAt ? toLocalInputValue(ad.expireAt) : "",
      image: null,
    });
    setImagePreview(ad.imageUrl || null);
    setAdFormError(null);
    setAdFormOpen(true);
  };

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdFormError(null);

    // Client-side validations matching backend constraints exactly:
    if (!adForm.title.trim() || adForm.title.trim().length < 3) {
      setAdFormError(isAr ? "يجب ألا يقل العنوان عن 3 أحرف" : "Title must be at least 3 characters");
      return;
    }
    if (!adForm.text.trim() || adForm.text.trim().length < 10) {
      setAdFormError(isAr ? "يجب أن يكون النص بين 10 و1000 حرف" : "Text must be between 10 and 1000 characters");
      return;
    }
    if (!adForm.buttonText.trim() || adForm.buttonText.trim().length < 2) {
      setAdFormError(isAr ? "يجب ألا يقل نص الزر عن حرفين" : "Button text must be at least 2 characters");
      return;
    }
    if (!adForm.amountPaid || Number(adForm.amountPaid) <= 0) {
      setAdFormError(isAr ? "يجب أن يكون المبلغ المدفوع أكبر من 0" : "Amount paid must be greater than 0");
      return;
    }
    if (!adForm.link.trim()) {
      setAdFormError(isAr ? "رابط الإعلان مطلوب" : "Link URL is required");
      return;
    }
    if (!adForm.expireAt) {
      setAdFormError(isAr ? "تاريخ الانتهاء مطلوب" : "Expiry date is required");
      return;
    }
    const expireDate = new Date(adForm.expireAt);
    if (isNaN(expireDate.getTime()) || expireDate.getTime() <= Date.now()) {
      setAdFormError(isAr ? "يجب أن يكون التاريخ في المستقبل" : "Date must be in the future");
      return;
    }
    if (!editingAdId && !adForm.image) {
      setAdFormError(isAr ? "الصورة مطلوبة عند إنشاء إعلان" : "Image is required when creating an ad");
      return;
    }

    const formData = new FormData();
    formData.append("title", adForm.title.trim());
    formData.append("text", adForm.text.trim());
    formData.append("buttonText", adForm.buttonText.trim());
    formData.append("link", adForm.link.trim());
    formData.append("amountPaid", adForm.amountPaid);
    formData.append("expireAt", expireDate.toISOString());
    if (adForm.image) {
      formData.append("image", adForm.image);
    }

    if (editingAdId) {
      updateAdMutation.mutate({ adId: editingAdId, formData });
    } else {
      createAdMutation.mutate(formData);
    }
  };

  const closeHomeAdModal = () => {
    setHomeAdModalOpen(false);
    setEditingHomeAdId(null);
    setHomeAdForm({ adId: "", adPosition: "top" });
  };

  const handleHomeAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHomeAdId) {
      updateHomeAdMutation.mutate({
        homeAdId: editingHomeAdId,
        adId: homeAdForm.adId,
      });
    } else {
      createHomeAdMutation.mutate(homeAdForm);
    }
  };

  const isPending =
    createAdMutation.isPending ||
    updateAdMutation.isPending ||
    createHomeAdMutation.isPending ||
    updateHomeAdMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("admin.adsManagement")}
        </h2>
        {tab === "standard" ? (
          <button
            onClick={openCreateAdForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" /> {t("admin.createAd", "Create Ad")}
          </button>
        ) : (
          <button
            onClick={() => {
              setHomeAdForm({ adId: "", adPosition: "top" });
              setEditingHomeAdId(null);
              setHomeAdModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            <Home className="w-5 h-5" />{" "}
            {t("admin.assignToHome", "Assign to Home")}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setTab("standard")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            tab === "standard"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("admin.standardAds")}
        </button>
        <button
          onClick={() => setTab("home")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            tab === "home"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("admin.homeAds")}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {(tab === "standard" ? isLoadingAds : isLoadingHomeAds) ? (
          <div className="p-8 text-center text-gray-500">
            {t("admin.loading")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {tab === "standard" ? (
              allAds.length ? (
                allAds.map((ad: any) => (
                  <div
                    key={ad.id}
                    className="border border-gray-200 rounded-xl overflow-hidden relative group hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setDetailAd(ad)}
                  >
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditAdForm(ad);
                        }}
                        className="p-2 bg-white rounded-full text-blue-600 shadow hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({
                            isOpen: true,
                            type: "ad",
                            id: ad.id,
                          });
                        }}
                        className="p-2 bg-white rounded-full text-red-600 shadow hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {ad.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {ad.text}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-400">
                          {safeFormatDate(ad.createdAt)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ad.isActive
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {statusLabel(ad.isActive)}
                        </span>
                      </div>
                      {ad.link && (
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                        >
                          <ExternalLink className="w-3 h-3" /> {ad.buttonText || (isAr ? "زيارة" : "Visit")}
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">
                  {t("admin.noAds")}
                </div>
              )
            ) : homeAdsData?.length ? (
              homeAdsData.map((homeAd: any) => (
                <div
                  key={homeAd.id}
                  className="border border-gray-200 rounded-xl overflow-hidden relative group hover:shadow-md transition-shadow"
                >
                  <img
                    src={homeAd.ad.imageUrl}
                    alt="Home Ad"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingHomeAdId(homeAd.id);
                        setHomeAdForm({
                          adId: homeAd.adId,
                          adPosition: homeAd.position,
                        });
                        setHomeAdModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-full text-blue-600 shadow hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          type: "homeAd",
                          id: homeAd.id,
                        })
                      }
                      className="p-2 bg-white rounded-full text-red-600 shadow hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold uppercase">
                        {homeAd.position}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                      {homeAd.ad.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {t("admin.fromStandardAd")}: {homeAd.ad.title || homeAd.adId.slice(0, 8)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                {t("admin.noHomeAds")}
              </div>
            )}
          </div>
        )}
        {tab === "standard" && hasMoreAds && (
          <div className="flex justify-center pb-6">
            <button
              onClick={() => fetchNextAds()}
              disabled={isFetchingMoreAds}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isFetchingMoreAds ? t("admin.loadingMore") : t("admin.loadMore")}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={t("admin.delete")}
        message={
          confirmModal.type === "ad"
            ? t("admin.deleteAdConfirm")
            : t("admin.deleteHomeAdConfirm")
        }
        type="danger"
        onCancel={() =>
          setConfirmModal({ ...confirmModal, isOpen: false, id: null })
        }
        onConfirm={() => {
          if (confirmModal.id) {
            if (confirmModal.type === "ad") {
              deleteAdMutation.mutate(confirmModal.id);
            } else {
              deleteHomeAdMutation.mutate(confirmModal.id);
            }
          }
        }}
      />

      {/* Ad Detail Modal */}
      {detailAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative">
              <img
                src={detailAd.imageUrl}
                alt={detailAd.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => setDetailAd(null)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white shadow"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                {detailAd.title}
              </h3>
              <p className="text-sm text-gray-600">{detailAd.text}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase text-gray-400 font-bold">
                    {isAr ? "نص الزر" : "Button Text"}
                  </span>
                  <p className="font-semibold text-gray-800">
                    {detailAd.buttonText}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase text-gray-400 font-bold">
                    {t("admin.status")}
                  </span>
                  <p
                    className={`font-semibold ${
                      detailAd.isActive ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {statusLabel(detailAd.isActive)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase text-gray-400 font-bold">
                    {isAr ? "المبلغ المدفوع" : "Amount Paid"}
                  </span>
                  <p className="font-semibold text-gray-800">
                    ${detailAd.amountPaid}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-[10px] uppercase text-gray-400 font-bold">
                    {isAr ? "ينتهي في" : "Expires"}
                  </span>
                  <p className="font-semibold text-gray-800">
                    {safeFormatDate(detailAd.expireAt)}
                  </p>
                </div>
              </div>
              {detailAd.link && (
                <a
                  href={detailAd.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-semibold"
                >
                  <ExternalLink className="w-4 h-4" /> {isAr ? "زيارة الرابط" : "Visit Link"}
                </a>
              )}
              <p className="text-xs text-gray-400">
                {t("admin.addedBy")}: {detailAd.addedBy?.name} •{" "}
                {safeFormatDate(detailAd.createdAt)}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setDetailAd(null);
                    openEditAdForm(detailAd);
                  }}
                  className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
                >
                  {isAr ? "تعديل" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    setDetailAd(null);
                    setConfirmModal({
                      isOpen: true,
                      type: "ad",
                      id: detailAd.id,
                    });
                  }}
                  className="flex-1 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                >
                  {t("admin.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Ad Modal */}
      {adFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAdId
                  ? t("admin.editAd", "Edit Ad")
                  : t("admin.createAd", "Create Ad")}
              </h3>
              <button
                onClick={closeAdForm}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdSubmit} className="p-6 space-y-4">
              {adFormError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{adFormError}</span>
                </div>
              )}
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAr ? "الصورة" : "Image"}
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden mb-2">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setAdForm({ ...adForm, image: null });
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={fileInputId}
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {isAr ? "اضغط لرفع صورة" : "Click to upload image"}
                    </span>
                  </label>
                )}
                <input
                  id={fileInputId}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAdForm({ ...adForm, image: file });
                      setImagePreview(URL.createObjectURL(file));
                    }
                    e.target.value = "";
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.title")}
                </label>
                <input
                  type="text"
                  required
                  value={adForm.title}
                  onChange={(e) =>
                    setAdForm({ ...adForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAr ? "النص" : "Text"}
                </label>
                <textarea
                  required
                  rows={3}
                  value={adForm.text}
                  onChange={(e) =>
                    setAdForm({ ...adForm, text: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isAr ? "نص الزر" : "Button Text"}
                  </label>
                  <input
                    type="text"
                    required
                    value={adForm.buttonText}
                    onChange={(e) =>
                      setAdForm({ ...adForm, buttonText: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isAr ? "المبلغ المدفوع" : "Amount Paid"}
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={adForm.amountPaid}
                    onChange={(e) =>
                      setAdForm({ ...adForm, amountPaid: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAr ? "الرابط (URL)" : "Link (URL)"}
                </label>
                <input
                  type="url"
                  required
                  value={adForm.link}
                  onChange={(e) =>
                    setAdForm({ ...adForm, link: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isAr ? "تاريخ الانتهاء" : "Expiry Date"}
                </label>
                <input
                  type="datetime-local"
                  required
                  min={toLocalInputValue(new Date().toISOString())}
                  value={adForm.expireAt}
                  onChange={(e) =>
                    setAdForm({ ...adForm, expireAt: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeAdForm}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  {t("admin.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? t("admin.saving")
                    : editingAdId
                    ? t("admin.update")
                    : t("admin.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Home Ad Assignment Modal */}
      {homeAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingHomeAdId
                  ? isAr
                    ? "تحديث إعلان الرئيسية"
                    : "Update Home Ad"
                  : t("admin.assignToHome", "Assign to Home")}
              </h3>
              <button
                onClick={closeHomeAdModal}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleHomeAdSubmit} className="p-6 space-y-4">
              {homeAdFormError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{homeAdFormError}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("admin.selectAd")}
                </label>
                <select
                  required
                  value={homeAdForm.adId}
                  onChange={(e) =>
                    setHomeAdForm({ ...homeAdForm, adId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">-- {t("admin.selectAd")} --</option>
                  {allAds.map((ad: any) => (
                    <option key={ad.id} value={ad.id}>
                      {ad.title} ({statusLabel(ad.isActive)})
                    </option>
                  ))}
                </select>
              </div>
              {!editingHomeAdId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("admin.position")}
                  </label>
                  <select
                    value={homeAdForm.adPosition}
                    onChange={(e) =>
                      setHomeAdForm({
                        ...homeAdForm,
                        adPosition: e.target.value as
                          | "top"
                          | "middle"
                          | "bottom",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="top">{t("admin.positionTop")}</option>
                    <option value="middle">{t("admin.positionMiddle")}</option>
                    <option value="bottom">{t("admin.positionBottom")}</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeHomeAdModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  {t("admin.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isPending
                    ? t("admin.saving")
                    : editingHomeAdId
                    ? t("admin.update")
                    : t("admin.assign")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
