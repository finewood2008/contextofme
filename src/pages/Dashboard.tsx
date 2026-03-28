import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, LogOut, ExternalLink } from "lucide-react";

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
  const [usernameInput, setUsernameInput] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
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

      if (profileData) {
        setProfile(profileData as Profile);
        setUsernameInput((profileData as Profile).username || "");
      }

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

  const claimEndpoint = async () => {
    const slug = usernameInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!slug || slug.length < 2 || slug.length > 30) {
      toast({ title: "Invalid", description: "Username must be 2-30 characters (letters, numbers, - _).", variant: "destructive" });
      return;
    }

    setSavingUsername(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Check if taken
    const { data: existing } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("username", slug)
      .neq("user_id", session.user.id)
      .maybeSingle();

    if (existing) {
      toast({ title: "Unavailable", description: "This endpoint is already claimed.", variant: "destructive" });
      setSavingUsername(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: slug })
      .eq("user_id", session.user.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update endpoint.", variant: "destructive" });
    } else {
      setProfile((p) => p ? { ...p, username: slug } : p);
      toast({ title: "Claimed", description: `Endpoint /${slug} is now active.` });
    }
    setSavingUsername(false);
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
        {/* Public Gateway Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Public Gateway
          </h2>

          {/* Current URL */}
          {profile?.username && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-sm p-4 flex items-center justify-between group hover:border-foreground/20 transition-colors block"
            >
              <span className="font-mono text-sm">
                <span className="text-muted-foreground">contextof.me/</span>
                <span className="text-foreground font-medium">{profile.username}</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          )}

          {/* Set/Change Username */}
          <div className="glass-card rounded-sm p-4 space-y-3">
            <p className="font-mono text-xs text-muted-foreground">
              {profile?.username ? "CHANGE ENDPOINT" : "CLAIM YOUR ENDPOINT"}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-0">
                <span className="font-mono text-sm text-muted-foreground select-none">/</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && claimEndpoint()}
                  placeholder="username"
                  maxLength={30}
                  className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/30 outline-none border-none ml-1"
                />
              </div>
              <button
                onClick={claimEndpoint}
                disabled={savingUsername}
                className="font-mono text-xs text-foreground border border-border px-3 py-1.5 hover:bg-accent transition-colors disabled:opacity-50"
              >
                {savingUsername ? "..." : "[ CLAIM ENDPOINT ]"}
              </button>
            </div>
          </div>
        </motion.section>

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

        {/* Integrations Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            Integrations
          </h2>
          <div className="glass-card rounded-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs tracking-[0.15em] text-secondary-foreground uppercase">
                Establish the Gateway
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `clawhub install contextof.me-gateway && openclaw exec "/contextofme-bind ${profile?.api_token || "YOUR_API_TOKEN"}"`
                  );
                  toast({ title: "Copied", description: "Install command copied to clipboard." });
                }}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                [COPY]
              </button>
            </div>
            <pre className="overflow-x-auto rounded-sm border border-border bg-background px-4 py-3 font-mono text-sm text-foreground whitespace-pre-wrap">
              <code>{`clawhub install contextof.me-gateway && openclaw exec "/contextofme-bind ${profile?.api_token || "YOUR_API_TOKEN"}"`}</code>
            </pre>
          </div>
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
