import { motion } from "framer-motion";
import { useLocale } from "@/hooks/use-locale";
import type { TranslationKey } from "@/lib/i18n";

const MOCK_PAYLOAD = `{
  "endpoint": "contextof.me/nakamoto",
  "protocol": "A2A/1.0",
  "timestamp": "2026-03-29T00:00:00Z",
  "slices": [
    {
      "id": "a7f3c2e1",
      "type": "paradigm_shift",
      "content": "Skill is the APP of the AI era.",
      "weight": 0.97,
      "tags": ["meta-cognition", "a2a", "first-principles"]
    },
    {
      "id": "b8e4d3f2",
      "type": "operational_maxim",
      "content": "Ship the protocol, not the product.",
      "weight": 0.91,
      "tags": ["strategy", "protocol-thinking"]
    }
  ],
  "meta": {
    "total_slices": 142,
    "vault_status": "PUBLIC",
    "last_ingestion": "2026-03-28T18:42:00Z"
  }
}`;

const VaultPreview = () => {
  const { t } = useLocale();

  return (
    <section className="w-full max-w-3xl mx-auto px-8 py-28">
      <div className="mb-20 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#444]">
          ── PREVIEW ──
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight mt-4">
          {t("vaultPreviewTitle" as TranslationKey)}
        </h2>
        <p className="text-sm text-[#555] mt-3 font-body">
          {t("vaultPreviewDesc" as TranslationKey)}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Terminal chrome */}
        <div className="border border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
            <span className="ml-3 text-[10px] text-[#444] tracking-[0.15em]">
              GET contextof.me/nakamoto
            </span>
          </div>
          <pre className="p-6 overflow-x-auto text-xs leading-relaxed">
            <code>
              {MOCK_PAYLOAD.split('\n').map((line, i) => (
                <span key={i} className="block">
                  <span className="text-[#333] select-none mr-4 inline-block w-5 text-right">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {tokenize(line).map((tok, j) => (
                    <span key={j} className={tok.cls}>{tok.text}</span>
                  ))}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </motion.div>
    </section>
  );
};

export default VaultPreview;
