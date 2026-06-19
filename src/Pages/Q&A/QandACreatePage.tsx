import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import NavigationBar from "../../Components/shared/NavigationBar";
import RichTextEditor from "../../Components/shared/RichTextEditor";
import { createQuestion } from "../../Apis/Qus&AnsApi/QandAApis";

export default function QndACreatePage() {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#+/, "");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setSubmitting(true);
    try {
      const res = await createQuestion(title.trim(), content.trim(), tags);
      if (res.data?.id) {
        navigate(localizedPath(lang, `q&a/${res.data.id}`));
      } else {
        navigate(localizedPath(lang, "q&a"));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <NavigationBar page="q&a" solidNav />

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label={t("createQuestion.back")}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Form Box */}
        <form onSubmit={handleSubmit} className="space-y-8">
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

            <div className="mt-2 flex gap-2">
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
                onClick={handleAddTag}
                className="shrink-0 rounded-xl border border-dashed border-primary/35 bg-transparent px-4 py-2.5 text-sm font-semibold transition hover:border-primary/50 cursor-pointer"
              >
                <span className="gradient-text">{t("createQuestion.addTag")}</span>
              </button>
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
    </div>
  );
}