import { BookOpen, Target, Eye, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StoryMissionVision() {
  const { t } = useTranslation("common");

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto space-y-20">
      {/* Our Story + Our Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Our Story */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-primary" size={24} />
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("about.ourStoryTitle")}
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            {t("about.ourStoryText")}
          </p>
        </div>

        {/* Our Mission */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-secondary" size={24} />
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("about.ourMissionTitle")}
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-[15px] mb-4">
            {t("about.ourMissionText")}
          </p>
          <ul className="space-y-2">
            {(["ourMissionPoint1", "ourMissionPoint2", "ourMissionPoint3"] as const).map(
              (key) => (
                <li key={key} className="flex items-start gap-2 text-gray-600 text-[15px]">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                  {t(`about.${key}`)}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([1, 2, 3, 4] as const).map((n) => (
          <div
            key={n}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-3xl md:text-4xl font-black gradient-text">
              {t(`about.stat${n}Value`)}
            </p>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              {t(`about.stat${n}Label`)}
            </p>
          </div>
        ))}
      </div>

      {/* Our Vision */}
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Eye className="text-accent" size={24} />
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {t("about.ourVisionTitle")}
          </h2>
        </div>
        <p className="text-gray-600 leading-relaxed text-[15px]">
          {t("about.ourVisionText")}
        </p>
      </div>
    </section>
  );
}
