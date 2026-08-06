import {  useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetProfile from "../../Hooks/ProfileHooks/useGetProfile";
import type { UserProfileData } from "../../Types/Profile/profile-types";
import { Mail } from "lucide-react";
import NavigationBar from "../shared/NavigationBar";
import { localizedPath } from "../../i18n/paths";
import { useLocale } from "../../i18n/useLocale";
import { Title } from "react-head";
import { useTranslation } from "react-i18next";
import ContactDialog from "./ContactDialog";
import { createContactRequest } from "../../Apis/ContactRequestApi";
import { useAuth } from "../../Context/Auth";

function ProfileContainer({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab: string;
}) {
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactRequestLoading, setContactRequestLoading] = useState(false);
  const [contactRequestReason, setContactRequestReason] = useState<string>("");
  const [contactRequestError, setContactRequestError] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const { id: userId } = useParams() as { id: string };
  const {user}=useAuth();

  const { data: profileUser, isLoading } = useGetProfile(userId) as {
    data: UserProfileData;
    isLoading: boolean;
  };
  const TABS = [
    {
      key: "posts",
      label: t("profile.menuPosts"),
      count: profileUser?.counts?.posts,
      link: "posts",
    },
    {
      key: "Q&A",
      label: t("profile.menuQuestions"),
      count: profileUser?.counts?.questions,
      link: "q&a",
    },
  ];

  const handleContactRequest = async (id: string) => {
    if (!userId || userId === user?.id) return;
    try {
      
      setContactRequestLoading(true);
      await createContactRequest(id, contactRequestReason);
    } catch (e) {
      console.error(e);
    }
    finally {
       setShowContactDialog(false);
      setContactRequestLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-10 px-8 sm:px-6 mt-12 "
      style={{ backgroundColor: "#edf3ff" }}
    >
      <Title>{profileUser?.name}</Title>
      <NavigationBar page="home" solidNav />
      <div className="max-w-6xl mx-auto">
        <div
          className="flex flex-col sm:flex-row gap-8 sm:items-start"
          dir="rtl"
        >
          {/* ── Sidebar: معلومات المستخدم ── */}
          <aside className="flex flex-col items-center gap-3 sm:w-36 flex-shrink-0">
            {/* أفاتار */}
            <div className="relative">
              <img
                src={profileUser?.avatar}
                alt={profileUser?.name}
                className="w-20 h-20 rounded-full object-cover   shadow-lg  outline-4  outline-white"
                style={{ outlineColor: profileUser?.tier?.badgeColor }}
              />
            </div>

            <p className="text-base font-extrabold text-gray-900 text-center">
              {profileUser?.name}
            </p>

            <span
              className="text-xs font-bold px-4 py-1 rounded-full text-white shadow relative group"
              style={{ background: profileUser?.tier?.badgeColor }}
            >
              {profileUser?.tier?.name}
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 ">
                {profileUser?.tier?.description}
              </div>
            </span>

            {/* زر تواصل */}
            {profileUser?.id !== user?.id && (
              <button 
              onClick={()=>setShowContactDialog(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 border border-purple-200 px-4 py-1.5 rounded-full hover:bg-purple-50 transition-colors">
                <Mail size={16} className="text-secondary" />{" "}
                {t("profile.menucontact")}
              </button>
            )}
          </aside>

          {/* ── المحتوى الرئيسي ── */}
          <div className="flex-1 min-w-0 w-full">
            {/* تبويبات */}
            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      navigate(
                        localizedPath(lang, `profile/${userId}/${tab.link}`),
                        
                      );
                    }}
                    className="relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold transition-colors"
                    style={{ color: isActive ? "#2563eb" : "#9ca3af" }}
                  >
                    {tab.label}
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? "#edf3ff" : "#f3f4f6",
                        color: isActive ? "#2563eb" : "#9ca3af",
                      }}
                    >
                      {tab.count}
                    </span>
                    {/* خط التبويب النشط */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #2563eb, #9333ea)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="overflow-x-auto h-[80vh] px-4 w-full scroll-smooth profileSlider">
              {children}
            </div>
          </div>
        </div>
      </div>
      <ContactDialog
        open={showContactDialog}
        onClose={() => setShowContactDialog(false)}
        onConfirm={() => handleContactRequest(userId)}
        loading={contactRequestLoading}
        setReason={setContactRequestReason}
        setError={setContactRequestError}
        error={contactRequestError}
      />
    </div>
  );
}

export default ProfileContainer;
