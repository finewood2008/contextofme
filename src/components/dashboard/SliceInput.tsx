import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
import { Send } from "lucide-react";

interface SliceInputProps {
  apiToken: string;
  onSliceCreated: (slice: { id: string; raw_text: string; purified_text: string | null; created_at: string }) => void;
}

const SliceInput = ({ apiToken, onSliceCreated }: SliceInputProps) => {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 1) return;
    if (trimmed.length > 5000) {
      toast({ title: t("tooLong"), description: t("tooLongDesc"), variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("ingest", {
        headers: { Authorization: `Bearer ${apiToken}` },
        body: { text: trimmed },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || t("transmissionFailed"));

      onSliceCreated({
        id: data.slice.id,
        raw_text: trimmed,
        purified_text: null,
        created_at: data.slice.created_at,
      });
      setText("");
      toast({ title: t("transmitted"), description: t("transmittedDesc") });
    } catch (e: any) {
      toast({ title: t("error"), description: e.message || t("transmissionFailed"), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-sm p-4 space-y-3">
      <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
        {t("transmitThought")}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
        placeholder={t("transmitPlaceholder")}
        maxLength={5000}
        rows={3}
        disabled={submitting}
        className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/30 outline-none border border-border rounded-sm p-3 resize-none disabled:opacity-50"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground/40">
            {text.length}/5000
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/30">{t("ctrlEnterHint")}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || text.trim().length === 0}
          className="font-mono text-xs text-foreground border border-border px-3 py-1.5 hover:bg-accent transition-colors disabled:opacity-30 flex items-center gap-2"
        >
          {submitting ? (
            <span className="animate-pulse">{t("purifying")}</span>
          ) : (
            <>
              <Send className="w-3 h-3" />
              {t("transmitButton")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SliceInput;
