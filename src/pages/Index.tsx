import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLocale } from "@/hooks/use-locale";
import { useToast } from "@/hooks/use-toast";
import HeroSection from "@/components/landing/HeroSection";
import ArchitectureFlow from "@/components/landing/ArchitectureFlow";
import DistributionHub from "@/components/landing/DistributionHub";
import FAQ from "@/components/landing/FAQ";
import VaultPreview from "@/components/landing/VaultPreview";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-[#000000] text-[#f5f5f5] flex flex-col font-mono">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[#1a1a1a]">
        <span className="font-display text-lg tracking-tight">
          CONTEXT<span className="text-[#666]">of.me</span>
        </span>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => navigate("/auth")}
            className="border border-[#333] px-4 py-2 text-xs tracking-[0.15em] uppercase hover:border-[#f5f5f5] transition-colors"
          >
            {t("getStarted")}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        <HeroSection />
        <div className="w-16 h-px bg-[#1a1a1a] mx-auto" />
        <ArchitectureFlow />
        <div className="w-16 h-px bg-[#1a1a1a] mx-auto" />
        <DistributionHub />
        <div className="w-16 h-px bg-[#1a1a1a] mx-auto" />
        <VaultPreview />
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-[#1a1a1a]">
        <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#444]">
          <span>{t("footerCopy")}</span>
          <span className="animate-pulse">●</span>
          <span>A2A PROTOCOL v1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
