import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Slice {
  id: string;
  purified_text: string | null;
  created_at: string;
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [slices, setSlices] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Find user by username
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .single();

      if (!profile) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Fetch their slices
      const { data: slicesData } = await supabase
        .from("slices")
        .select("id, purified_text, created_at")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false });

      if (slicesData) setSlices(slicesData);
      setLoading(false);
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse-slow">
          Resolving endpoint...
        </span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-mono text-sm text-muted-foreground">404</p>
          <p className="font-display text-2xl text-foreground">Endpoint not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-8 py-24 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            /{username}
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight text-foreground leading-[0.9]">
            Context
            <br />
            <span className="text-muted-foreground">Endpoint</span>
          </h1>
        </motion.div>

        {/* Slices */}
        <div className="space-y-3">
          {slices.map((slice, i) => (
            <motion.div
              key={slice.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              className="glass-card rounded-sm p-6"
            >
              <p className="text-foreground text-sm md:text-base leading-relaxed font-light">
                "{slice.purified_text}"
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-4">
                {new Date(slice.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          ))}

          {slices.length === 0 && (
            <div className="glass-card rounded-sm p-8 text-center">
              <p className="text-muted-foreground text-sm font-mono">
                No transmissions yet.
              </p>
            </div>
          )}
        </div>

        {/* Social Firewall */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-16 border-t border-border space-y-3"
        >
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Social Firewall
          </p>
          <div className="glass-card rounded-sm p-4 flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-sm">$</span>
            <input
              type="text"
              placeholder="Access denied. Prove your context."
              disabled
              className="flex-1 bg-transparent font-mono text-sm text-muted-foreground placeholder:text-muted-foreground/50 outline-none cursor-not-allowed"
            />
            <span className="text-muted-foreground font-mono text-xs animate-pulse-slow">▮</span>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>contextof.me</span>
          <span>●</span>
        </div>
      </footer>
    </div>
  );
};

export default PublicProfile;
