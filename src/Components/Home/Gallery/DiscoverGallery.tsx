import { memo } from "react";
import { useTranslation } from "react-i18next";

// Gallery images from assets/images/gallery
import img1 from "../../../assets/images/gallery/pexels-adrianlimani-36245736.webp";
import img2 from "../../../assets/images/gallery/pexels-alexazabache-3723031.webp";
import img3 from "../../../assets/images/gallery/pexels-alexey-k-458081116-36505465.webp";
import img4 from "../../../assets/images/gallery/pexels-ali-albalawi-125802349-9997452.webp";
import img5 from "../../../assets/images/gallery/pexels-asadphoto-28408486.webp";
import img6 from "../../../assets/images/gallery/pexels-francesco-ungaro-998657.webp";
import img7 from "../../../assets/images/gallery/pexels-jhonatan-torres-marin-560933651-16869719.webp";
import img8 from "../../../assets/images/gallery/pexels-mck-242487578-12316006.webp";
import img9 from "../../../assets/images/gallery/pexels-miguel-cuenca-67882473-14313481.webp";
import img10 from "../../../assets/images/gallery/pexels-mographe-30131848.webp";
import img11 from "../../../assets/images/gallery/pexels-mographe-30374224.webp";
import img12 from "../../../assets/images/gallery/saudi.webp";

import logoRight from "../../../assets/images/gallery/logo-right.gif";
import { useLocale } from "../../../i18n/useLocale";

/**
 * Cards fill the full height of their row and only vary in width. Mixing card
 * heights inside a centred flex row leaves dead bands above and below the
 * shorter cards — that was the empty space in this section.
 */
const row1 = [
  { src: img1, alt: "Gallery 1", width: "w-60 sm:w-72" },
  { src: img2, alt: "Gallery 2", width: "w-44 sm:w-52" },
  { src: img3, alt: "Gallery 3", width: "w-72 sm:w-96" },
  { src: img4, alt: "Gallery 4", width: "w-52 sm:w-60" },
  { src: img5, alt: "Gallery 5", width: "w-40 sm:w-48" },
  { src: img6, alt: "Gallery 6", width: "w-64 sm:w-80" },
];

const row2 = [
  { src: img7, alt: "Gallery 7", width: "w-52 sm:w-64" },
  { src: img8, alt: "Gallery 8", width: "w-72 sm:w-96" },
  { src: img9, alt: "Gallery 9", width: "w-40 sm:w-48" },
  { src: img10, alt: "Gallery 10", width: "w-60 sm:w-72" },
  { src: img11, alt: "Gallery 11", width: "w-44 sm:w-52" },
  { src: img12, alt: "Gallery 12", width: "w-64 sm:w-80" },
];

type GalleryImage = (typeof row1)[number];

function GalleryCard({ img }: { img: GalleryImage }) {
  return (
    <div
      className={`${img.width} h-full shrink-0 relative group overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg`}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] transform-gpu"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

function MarqueeRow({
  images,
  direction,
  height,
}: {
  images: GalleryImage[];
  direction: "left" | "right";
  height: string;
}) {
  const {lang} = useLocale();
  // The keyframe shifts the track by -50%, so EACH HALF must be wider than the
  // viewport — otherwise the tail of the track runs out mid-screen and leaves a
  // blank gap. Three copies per half (six total) covers ultra-wide monitors.
  const half =lang==="en"? [...images, ...images, ...images]:[...images, ...images, ...images].reverse();
  const track = [...half, ...half];

  return (
    <div className={`relative w-full overflow-hidden gallery-fade-edges ${height}`}>
      <div
        className={`${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } flex items-stretch gap-3 sm:gap-4 h-full`}
      >
        {track.map((img, i) => (
          <GalleryCard key={`${direction}-${i}`} img={img} />
        ))}
      </div>
    </div>
  );
}

function DiscoverGallery() {
  const { t } = useTranslation("common");
  const {lang} = useLocale();

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gray-50/60 [content-visibility:auto]">
      {/* Soft background wash */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/2 -start-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl transform-gpu -translate-y-1/2" />
        <div className="absolute top-1/2 -end-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl transform-gpu -translate-y-1/2" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              {t("home.galleryTitle", "Discover the Moments")}
            </h2>
            <img
              src={logoRight}
              alt=""
              aria-hidden="true"
              className="h-10 w-10 md:h-11 md:w-11 object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {t(
              "home.gallerySubtitle",
              "Explore our gallery for stunning travel photos and the best vibes"
            )}
          </p>
        </div>

        {/* dir="ltr" keeps the marquee travelling the same way in both locales */}
        <div dir={ "ltr"} className="flex flex-col gap-3 sm:gap-4 w-full marquee-track">
          <MarqueeRow images={row1} direction="left" height="h-40 sm:h-48 md:h-56" />
          <MarqueeRow images={row2} direction="right" height="h-32 sm:h-40 md:h-44" />
        </div>
      </div>
    </section>
  );
}

export default memo(DiscoverGallery);
