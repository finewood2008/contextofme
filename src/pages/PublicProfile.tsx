import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Slice {
  id: string;
  raw_text: string;
  purified_text: string | null;
  created_at: string;
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [slices, setSlices] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .single();

      if (!profile) {
        setProfileExists(false);
        setLoading(false);
        return;
      }

      setProfileExists(true);

      const { data: sliceData } = await supabase
        .from("slices")
        .select("id, raw_text, purified_text, created_at")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false });

      setSlices(sliceData || []);
      setLoading(false);
    };
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse">
          Resolving endpoint...
        </span>
      </div>
    );
  }

  if (!profileExists) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">
          No vault found for <span className="text-foreground">/{username}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-shrink-0 px-6 pt-12 pb-6 md:px-8 md:pt-20 md:pb-10"
      >
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground">
            Context of{" "}
            <span className="text-muted-foreground">{username}</span>
          </h1>
          <p
            className="text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto"
            style={{ color: "hsl(0 0% 53%)" }}
          >
            Machine-readable context vault. This page is designed for AI agents
            to consume the principal's curated knowledge base.
          </p>
          <p className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest">
            {slices.length} slice{slices.length !== 1 ? "s" : ""} indexed
          </p>
        </div>
      </motion.header>

      {/* Context Slices */}
      <div className="flex-1 px-6 md:px-8 pb-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {slices.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground/40">
                Vault is empty — no context slices loaded
              </p>
            </div>
          ) : (
            slices.map((slice, i) => (
              <motion.article
                key={slice.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="rounded-lg border p-5"
                style={{
                  background: "hsla(0, 0%, 100%, 0.02)",
                  borderColor: "hsla(0, 0%, 100%, 0.06)",
                }}
              >
                <p className="text-sm md:text-base leading-[1.9] font-light text-foreground whitespace-pre-wrap">
                  {slice.purified_text || slice.raw_text}
                </p>
                <div className="mt-3 flex items-center gap-3 text-muted-foreground/40 font-mono text-[10px] uppercase tracking-wider">
                  <time dateTime={slice.created_at}>
                    {new Date(slice.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{slice.id.slice(0, 8)}</span>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 px-8 py-4 border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>
            CONTEXT<span className="opacity-50">of.me</span>
          </span>
          <span className="opacity-30">●</span>
        </div>
      </footer>
    </div>
  );
};

export default PublicProfile;
