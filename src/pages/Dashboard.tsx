import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, LogOut, Download } from "lucide-react";

interface Profile {
  api_token: string;
  username: string | null;
  email: string | null;
}

interface Slice {
  id: string;
  raw_text: string;
  purified_text: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [slices, setSlices] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("api_token, username, email")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) setProfile(profileData as Profile);

      // Fetch slices
      const { data: slicesData } = await supabase
        .from("slices")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (slicesData) setSlices(slicesData as Slice[]);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const copyToken = () => {
    if (profile?.api_token) {
      navigator.clipboard.writeText(profile.api_token);
      toast({ title: "Copied", description: "API token copied to clipboard." });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse-slow">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border">
        <span className="font-display text-lg tracking-tight text-foreground cursor-pointer" onClick={() => navigate("/")}>
          CONTEXT<span className="text-muted-foreground">of.me</span>
        </span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="w-4 h-4 mr-2" />
          <span className="font-mono text-xs">EXIT</span>
        </Button>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-16 space-y-16">
        {/* API Token Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
              Your API Token
            </h2>
            <p className="text-xs text-muted-foreground">
              Use this Bearer token with the /ingest endpoint
            </p>
          </div>

          <div className="glass-card rounded-sm p-4 flex items-center gap-3">
            <code className="flex-1 font-mono text-sm text-foreground break-all select-all">
              {profile?.api_token}
            </code>
            <Button variant="ghost" size="sm" onClick={copyToken}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Endpoint info */}
          <div className="glass-card rounded-sm p-4 space-y-2">
            <p className="font-mono text-xs text-muted-foreground">ENDPOINT</p>
            <code className="font-mono text-sm text-foreground block">
              POST {import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest
            </code>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="font-mono text-xs text-muted-foreground mb-2">EXAMPLE</p>
              <pre className="font-mono text-xs text-secondary-foreground whitespace-pre-wrap">
{`curl -X POST \\
  ${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Your raw thoughts here"}'`}
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Download Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Integrations
          </h2>
          <Button
            variant="outline"
            className="w-full justify-start font-mono text-sm h-12 gap-3"
            onClick={() => toast({ title: "Coming soon", description: "OpenClaw Sync Skill will be available shortly." })}
          >
            <Download className="w-4 h-4" />
            Download OpenClaw Sync Skill (.zip)
          </Button>
        </motion.section>

        {/* Slices Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
              Memory Vault ({slices.length})
            </h2>
          </div>

          {slices.length === 0 ? (
            <div className="glass-card rounded-sm p-8 text-center">
              <p className="text-muted-foreground text-sm font-mono">
                No slices yet. Send your first thought via the API.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {slices.map((slice, i) => (
                <motion.div
                  key={slice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-sm p-5 space-y-3"
                >
                  <p className="text-foreground text-sm leading-relaxed">
                    "{slice.purified_text}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(slice.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        toast({
                          title: "Raw input",
                          description: slice.raw_text,
                        });
                      }}
                    >
                      [RAW]
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;
