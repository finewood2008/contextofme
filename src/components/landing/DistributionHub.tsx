import { motion } from "framer-motion";
import { Copy, Download } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { useToast } from "@/hooks/use-toast";
import type { TranslationKey } from "@/lib/i18n";

const DistributionHub = () => {
  const { t } = useLocale();
  const { toast } = useToast();

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("copied"), description: t("copiedCommand") });
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-8 py-28">
      <div className="mb-20 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#444]">
          ── DISTRIBUTION ──
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mt-4">
          {t("distHubTitle" as TranslationKey)}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Block A: Deep Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-[#1a1a1a] p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#555] tracking-[0.2em]">
              {t("distDeepLinkLabel" as TranslationKey)}
            </span>
            <span className="text-[10px] text-[#333] tracking-[0.15em] border border-[#222] px-2 py-0.5">
              {t("distDeepLinkTag" as TranslationKey)}
            </span>
          </div>
          <h3 className="font-display text-lg tracking-tight">
            {t("distDeepLinkTitle" as TranslationKey)}
          </h3>
          <p className="text-sm text-[#666] font-body">
            {t("distDeepLinkDesc" as TranslationKey)}
          </p>
          <a
            href="openclaw://install/contextofme"
            className="inline-block border border-[#333] px-6 py-3 text-xs tracking-[0.15em] uppercase hover:border-[#f5f5f5] transition-colors"
          >
            [ {t("distDeepLinkAction" as TranslationKey)} ]
          </a>
        </motion.div>

        {/* Block B: Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border border-[#1a1a1a] p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#555] tracking-[0.2em]">
              {t("distTerminalLabel" as TranslationKey)}
            </span>
            <span className="text-[10px] text-[#333] tracking-[0.15em] border border-[#222] px-2 py-0.5">
              {t("distTerminalTag" as TranslationKey)}
            </span>
          </div>
          <h3 className="font-display text-lg tracking-tight">
            {t("distTerminalTitle" as TranslationKey)}
          </h3>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 flex items-center justify-between gap-3">
            <code className="text-sm text-[#ccc] break-all select-all">
              $ {t("distTerminalCmd" as TranslationKey)}
            </code>
            <button
              onClick={() => copy(t("distTerminalCmd" as TranslationKey))}
              className="text-[#444] hover:text-[#f5f5f5] transition-colors shrink-0"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Block C: Manual Binary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border border-[#1a1a1a] p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#555] tracking-[0.2em]">
              {t("distManualLabel" as TranslationKey)}
            </span>
            <span className="text-[10px] text-[#333] tracking-[0.15em] border border-[#222] px-2 py-0.5">
              {t("distManualTag" as TranslationKey)}
            </span>
          </div>
          <h3 className="font-display text-lg tracking-tight">
            {t("distManualTitle" as TranslationKey)}
          </h3>
          <a
            href="/contextofme-skill.zip"
            download
            className="inline-flex items-center gap-2 border border-[#333] px-6 py-3 text-xs tracking-[0.15em] uppercase hover:border-[#f5f5f5] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            [ {t("distManualAction" as TranslationKey)} ]
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default DistributionHub;
