import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import cn from "../../utils/Cn";

const FAQ_KEYS = [1, 2, 3, 4, 5] as const;

export default function FAQSection() {
  const { t } = useTranslation("common");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) =>
    setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageCircleQuestion className="text-primary" size={28} />
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {t("about.faqTitle")}
          </h2>
        </div>
        <p className="text-gray-500 text-[15px] max-w-lg mx-auto">
          {t("about.faqSubtitle")}
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_KEYS.map((n) => {
          const isOpen = openIndex === n;
          return (
            <div
              key={n}
              className={cn(
                "rounded-2xl border transition-all duration-300",
                isOpen
                  ? "border-primary/30 bg-white shadow-md"
                  : "border-gray-200 bg-gray-50 hover:bg-white hover:shadow-sm",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(n)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
              >
                <span className="font-semibold text-gray-800 text-[15px]">
                  {t(`about.faq${n}Q`)}
                </span>
                <span
                  className={cn(
                    "shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                    isOpen
                      ? "bg-primary text-white rotate-180"
                      : "bg-gray-200 text-gray-500",
                  )}
                >
                  <ChevronDown size={18} />
                </span>
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                  {t(`about.faq${n}A`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
