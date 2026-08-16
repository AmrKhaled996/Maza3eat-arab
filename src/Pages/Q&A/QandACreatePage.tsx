import { useState, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import NavigationBar from "../../Components/shared/NavigationBar";
import RichTextEditor from "../../Components/shared/RichTextEditor";
import { createQuestion } from "../../Apis/Qus&AnsApi/QandAApis";
import { createAdminQuestion } from "../../Apis/AdminApi";
import cn from "../../utils/Cn";
import { getSuggestedTags, type TagItem } from "../../Apis/TagsApi";
import SubmissionConfirmModal from "../../Components/shared/SubmissionConfirmModal";
import { useToast } from "../../Context/Toast";

export default function QndACreatePage() {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const navigate = useNavigate();
  const {toast} = useToast();
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagSuggestions, setTagSuggestions] = useState<TagItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!tagInput.trim()) {
      setTagSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await getSuggestedTags(tagInput);
        setTagSuggestions(results);
      } catch {
        setTagSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [tagInput]);

  const handleAddTag = (tagName?: string) => {
    const clean = (tagName || tagInput).trim().replace(/^#+/, "");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || title.length < 3) {
      setError(t("createQuestion.errorRequired"));
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      setError(t("createQuestion.errorRequired"));
      return;
    }

    if (tags.length === 0) {
      setError(t("createQuestion.errorMinTags"));
      return;
    }

    if (isAdmin) {
      executeSubmit();
    } else {
      setShowConfirmModal(true);
    }
  };

  const executeSubmit = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      if (isAdmin) {
        await createAdminQuestion({ title: title.trim(), content: content.trim(), tags });
        queryClient.invalidateQueries({ queryKey: ["adminQuestions"] });
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        navigate(localizedPath(lang, "admin/questions"));
      } else {
        const res = await createQuestion(title.trim(), content.trim(), tags);
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        toast.success(lang === "ar" ? "تم انشاء السؤال بنجاح" : "Question created successfully");
        if (res.data?.id) {
          navigate(localizedPath(lang, `pending/question`));
        } else {
          navigate(localizedPath(lang, "q&a"));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Request failed");
      toast.error(lang === "ar" ? "حدث خطأ ما ، لم يتم انشاء السؤال" : "Something went wrong , question not created");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {!isAdmin && <NavigationBar page="q&a" solidNav />}

      {/* Main Container */}
      <div className={cn("max-w-3xl mx-auto px-4 sm:px-6", isAdmin ? "pt-6" : "pt-24 md:pt-28")}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label={t("createQuestion.back")}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Form Box */}
        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Title Section */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">
              {t("createQuestion.titleLabel")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("createQuestion.titlePlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-gray-400 mt-2">
              {t("createQuestion.titleHelp")}
            </p>
          </div>

          {/* Description Section */}
          <div className="quill-container">
            <label className="mb-2 block text-sm font-bold text-gray-800">
              {t("createQuestion.contentLabel")}
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={t("createQuestion.contentPlaceholder")}
              className="rounded-xl bg-white"
            />
          </div>

          {/* Tags Section */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">
              {t("createQuestion.tagsLabel")}
            </label>
            <div className="flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-transparent px-3.5 py-1.5 text-sm font-semibold"
                >
                  <span className="gradient-text">#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200/60 hover:text-gray-700"
                    aria-label={t("createQuestion.removeTag")}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-2 relative">
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder={t("createQuestion.tagPlaceholder")}
                  className="min-w-0 flex-1 rounded-xl border border-gray-200/90 bg-white/90 px-4 py-2.5 text-sm outline-none ring-1 ring-transparent transition focus:border-primary/40 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="shrink-0 rounded-xl border border-dashed border-primary/35 bg-transparent px-4 py-2.5 text-sm font-semibold transition hover:border-primary/50 cursor-pointer"
                >
                  <span className="gradient-text">{t("createQuestion.addTag")}</span>
                </button>
              </div>

              {/* Tag Autocomplete Suggestions */}
              {tagSuggestions.length > 0 && (
                <div className="absolute top-full inset-x-0 mt-1.5 z-20 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 max-h-48 overflow-y-auto">
                  {tagSuggestions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleAddTag(item.name)}
                      className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between cursor-pointer font-medium"
                    >
                      <span>#{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full main-gradient py-4 text-base font-bold text-white shadow-lg transition-opacity disabled:opacity-60 cursor-pointer"
          >
            <Send className="h-5 w-5" />
            {submitting ? t("createQuestion.publishing") : t("createQuestion.publish")}
          </button>
        </form>
      </div>

      <SubmissionConfirmModal
        isOpen={showConfirmModal}
        isSubmitting={submitting}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={executeSubmit}
      />
    </div>
  );
}