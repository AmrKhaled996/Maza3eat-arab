import { useRef, useState } from "react";
import {
  ArrowUpRightIcon,
  ChevronLeft,
  ChevronRight,
  Layers,
  ZoomIn,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Post } from "../../../Types/Post";
import cn from "../../../utils/Cn";
import { useLocale } from "../../../i18n/useLocale";
import PostImageZoomDialog from "./PostImageZoomDialog";

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
  const [openDialog, setOpenDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState();
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
            <div key={img.id ?? i} className="relative h-full w-full shrink-0">
              <img
                src={img.url}
                alt={img.name || "Post image"}
                className="h-full w-full object-cover"
                draggable={false}
                onClick={() => {
                  // setImageDialog(img);
                  // setOpenDialog(true);
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setImageDialog(img);
                  setOpenDialog(true);
                }}
                className={`
            absolute

            ${lang === "ar" ? "right-4":"left-4"} 
             top-4 z-10
            rounded-full
            bg-black/60
            p-2
            text-white
            backdrop-blur-md
            transition
            hover:bg-black/70
          `}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.7188 3.75V7.5C16.7188 7.62432 16.6694 7.74355 16.5815 7.83146C16.4935 7.91936 16.3743 7.96875 16.25 7.96875C16.1257 7.96875 16.0065 7.91936 15.9185 7.83146C15.8306 7.74355 15.7812 7.62432 15.7812 7.5V4.88125L11.5813 9.08125C11.4924 9.16405 11.3749 9.20913 11.2534 9.20698C11.132 9.20484 11.0161 9.15565 10.9302 9.06976C10.8444 8.98388 10.7952 8.86801 10.793 8.74658C10.7909 8.62514 10.8359 8.50761 10.9187 8.41875L15.1188 4.21875H12.5C12.3757 4.21875 12.2565 4.16936 12.1685 4.08146C12.0806 3.99355 12.0312 3.87432 12.0312 3.75C12.0312 3.62568 12.0806 3.50645 12.1685 3.41854C12.2565 3.33064 12.3757 3.28125 12.5 3.28125H16.25C16.3743 3.28125 16.4935 3.33064 16.5815 3.41854C16.6694 3.50645 16.7188 3.62568 16.7188 3.75ZM8.41875 10.9187L4.21875 15.1188V12.5C4.21875 12.3757 4.16936 12.2565 4.08146 12.1685C3.99355 12.0806 3.87432 12.0312 3.75 12.0312C3.62568 12.0312 3.50645 12.0806 3.41854 12.1685C3.33064 12.2565 3.28125 12.3757 3.28125 12.5V16.25C3.28125 16.3743 3.33064 16.4935 3.41854 16.5815C3.50645 16.6694 3.62568 16.7188 3.75 16.7188H7.5C7.62432 16.7188 7.74355 16.6694 7.83146 16.5815C7.91936 16.4935 7.96875 16.3743 7.96875 16.25C7.96875 16.1257 7.91936 16.0065 7.83146 15.9185C7.74355 15.8306 7.62432 15.7812 7.5 15.7812H4.88125L9.08125 11.5813C9.16405 11.4924 9.20913 11.3749 9.20698 11.2534C9.20484 11.132 9.15565 11.0161 9.06976 10.9302C8.98388 10.8444 8.86801 10.7952 8.74658 10.793C8.62514 10.7909 8.50761 10.8359 8.41875 10.9187Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
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
      {openDialog && (
        <PostImageZoomDialog
          img={imageDialog}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </div>
  );
}
