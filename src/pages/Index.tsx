import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLocale } from "@/hooks/use-locale";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { toast } = useToast();

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("copied"), description: t("copiedCommand") });
  };

  const steps = [
    { label: t("a2aStep1Label"), title: t("a2aStep1Title"), desc: t("a2aStep1Desc"), tag: "SENSOR" },
    { label: t("a2aStep2Label"), title: t("a2aStep2Title"), desc: t("a2aStep2Desc"), tag: "INGEST" },
    { label: t("a2aStep3Label"), title: t("a2aStep3Title"), desc: t("a2aStep3Desc"), tag: "ENDPOINT" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border">
        <span className="font-display text-lg tracking-tight text-foreground">
          CONTEXT<span className="text-muted-foreground">of.me</span>
        </span>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
          >
            {t("getStarted")}
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center px-8 min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-center space-y-8"
          >
            <div className="inline-block px-3 py-1 border border-border rounded-sm mb-4">
              <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                {t("heroTagline")}
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] text-foreground">
              {t("heroTitle1")}
              <br />
              <span className="text-muted-foreground">{t("heroTitle2")}</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-light">
              {t("heroDesc")}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="font-mono text-sm tracking-wider px-8 py-6"
              >
                {t("heroButton")}
              </Button>
            </motion.div>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-px h-24 bg-border mt-20 origin-top"
          />
        </div>

        {/* Section 1: A2A Protocol Flow */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto px-8 py-24"
        >
          <div className="mb-16 text-center">
            <span className="font-mono text-xs text-muted-foreground tracking-[0.3em] uppercase">
              ── PROTOCOL ──
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight text-foreground mt-4">
              {t("a2aFlowTitle")}
            </h2>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[1.25rem] md:left-[1.5rem] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-12">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative pl-14 md:pl-16"
                >
                  {/* Node dot */}
                  <div className="absolute left-[0.85rem] md:left-[1.1rem] top-1 w-3 h-3 border border-muted-foreground bg-background rounded-full" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
                        {step.label}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/50 tracking-[0.15em] border border-border px-2 py-0.5">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-lg md:text-xl text-foreground tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Divider */}
        <div className="w-16 h-px bg-border mx-auto" />

        {/* Section 2: Open Source & Install */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto px-8 py-24"
        >
          <div className="mb-16 text-center">
            <span className="font-mono text-xs text-muted-foreground tracking-[0.3em] uppercase">
              ── SOURCE ──
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight text-foreground mt-4">
              {t("openSourceTitle")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Block A: Agent Skill */}
            <div className="border border-border p-6 space-y-4">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
                BLOCK A — THE ENGINE
              </span>
              <h3 className="font-display text-lg text-foreground tracking-tight">
                {t("installSkillTitle")}
              </h3>
              <div className="bg-[hsl(0_0%_7%)] border border-border rounded-sm p-4 flex items-center justify-between gap-3">
                <code className="font-mono text-sm text-foreground break-all select-all">
                  {t("installSkillCmd")}
                </code>
                <button
                  onClick={() => copy(t("installSkillCmd"))}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <a
                href="https://clawhub.com/skills/contextofme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-mono text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
              >
                {t("viewOnClawhub")}
              </a>
            </div>

            {/* Block B: Open Source Frontend */}
            <div className="border border-border p-6 space-y-4">
              <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
                BLOCK B — THE VAULT UI
              </span>
              <h3 className="font-display text-lg text-foreground tracking-tight">
                {t("deployVaultTitle")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("deployVaultDesc")}
              </p>
              <div className="bg-[hsl(0_0%_7%)] border border-border rounded-sm p-4 flex items-center justify-between gap-3">
                <code className="font-mono text-sm text-foreground break-all select-all">
                  {t("deployVaultCmd")}
                </code>
                <button
                  onClick={() => copy(t("deployVaultCmd"))}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <a
                href="https://github.com/finewood/context-vault"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-mono text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
              >
                {t("viewOnGithub")}
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>{t("footerCopy")}</span>
          <span className="animate-pulse-slow">●</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
