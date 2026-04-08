import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const DESTINATIONS = [
  {
    key: "dest1",
    image:
      "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&q=80",
    location: "Saudi Arabia",
  },
  {
    key: "dest2",
    image:
      "https://images.unsplash.com/photo-1593663094448-9ea85c6e8456?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Egypt",
  },
  {
    key: "dest3",
    image:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=80",
    location: "Morocco",
  },
  {
    key: "dest4",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    location: "Dubai, UAE",
  },
];

export default function DestinationsGrid() {
  const { t } = useTranslation("common");

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {DESTINATIONS.map((d) => (
          <div
            key={d.key}
            className="relative group rounded-2xl overflow-hidden h-56 shadow-md hover:shadow-xl transition-shadow cursor-pointer"
          >
            <img
              src={d.image}
              alt={t(`about.${d.key}`)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 start-4 z-10">
              <span className="flex items-center gap-1 text-white/80 text-xs mb-1">
                <MapPin size={12} /> {d.location}
              </span>
              <h3 className="text-white font-bold text-lg drop-shadow">
                {t(`about.${d.key}`)}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
