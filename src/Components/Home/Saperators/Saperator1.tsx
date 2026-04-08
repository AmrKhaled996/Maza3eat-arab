import { useEffect, useRef } from "react";

const videos = [
  "/VideoSlider/1.mp4",
  "/VideoSlider/2.mp4",
  "/VideoSlider/3.mp4",
  "/VideoSlider/4.mp4",
  "/VideoSlider/5.mp4",
  "/VideoSlider/6.mp4",
  "/VideoSlider/7.mp4",
  "/VideoSlider/8.mp4",
  "/VideoSlider/9.mp4",
];

export default function InfiniteSlider() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const videosList = [...videos, ...videos];

  useEffect(() => {
    const handleScroll = () => {
      const center = window.innerWidth / 2;
      // console.log("center:",center)

      let closestVideo: HTMLVideoElement | null = null;
      let closestDistance = Infinity;

      videoRefs.current.forEach((video) => {
        // console.log("video",video)
        if (!video) return;

        const rect = video.getBoundingClientRect();
        // console.log("rect:",rect,"video:",video)
        
        // calculate the crn
        const videoCenter = rect.left + rect.width / 2;

        const distance = Math.abs(center - videoCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestVideo = video;
        }
      });

      // Play only closest video
      videoRefs.current.forEach((video) => {
        if (!video) return;

        if (video === closestVideo) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    const interval = setInterval(handleScroll, 200); // check continuously

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="overflow-hidden w-full py-10">
      <div className="flex w-max scrollSlider gap-4">
        {videosList.map((vid, index) => (
          <div key={index} className="aspect-9/16 w-48 shrink-0">
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              muted
              loop
              playsInline
              disablePictureInPicture
              className="w-full h-full object-cover rounded-xl"
            >
              <source src={vid} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}
