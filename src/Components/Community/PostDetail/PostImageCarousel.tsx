import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Post } from "../../../Types/Post";
import cn from "../../../utils/Cn";
import { useLocale } from "../../../i18n/useLocale";
import type { Tag } from "../../../Types/Tag";
import type { Image } from "../../../Types/Image";
import type { Author } from "../../../Types/Author";

interface PostImageCarouselProps {
  post: Post | undefined;
}
// interface PostDetailWithImage {
//   id: string;
//   title: string;
//   content: string;
//   likesCount: number;
//   commentsCount: number;
//   tags: Tag[];
//   image: Image;
//   images?: {
//     imageUrl: string;
//     originalName: string;
//   }[];
//   likedByMe?: boolean;
//   author: Author;
//   publishDate?: Date; 
// }

/** Minimum horizontal travel (px) before a touch counts as a swipe. */
const SWIPE_THRESHOLD = 50;

export default function PostImageCarousel({ post }: PostImageCarouselProps) {
  const { t } = useTranslation("common");
  const { lang } = useLocale();
  const [mainIndex, setMainIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  if (!post?.image?.url) {
    return (
      <div className="rounded-3xl overflow-hidden bg-gray-100/80 aspect-[16/10] flex items-center justify-center border border-gray-100">
        <p className="text-gray-400 text-sm font-medium">{t("post.noImage")}</p>
      </div>
    );
  }

  // Handle single or multiple images if post has an array
  const images =
    Array.isArray(post.images) && post?.images?.length > 0
      ? (post as any).images.map((url: string, i: number) => ({
          url,
          name: `image-${i}`,
        }))
      : [post.image];

  const handlePrev = () => {
    setMainIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleNext = () => {
    setMainIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length < 2) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta < 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="rounded-3xl overflow-hidden bg-gray-900 shadow-md relative group">
      {/* Main Image View */}
      <div
        className="relative aspect-[16/10] sm:aspect-[16/9] bg-black/90 flex items-center justify-center overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding track — one full-width slide per image */}
        <div
          dir="ltr"
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{
            transform:
              lang === "ar"
                ? `translateX(${mainIndex * 100}%)`
                : `translateX(-${mainIndex * 100}%)`,
          }}
        >
          {images.map((img: any, i: number) => (
            <img
              key={i}
              src={img.url}
              alt={img.name || "Post image"}
              className="h-full w-full shrink-0 object-cover"
              draggable={false}
            />
          ))}
        </div>

        {/* Floating Glassmorphic Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-md p-2.5 text-white hover:bg-white/40 transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              {lang === "ar" ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-md p-2.5 text-white hover:bg-white/40 transition-all duration-300 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              {lang === "ar" ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
              {images.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setMainIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    idx === mainIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80",
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Image Counter Badge */}
        {images.length > 1 && (
          <div className="absolute top-4 end-4 bg-black/60 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-md">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {mainIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails strip if multiple */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3 bg-white border-t border-gray-100">
          {images.map((img: any, i: number) => (
            <button
              key={i}
              onClick={() => setMainIndex(i)}
              className={cn(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                i === mainIndex
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
