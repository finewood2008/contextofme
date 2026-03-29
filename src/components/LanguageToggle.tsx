import { useLocale } from "@/hooks/use-locale";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
      title={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
};

export default LanguageToggle;
