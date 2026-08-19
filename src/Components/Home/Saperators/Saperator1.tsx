import { useEffect, useRef } from "react";
import cn from "../../../utils/Cn";
import { useLocale } from "../../../i18n/useLocale";

const videos = [
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360787/1.mp4",
    name: "Lebanon, Beirut Corniche",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360803/2.mp4",
    name: "KSA, Red Sea",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360711/3.mp4",
    name: "Oman, Jebel Akhdar",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360830/4.mp4",
    name: "Egypt, Khan el-Khalili",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360732/5.mp4",
    name: "Morocco, Chefchaouen",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360709/6.mp4",
    name: "Jordan, Petra",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360810/7.mp4",
    name: "Jordan, Wadi Rum",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360844/8.mp4",
    name: "UAE,Dubai downtown",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360850/9.mp4",
    name: "Egypt, El sahel Al shamaly",
  },
];

const ArVideos = [
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360787/1.mp4",
    name: "لبنان، كورنيش بيروت",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360803/2.mp4",
    name: "السعودية، البحر الأحمر",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360711/3.mp4",
    name: "عُمان، الجبل الأخضر",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360830/4.mp4",
    name: "مصر، خان الخليلي",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360732/5.mp4",
    name: "المغرب، شفشاون",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360709/6.mp4",
    name: "الأردن، البتراء",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360810/7.mp4",
    name: "الأردن، وادي رم",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360844/8.mp4",
    name: "الإمارات، وسط مدينة دبي",
  },
  {
    vid: "https://res.cloudinary.com/vxybxqkq/video/upload/v1786360850/9.mp4",
    name: "مصر، الساحل الشمالي",
  },
];
export default function InfiniteSlider() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const lastendedVideoRef = useRef<HTMLVideoElement | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { lang } = useLocale();
  const currentlyPlayingRef = useRef<HTMLVideoElement | null>(null);

  const videosList = [...videos, ...videos];
  const ArVideosList = [...ArVideos, ...ArVideos];
  const currentList = lang === "ar" ? ArVideosList : videosList;

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!sliderRef.current) return;

      // While a video is playing, do nothing else — just wait for it to end
      if (currentlyPlayingRef.current) {
        animationFrameId = requestAnimationFrame(handleScroll);
        return;
      }

      const center = window.innerWidth / 2;
      const CENTER_THRESHOLD = 4; // small px tolerance, exact-ish center

      let nextVideo: any = null;
      let closestDistance = Infinity;

      videoRefs.current.forEach((video) => {
        if (!video) return;
        const rect = (video as HTMLVideoElement).getBoundingClientRect();
        const videoCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - videoCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          nextVideo = video as HTMLVideoElement;
        }
      });

      // Reset the "skip" flag once that video has drifted away from center
      if (
        lastendedVideoRef.current &&
        (nextVideo !== lastendedVideoRef.current ||
          closestDistance > CENTER_THRESHOLD * 5)
      ) {
        lastendedVideoRef.current = null;
      }

      if (
        nextVideo &&
        closestDistance < CENTER_THRESHOLD &&
        nextVideo !== lastendedVideoRef.current
      ) {
        // Lock immediately so no other frame can pick a video while this plays
        currentlyPlayingRef.current = nextVideo;
        sliderRef.current.style.animationPlayState = "paused";

        // Force-stop every other video, no matter what state we think they're in
        videoRefs.current.forEach((v) => {
          if (v && v !== nextVideo) {
            v.pause();
            v.currentTime = 0;
          }
        });

        nextVideo.play().catch(() => {
          // play() failed (e.g. autoplay blocked) — release the lock so slider keeps moving
          currentlyPlayingRef.current = null;
          sliderRef.current!.style.animationPlayState = "running";
        });

        nextVideo.onended = () => {
          lastendedVideoRef.current = nextVideo;
          currentlyPlayingRef.current = null;
          if (sliderRef.current) {
            sliderRef.current.style.animationPlayState = "running";
          }
        };
      }

      animationFrameId = requestAnimationFrame(handleScroll);
    };

    animationFrameId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [lang]);

  return (
    <div className="overflow-hidden w-full py-10">
      <div ref={sliderRef} className={cn("flex w-max gap-4 scrollSlider")}>
        {currentList.map((vid, index) => (
          <div key={index} className="relative aspect-9/16 w-72 shrink-0">
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={vid.vid}
              muted
              playsInline
              disablePictureInPicture
              className="absolute w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-2 left-2  opacity-80  z-20 ">
              <button className="flex items-center gap-3 text-sm font-bold  rounded-full bg-black/30 pt-2 ">
                <span className=" text-white font-bold px-6 pb-1 text-center align-middle flex items-center justify-between gap-2 ">
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    clipRule="evenodd"
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
