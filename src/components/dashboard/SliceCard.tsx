import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";

interface Slice {
  id: string;
  raw_text: string;
  purified_text: string | null;
  created_at: string;
}

interface SliceCardProps {
  slice: Slice;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

const SliceCard = ({ slice, index, onDelete, onUpdate }: SliceCardProps) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(slice.raw_text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const { t, locale } = useLocale();

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("slices")
      .update({ raw_text: editText })
      .eq("id", slice.id);

    if (error) {
      toast({ title: t("error"), description: t("failedUpdateSlice"), variant: "destructive" });
    } else {
      onUpdate(slice.id, editText);
      setEditing(false);
      toast({ title: t("updated"), description: t("sliceUpdated") });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase
      .from("slices")
      .delete()
      .eq("id", slice.id);

    if (error) {
      toast({ title: t("error"), description: t("failedDelete"), variant: "destructive" });
      setDeleting(false);
    } else {
      onDelete(slice.id);
      toast({ title: t("deleted"), description: t("sliceRemoved") });
    }
  };

  const dateFmtLocale = locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-US";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03 }}
      className="glass-card rounded-sm p-5 space-y-3 group"
    >
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-transparent border border-border rounded-sm p-3 font-mono text-sm text-foreground outline-none focus:border-foreground/30 transition-colors resize-none min-h-[80px]"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 font-mono text-xs text-foreground border border-border px-2 py-1 hover:bg-accent transition-colors disabled:opacity-50"
            >
              <Check className="w-3 h-3" />
              {saving ? "..." : t("save")}
            </button>
            <button
              onClick={() => { setEditing(false); setEditText(slice.raw_text); }}
              className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              <X className="w-3 h-3" />
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
          {slice.raw_text}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(slice.created_at).toLocaleDateString(dateFmtLocale, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setEditing(true); setEditText(slice.raw_text); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SliceCard;
