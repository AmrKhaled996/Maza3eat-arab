import { Mail } from "lucide-react";

export function ContactButton() {
  return (
    <button className="flex items-center gap-1 text-[11px] font-semibold bg-purple-200 text-purple-600 border border-purple-200 px-2.5 py-0.5 rounded-full hover:bg-purple-100 transition-colors">
      <Mail size={12} className="text-secondary" /> تواصل
    </button>
  );
}