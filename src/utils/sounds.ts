import likeSoundFile from "../assets/sounds/like-sound.mp3";
import notificationSoundFile from "../assets/sounds/notification-sound.mp3";

let likeAudio: HTMLAudioElement | null = null;
let notificationAudio: HTMLAudioElement | null = null;

export function playLikeSound() {
  try {
    if (!likeAudio) {
      likeAudio = new Audio(likeSoundFile);
      likeAudio.volume = 0.4;
    }
    likeAudio.currentTime = 0;
    likeAudio.play().catch(() => {});
  } catch {
    // Silently fail if audio can't play
  }
}

export function playNotificationSound() {
  try {
    if (!notificationAudio) {
      notificationAudio = new Audio(notificationSoundFile);
      notificationAudio.volume = 0.5;
    }
    notificationAudio.currentTime = 0;
    notificationAudio.play().catch(() => {});
  } catch {
    // Silently fail if audio can't play
  }
}
