import { X } from "lucide-react";
import { useState } from "react";

type ImageDialogProps = {
  src: string;
  alt?: string;
  className?: string;
};

export default function PostImageZoomDialog({
  open,
  onClose,
  img,
}: {
  open: boolean;
  onClose: () => void;
  img: ImageDialogProps | any;
}) {
  console.log("image", img);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-200  backdrop-blur-xs"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 rounded-full text-2xl bg-white p-2 opacity-40 hover:cursor-pointer hover:opacity-80 transition-all duration-300 z-50"
        onClick={onClose}
      >
        <X />
      </button>

      <img
        src={img.url}
        alt={img.name}
        onClick={(e) => e.stopPropagation()}
        className="
              max-h-[95vh]
              max-w-[95wv]
              w-full
              h-full
              object-contain
            "
      />
      <div
        className="absolute inset-0 z-40"
        onClick={onClose}
      />
    </div>
  );
}
