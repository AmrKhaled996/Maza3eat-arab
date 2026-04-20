import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "../../../Types/Post";
import cn from "../../../utils/Cn";

interface PostImageCarouselProps {
  post: Post | undefined;
}

export default function PostImageCarousel({ post }: PostImageCarouselProps) {
  const [mainIndex, setMainIndex] = useState(0);
  
  if (!post?.image?.url) {
    return (
      <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[16/10] flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  // For now, we only have one image in the Post type, but structure allows for expansion
  const images = [post.image];
  const mainImage = images[mainIndex];

  const handlePrev = () => {
    setMainIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleNext = () => {
    setMainIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-gray-100">
      {/* Main Image */}
      <div className="relative aspect-[16/10] bg-gray-100 flex items-center justify-center">
        <img
          src={mainImage.url}
          alt={mainImage.name}
          className="w-full h-full object-cover"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Count Badge */}
        {mainImage.remainingImages !== undefined && mainImage.remainingImages > 1 && (
          <span className="absolute top-3 end-3 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            {mainIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3 bg-white">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setMainIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === mainIndex ? "border-primary" : "border-transparent"
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
