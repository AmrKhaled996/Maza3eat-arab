import { useEffect, useRef } from "react";
import cn from "../../../utils/Cn";
import { LocateFixedIcon } from "lucide-react";
import { useLocale } from "../../../i18n/useLocale";
import { useTranslation } from "react-i18next";

const videos = [
  { vid: "/VideoSlider/1.mp4", name: "Lebanon, Beirut Corniche" },
  { vid: "/VideoSlider/2.mp4", name: "KSA, Red Sea" },
  { vid: "/VideoSlider/3.mp4", name: "Oman, Jebel Akhdar" },
  { vid: "/VideoSlider/4.mp4", name: "Egypt, Khan el-Khalili" },
  { vid: "/VideoSlider/5.mp4", name: "Morocco, Chefchaouen" },
  { vid: "/VideoSlider/6.mp4", name: "Jordan, Petra" },
  { vid: "/VideoSlider/7.mp4", name: "Jordan, Wadi Rum" },
  { vid: "/VideoSlider/8.mp4", name: "UAE,Dubai downtown" },
  { vid: "/VideoSlider/9.mp4", name: "Egypt, Ras El Hekma" },
];

const ArVideos = [
  { vid: "/VideoSlider/1.mp4", name: "لبنان، كورنيش بيروت" },
  { vid: "/VideoSlider/2.mp4", name: "السعودية، البحر الأحمر" },
  { vid: "/VideoSlider/3.mp4", name: "عُمان، الجبل الأخضر" },
  { vid: "/VideoSlider/4.mp4", name: "مصر، خان الخليلي" },
  { vid: "/VideoSlider/5.mp4", name: "المغرب، شفشاون" },
  { vid: "/VideoSlider/6.mp4", name: "الأردن، البتراء" },
  { vid: "/VideoSlider/7.mp4", name: "الأردن، وادي رم" },
  { vid: "/VideoSlider/8.mp4", name: "الإمارات، وسط مدينة دبي" },
  { vid: "/VideoSlider/9.mp4", name: "مصر، رأس الحكمة" },
];
export default function InfiniteSlider() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastendedVideoRef = useRef<HTMLVideoElement | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { lang } = useLocale();

  const videosList = [...videos, ...videos];
  const ArVideosList = [...ArVideos, ...ArVideos];

  useEffect(() => {
    const handleScroll = () => {
      const center = window.innerWidth / 2;
      const CENTER_THRESHOLD = window.innerWidth * 0.05;

      let nextVideo: HTMLVideoElement | null = null;
      let closestDistance = Infinity;

      videoRefs.current.forEach((video) => {
        if (!video) return;
        if (video === lastendedVideoRef.current) return; // skip ended video

        const rect = video.getBoundingClientRect();
        const videoCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - videoCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextVideo = video;
        }
      });

      // ✅ If the ended video is still closest (slider hasn't moved away yet), do nothing
      if (!nextVideo) return;

      videoRefs.current.forEach((video) => {
        if (!video) return;

        if (video === nextVideo) {
          if (closestDistance < CENTER_THRESHOLD) {
            if (video.paused) {
              video.play();
              sliderRef.current?.style.setProperty(
                "animation-play-state",
                "paused",
              );

              video.onended = () => {
                lastendedVideoRef.current = video;
                sliderRef.current?.style.setProperty(
                  "animation-play-state",
                  "running",
                );
              };
            }
          }
        } else {
          if (video !== lastendedVideoRef.current) {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    };

    const interval = setInterval(handleScroll, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden w-full py-10">
      <div ref={sliderRef} className={cn("flex w-max gap-4 scrollSlider")}>
        {(lang === "ar" ? ArVideosList : videosList).map((vid, index) => (
          <div key={index} className="relative aspect-9/16 w-72 shrink-0">
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              muted
              playsInline
              disablePictureInPicture
              className="absolute w-full h-full object-cover rounded-xl"
            >
              <source src={vid.vid} type="video/mp4" />
            </video>
            <div className="absolute top-2 left-2  opacity-80  z-2000000000 ">
              <button className="flex items-center gap-3 text-sm font-bold  rounded-full bg-black/30 pt-2 ">
                <span className=" text-white font-bold px-6 pb-1 text-center align-middle flex items-center justify-between gap-2 ">
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="white"
                    fill="white"
                    clip-rule="evenodd"
                  >
                    <path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602" />
                  </svg>
                  {vid.name}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
