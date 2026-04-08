import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Send, Mail } from "lucide-react";

export default function ContactForm() {
  const { t } = useTranslation("common");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    // مؤقت لحد ما نحدد تتعمل ازاي
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    }, 1200);
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="text-primary" size={28} />
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {t("about.contactTitle")}
            </h2>
          </div>
          <p className="text-gray-500 text-[15px]">
            {t("about.contactSubtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t("about.contactName")}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t("about.contactEmail")}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t("about.contactMessage")}
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            {sent && (
              <p className="text-green-600 text-sm font-medium animate-pulse">
                {t("about.contactSuccess")}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="ms-auto flex items-center gap-2 button1 hover:scale-105 transition-transform disabled:opacity-60"
            >
              <Send size={16} />
              {sending ? t("about.contactSending") : t("about.contactSend")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
