import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Bold,
  Camera,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  Italic,
  List,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../Components/shared/NavigationBar";
import {
  POST_IMAGE_FIELD,
  createPost,
  getCreatePostErrorMessage,
} from "../../Apis/PostsApi/createPost";
import { useLocale } from "../../i18n/useLocale";
import { localizedPath } from "../../i18n/paths";
import cn from "../../utils/Cn";

const MAX_IMAGES = 6;

type PreviewItem = { file: File; url: string };

function wrapSelection(
  el: HTMLTextAreaElement,
  before: string,
  after: string,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = el.value;
  const selected = value.slice(start, end);
  const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
  el.value = next;
  el.focus();
  el.setSelectionRange(
    start + before.length,
    start + before.length + selected.length,
  );
  if (!selected) {
    el.setSelectionRange(start + before.length, start + before.length);
  }
}

function prefixLines(el: HTMLTextAreaElement, prefix: string) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = el.value;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const block = value.slice(lineStart, end);
  const lines = block.split("\n");
  const nextBlock = lines.map((l) => `${prefix}${l}`).join("\n");
  const next = `${value.slice(0, lineStart)}${nextBlock}${value.slice(end)}`;
  el.value = next;
  el.focus();
  el.setSelectionRange(lineStart, lineStart + nextBlock.length);
}

export default function CreatePostPage() {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const navigate = useNavigate();
  const fileInputId = useId();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewsRef = useRef<PreviewItem[]>([]);
  previewsRef.current = previews;

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (incoming.length === 0) return;
    setPreviews((prev) => {
      const room = MAX_IMAGES - prev.length;
      const take = incoming.slice(0, Math.max(0, room));
      const next = [
        ...prev,
        ...take.map((file) => ({ file, url: URL.createObjectURL(file) })),
      ];
      if (prev.length === 0 && next.length > 0) setMainIndex(0);
      return next;
    });
  };

  const removeAt = (index: number) => {
    setPreviews((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      setMainIndex((i) => {
        if (copy.length === 0) return 0;
        if (index === i) return Math.min(i, copy.length - 1);
        if (index < i) return i - 1;
        return i;
      });
      return copy;
    });
  };

  const addTag = () => {
    const raw = tagInput.trim().replace(/^#+/, "");
    if (!raw) return;
    if (tags.includes(raw)) {
      setTagInput("");
      return;
    }
    setTags((t) => [...t, raw]);
    setTagInput("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (previews.length < 1) {
      setError(t("createPost.errorMinImages"));
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError(t("createPost.errorRequired"));
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content);
    const tagPayload = tags.map((name) => ({ name }));
    formData.append("tags", JSON.stringify(tagPayload));
    previews.forEach((p) => formData.append(POST_IMAGE_FIELD, p.file));

    setSubmitting(true);
    try {
      const res = await createPost(formData);
      const id = res.data?.data?.id;
      if (id) {
        navigate(localizedPath(lang, `post/${id}`));
      } else {
        navigate(localizedPath(lang, "community"));
      }
    } catch (err) {
      setError(getCreatePostErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const main = previews[mainIndex];

  return (
    <div className="min-h-screen pb-16">
      <NavigationBar page="create-post" solidNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          aria-label={t("createPost.back")}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <form onSubmit={onSubmit} className="space-y-8">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {main ? (
              <div className="relative aspect-[16/10] bg-gray-100">
                <img
                  src={main.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAt(mainIndex)}
                  className="absolute end-3 top-3 rounded-xl bg-red-500 p-2 text-white shadow-md hover:bg-red-600 opacity-80 hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer"
                  aria-label={t("createPost.removeImage")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {previews.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      onClick={() =>
                        setMainIndex((i) =>
                          i === 0 ? previews.length - 1 : i - 1,
                        )
                      }
                      aria-label={t("createPost.prevImage")}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      onClick={() =>
                        setMainIndex((i) =>
                          i === previews.length - 1 ? 0 : i + 1,
                        )
                      }
                      aria-label={t("createPost.nextImage")}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-gray-100 text-gray-400">
                <p className="text-sm">{t("createPost.noImagesYet")}</p>
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto p-3">
              {previews.map((p, i) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setMainIndex(i)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                    i === mainIndex ? "border-primary" : "border-transparent",
                  )}
                >
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 p-4 text-center">
              <input
                id={fileInputId}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <label
                htmlFor={fileInputId}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50",
                  previews.length >= MAX_IMAGES && "pointer-events-none opacity-50",
                )}
              >
                <Camera className="h-4 w-4" />
                {t("createPost.addPhotos")}
                <span className="text-xs text-gray-400">
                  ({previews.length}/{MAX_IMAGES})
                </span>
              </label>
            </div>
          </section>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">
              {t("createPost.titleLabel")}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("createPost.titlePlaceholder")}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-bold text-gray-800">
                {t("createPost.contentLabel")}
              </label>
              <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                <button
                  type="button"
                  className="rounded p-1.5 text-gray-600 hover:bg-white"
                  onClick={() => {
                    const el = contentRef.current;
                    if (el) wrapSelection(el, "**", "**");
                    setContent(contentRef.current?.value ?? content);
                  }}
                  aria-label="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-1.5 text-gray-600 hover:bg-white"
                  onClick={() => {
                    const el = contentRef.current;
                    if (el) wrapSelection(el, "_", "_");
                    setContent(contentRef.current?.value ?? content);
                  }}
                  aria-label="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-1.5 text-gray-600 hover:bg-white"
                  onClick={() => {
                    const el = contentRef.current;
                    if (el) prefixLines(el, "- ");
                    setContent(contentRef.current?.value ?? content);
                  }}
                  aria-label="List"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder={t("createPost.contentPlaceholder")}
              className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-800">
              {t("createPost.tagsLabel")}
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
                    onClick={() => setTags((ts) => ts.filter((x) => x !== tag))}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200/60 hover:text-gray-700"
                    aria-label={t("createPost.removeTag")}
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
                    addTag();
                  }
                }}
                placeholder={t("createPost.tagPlaceholder")}
                className="min-w-0 flex-1 rounded-xl border border-gray-200/90 bg-white/90 px-4 py-2.5 text-sm outline-none ring-1 ring-transparent transition focus:border-primary/40 focus:ring-primary/15"
              />
              <button
                type="button"
                onClick={addTag}
                className="shrink-0 rounded-xl border border-dashed border-primary/35 bg-transparent px-4 py-2.5 text-sm font-semibold transition hover:border-primary/50"
              >
                <span className="gradient-text">{t("createPost.addTag")}</span>
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full main-gradient py-4 text-base font-bold text-white shadow-lg transition-opacity disabled:opacity-60"
          >
            <FilePlus2 className="h-5 w-5" />
            {submitting ? t("createPost.publishing") : t("createPost.publish")}
          </button>
        </form>
      </div>
    </div>
  );
}
