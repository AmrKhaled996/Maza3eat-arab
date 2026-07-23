import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminAds, deleteAdminAd, getHomeAds, deleteHomeAd } from "../../Apis/AdminApi";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { safeFormatDate } from "../../utils/DateFormater";
import ConfirmModal from "../../Components/shared/ConfirmModal";

export default function AdminAdsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"standard" | "home">("standard");
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "ad" | "homeAd"; id: string | null }>({ isOpen: false, type: "ad", id: null });
  const queryClient = useQueryClient();

  const { data: adsData, isLoading: isLoadingAds } = useQuery({
    queryKey: ["adminAds"],
    queryFn: getAdminAds,
    enabled: tab === "standard",
  });

  const { data: homeAdsData, isLoading: isLoadingHomeAds } = useQuery({
    queryKey: ["adminHomeAds"],
    queryFn: getHomeAds,
    enabled: tab === "home",
  });

  const deleteAdMutation = useMutation({
    mutationFn: (adId: string) => deleteAdminAd(adId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAds"] });
      setConfirmModal({ ...confirmModal, isOpen: false, id: null });
    },
  });

  const deleteHomeAdMutation = useMutation({
    mutationFn: (homeAdId: string) => deleteHomeAd(homeAdId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminHomeAds"] });
      setConfirmModal({ ...confirmModal, isOpen: false, id: null });
    },
  });

  const handleDeleteAd = (adId: string) => {
    setConfirmModal({ isOpen: true, type: "ad", id: adId });
  };

  const handleDeleteHomeAd = (homeAdId: string) => {
    setConfirmModal({ isOpen: true, type: "homeAd", id: homeAdId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.adsManagement")}</h2>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setTab("standard")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === "standard" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          {t("admin.standardAds")}
        </button>
        <button
          onClick={() => setTab("home")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === "home" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          {t("admin.homeAds")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {(tab === "standard" ? isLoadingAds : isLoadingHomeAds) ? (
          <div className="p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {tab === "standard" ? (
              adsData?.ads?.length ? (
                adsData.ads.map((ad: any) => (
                  <div key={ad.id} className="border border-gray-200 rounded-xl overflow-hidden relative">
                    <img src={ad.imageUrl} alt="Ad" className="w-full h-40 object-cover" />
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-600 shadow hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-4">
                      <p className="text-xs text-gray-500">{t("admin.addedBy")}: {ad.addedBy?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{t("admin.date")}: {safeFormatDate(ad.createdAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">{t("admin.noAds")}</div>
              )
            ) : (
              homeAdsData?.homeAds?.length ? (
                homeAdsData.homeAds.map((homeAd: any) => (
                  <div key={homeAd.id} className="border border-gray-200 rounded-xl overflow-hidden relative">
                    <img src={homeAd.ad.imageUrl} alt="Home Ad" className="w-full h-40 object-cover" />
                    <button
                      onClick={() => handleDeleteHomeAd(homeAd.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-600 shadow hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-4">
                      <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold uppercase mb-2">
                        {homeAd.position} {t("admin.position")}
                      </span>
                      <p className="text-xs text-gray-500">{t("admin.fromStandardAd")}: {homeAd.adId}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500">{t("admin.noHomeAds")}</div>
              )
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={t("admin.delete")}
        message={confirmModal.type === "ad" ? t("admin.deleteAdConfirm") : t("admin.deleteHomeAdConfirm")}
        type="danger"
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false, id: null })}
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
    </div>
  );
}
