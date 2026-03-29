import { motion } from "framer-motion";
import { useLocale } from "@/hooks/use-locale";
import type { TranslationKey } from "@/lib/i18n";

const ArchitectureFlow = () => {
  const { t } = useLocale();

  const steps = [
    {
      label: t("a2aStep1Label" as TranslationKey),
      tag: t("a2aStep1Tag" as TranslationKey),
      title: t("a2aStep1Title" as TranslationKey),
      desc: t("a2aStep1Desc" as TranslationKey),
    },
    {
      label: t("a2aStep2Label" as TranslationKey),
      tag: t("a2aStep2Tag" as TranslationKey),
      title: t("a2aStep2Title" as TranslationKey),
      desc: t("a2aStep2Desc" as TranslationKey),
    },
    {
      label: t("a2aStep3Label" as TranslationKey),
      tag: t("a2aStep3Tag" as TranslationKey),
      title: t("a2aStep3Title" as TranslationKey),
      desc: t("a2aStep3Desc" as TranslationKey),
    },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-8 py-28">
      <div className="mb-20 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#444]">
          ── PROTOCOL ──
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mt-4">
          {t("a2aFlowTitle")}
        </h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[6px] top-0 bottom-0 w-px bg-[#1a1a1a]" />

        <div className="space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative pl-12"
            >
              {/* Node */}
              <div className="absolute left-0 top-1 w-[13px] h-[13px] border border-[#444] bg-[#000] rounded-full" />

              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] text-[#555] tracking-[0.2em]">
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[#333] tracking-[0.15em] border border-[#222] px-2 py-0.5">
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-display text-lg md:text-xl tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed max-w-xl font-body">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureFlow;
