import { useState } from "react";

type AvatarProps = {
  name?: string;
  src?: string | null;
  className?: string;
  style?: React.CSSProperties;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const colors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-pink-500",
];

function getAvatarColor(name: string) {
  const value = name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return colors[value % colors.length];
}

export default function Avatar({
  name = "User",
  src,
  className = "h-10 w-10",
  style,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const trimmedName = name.trim();
  const initial = trimmedName ? trimmedName.charAt(0).toUpperCase() : "U";
  const backgroundColor = getAvatarColor(trimmedName || "User");

  const showImage = src && !imageError;

  return (
    <div
      className={`${className} ${backgroundColor} flex items-center justify-center overflow-hidden rounded-full font-semibold text-white`}
      style={style}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
          {...props}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}