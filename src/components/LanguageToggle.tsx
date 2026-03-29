import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/hooks/use-locale";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors p-2"
      >
        <Globe className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] border border-border bg-card rounded-sm shadow-lg overflow-hidden">
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 font-mono text-xs transition-colors ${
                locale === l.code
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
