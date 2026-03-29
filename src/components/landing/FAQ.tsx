import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import type { TranslationKey } from "@/lib/i18n";

const FAQ_KEYS = [
  { q: "faqQ1", a: "faqA1" },
  { q: "faqQ2", a: "faqA2" },
  { q: "faqQ3", a: "faqA3" },
  { q: "faqQ4", a: "faqA4" },
  { q: "faqQ5", a: "faqA5" },
  { q: "faqQ6", a: "faqA6" },
  { q: "faqQ7", a: "faqA7" },
];

const FAQ = () => {
  const { t } = useLocale();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="w-full max-w-3xl mx-auto px-8 py-28">
      <div className="mb-20 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight">
          {t("faqTitle" as TranslationKey)}
        </h2>
      </div>

      <div className="divide-y divide-[#1a1a1a] border-t border-b border-[#1a1a1a]">
        {FAQ_KEYS.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-sm tracking-wide text-[#ccc] group-hover:text-[#f5f5f5] transition-colors pr-4">
                  {t(item.q as TranslationKey)}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#444] shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-60 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-sm text-[#666] font-body leading-relaxed">
                  {t(item.a as TranslationKey)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
