import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

function HomeFeaturedPostsLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation("common");
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight  text-shadow-lg">
              {t("home.featuredTitle")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("home.featuredSubtitle")}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default HomeFeaturedPostsLayout;
