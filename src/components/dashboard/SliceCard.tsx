import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Check, X, Send, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const COLLAPSED_HEIGHT = 120; // px

/** Try to parse raw_text as structured JSON and render nicely */
function SliceContent({ text }: { text: string }) {
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const obj = JSON.parse(trimmed);
      
      // Structured A2A slice - render nicely
      if (obj.core_insight || obj.topic || obj.a2a_summary || obj.original_quote) {
        return (
          <div className="space-y-2.5">
            {obj.topic && (
              <h4 className="text-foreground font-medium text-sm tracking-tight">{obj.topic}</h4>
            )}
            {obj.core_insight && (
              <p className="text-foreground text-sm leading-relaxed">{obj.core_insight}</p>
            )}
            {obj.original_quote && (
              <blockquote className="border-l-2 border-muted-foreground/20 pl-3 text-muted-foreground text-xs leading-relaxed italic">
                {obj.original_quote}
              </blockquote>
            )}
            {obj.a2a_summary && (
              <p className="text-muted-foreground text-xs leading-relaxed">
                <span className="font-mono text-[10px] text-muted-foreground/60 mr-1.5">A2A</span>
                {obj.a2a_summary}
              </p>
            )}
            {obj.tags && Array.isArray(obj.tags) && obj.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {obj.tags.map((tag: string, i: number) => (
                  <span key={i} className="font-mono text-[10px] text-muted-foreground/50 bg-muted/30 px-1.5 py-0.5 rounded-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      }
    }
  } catch (e) {
    // JSON parse failed, fall through to plain text
  }

  // Plain text fallback
  return (
    <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
  );
}

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
  userId: string;
}

const SliceCard = ({ slice, index, onDelete, onUpdate, userId }: SliceCardProps) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(slice.raw_text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t, locale } = useLocale();

  useEffect(() => {
    if (contentRef.current) {
      setNeedsCollapse(contentRef.current.scrollHeight > COLLAPSED_HEIGHT);
    }
  }, [slice.raw_text]);

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

  const handlePostToX = async () => {
    setPosting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Extract text for posting
      let postText = slice.raw_text;
      try {
        const trimmed = slice.raw_text.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
          const obj = JSON.parse(trimmed);
          // Use core_insight if available, otherwise use original_quote or full text
          postText = obj.core_insight || obj.original_quote || obj.topic || slice.raw_text;
        }
      } catch {
        // Use raw text if JSON parsing fails
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/post-to-x`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            slice_id: slice.id,
            text: postText,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to post to X");
      }

      const result = await response.json();
      toast({
        title: "Posted to X",
        description: "Your slice has been posted to X platform",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post to X",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
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
        <div className="relative">
          <div
            ref={contentRef}
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: !expanded && needsCollapse ? COLLAPSED_HEIGHT : undefined }}
          >
            <SliceContent text={slice.raw_text} />
          </div>
          {needsCollapse && !expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
          )}
          {needsCollapse && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
              {expanded ? (locale === "zh" ? "收起" : "COLLAPSE") : (locale === "zh" ? "展开" : "EXPAND")}
            </button>
          )}
        </div>
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
            onClick={handlePostToX}
            disabled={posting}
            className="text-muted-foreground hover:text-blue-400 transition-colors disabled:opacity-50"
            title="Post to X"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setEditing(true); setEditText(slice.raw_text); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <DeleteConfirmDialog onConfirm={handleDelete} disabled={deleting} />
        </div>
      </div>
    </motion.div>
  );
};

export default SliceCard;
