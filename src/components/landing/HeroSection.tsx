import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center px-8 min-h-[85vh]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl text-center space-y-10"
      >
        <div className="inline-block px-3 py-1 border border-[#222] mb-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#555]">
            {t("heroTagline")}
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] font-light tracking-tight leading-[0.85]">
          {t("heroTitle1")}
          <br />
          <span className="text-[#555]">{t("heroTitle2")}</span>
        </h1>

        <p className="text-[#777] text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light font-body">
          {t("heroDesc")}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => navigate("/auth")}
            className="border border-[#f5f5f5] bg-transparent px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#f5f5f5] hover:text-[#000] transition-all duration-300"
          >
            [ {t("heroButton")} ]
          </button>
          <a
            href="https://github.com/finewood2008/contextofme"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#333] px-5 py-4 text-xs tracking-[0.15em] uppercase hover:border-[#f5f5f5] transition-colors inline-flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-px h-24 bg-[#1a1a1a] mt-20 origin-top"
      />
    </div>
  );
};

export default HeroSection;
