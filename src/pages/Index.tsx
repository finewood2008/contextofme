import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import { useLocale } from "@/hooks/use-locale";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border">
        <span className="font-display text-lg tracking-tight text-foreground">
          CONTEXT<span className="text-muted-foreground">of.me</span>
        </span>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/auth")}
          >
            {t("signIn")}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
          >
            {t("getStarted")}
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8">
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
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-px h-24 bg-border mt-20 origin-top"
          style={{ transform: "scaleY(1)" }}
        />
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
