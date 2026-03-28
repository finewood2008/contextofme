import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Pencil, Trash2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [showRaw, setShowRaw] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(slice.purified_text || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("slices")
      .update({ purified_text: editText })
      .eq("id", slice.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
    } else {
      onUpdate(slice.id, editText);
      setEditing(false);
      toast({ title: "Updated", description: "Slice updated." });
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
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
      setDeleting(false);
    } else {
      onDelete(slice.id);
      toast({ title: "Deleted", description: "Slice removed." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03 }}
      className="glass-card rounded-sm p-5 space-y-3 group"
    >
      {/* Purified text or edit mode */}
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
              {saving ? "..." : "SAVE"}
            </button>
            <button
              onClick={() => { setEditing(false); setEditText(slice.purified_text || ""); }}
              className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              <X className="w-3 h-3" />
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <p className="text-foreground text-sm leading-relaxed">
          "{slice.purified_text}"
        </p>
      )}

      {/* Raw text toggle */}
      <AnimatePresence>
        {showRaw && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-sm border border-border bg-background/50 p-3 mt-1">
              <p className="font-mono text-xs text-muted-foreground mb-1 tracking-widest uppercase">Raw Input</p>
              <p className="text-secondary-foreground text-xs leading-relaxed font-mono">{slice.raw_text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(slice.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={showRaw ? "Hide raw" : "View raw"}
          >
            {showRaw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { setEditing(true); setEditText(slice.purified_text || ""); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SliceCard;
