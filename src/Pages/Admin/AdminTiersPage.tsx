import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminTiers, updateTier } from "../../Apis/AdminApi";
import { Edit2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { safeFormatDate } from "../../utils/DateFormater";

export default function AdminTiersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    badgeColor: "#000000"
  });

  const { data: tiers, isLoading } = useQuery({
    queryKey: ["adminTiers"],
    queryFn: getAdminTiers,
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => updateTier(editingTier.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTiers"] });
      closeModal();
    }
  });

  const openModal = (tier: any) => {
    setEditingTier(tier);
    setFormData({ name: tier.name, description: tier.description, badgeColor: tier.badgeColor });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTier(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t("admin.tiersManagement")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-gray-500">{t("admin.loading")}</div>
        ) : (
          tiers?.map((tier: any) => (
            <div key={tier.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: `${tier.badgeColor}20`, color: tier.badgeColor }}>
                    {tier.name}
                  </span>
                  {!tier.isSystem && (
                    <button onClick={() => openModal(tier)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-2">{tier.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">{t("admin.created")} {safeFormatDate(tier.createdAt)}</span>
                {tier.isSystem && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{t("admin.systemTier")}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-start">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">{t("admin.editTier")}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.name")}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.description")}</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.badgeColor")}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.badgeColor}
                    onChange={(e) => setFormData({...formData, badgeColor: e.target.value})}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    pattern="^#[0-9A-Fa-f]{6}$"
                    value={formData.badgeColor}
                    onChange={(e) => setFormData({...formData, badgeColor: e.target.value})}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none uppercase text-start"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
                  {t("admin.cancel")}
                </button>
                <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
                  {mutation.isPending ? t("admin.saving") : t("admin.saveTier")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
