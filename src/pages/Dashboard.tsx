import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, ExternalLink, Lock, Unlock, FileText } from "lucide-react";
import GatewayConfigDrawer from "@/components/dashboard/GatewayConfigDrawer";
import SliceCard from "@/components/dashboard/SliceCard";
import SliceInput from "@/components/dashboard/SliceInput";
import UsageStats from "@/components/dashboard/UsageStats";

interface Profile {
  api_token: string;
  username: string | null;
  email: string | null;
  is_private: boolean;
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
      if (!session) { navigate("/auth"); return; }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("api_token, username, email, is_private")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
        setUsernameInput((profileData as Profile).username || "");
      }

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

  const handleTogglePrivate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !profile) return;
    const newVal = !profile.is_private;
    const { error } = await supabase
      .from("profiles")
      .update({ is_private: newVal } as any)
      .eq("user_id", session.user.id);
    if (!error) {
      setProfile((p) => p ? { ...p, is_private: newVal } : p);
      toast({ title: newVal ? "Vault locked" : "Vault unlocked", description: newVal ? "API access now requires your API key." : "API access is now public." });
    }
  };

  const handleDeleteSlice = (id: string) => {
    setSlices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSlice = (id: string, text: string) => {
    setSlices((prev) => prev.map((s) => s.id === id ? { ...s, purified_text: text } : s));
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/docs")} className="text-muted-foreground">
            <FileText className="w-4 h-4 mr-2" />
            <span className="font-mono text-xs">API DOCS</span>
          </Button>
          {profile?.api_token && <GatewayConfigDrawer apiToken={profile.api_token} />}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="font-mono text-xs">EXIT</span>
          </Button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-16 space-y-12">
        {/* Public Gateway */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Public Gateway</h2>

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

          {/* Privacy Toggle */}
          {profile?.username && (
            <button
              onClick={handleTogglePrivate}
              className="glass-card rounded-sm p-4 flex items-center justify-between group hover:border-foreground/20 transition-colors w-full"
            >
              <div className="flex items-center gap-3">
                {profile.is_private ? (
                  <Lock className="w-3.5 h-3.5 text-foreground" />
                ) : (
                  <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span className="font-mono text-xs text-muted-foreground">
                  {profile.is_private ? "VAULT LOCKED — API KEY REQUIRED" : "VAULT PUBLIC — OPEN ACCESS"}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground/50 uppercase">
                {profile.is_private ? "[ UNLOCK ]" : "[ LOCK ]"}
              </span>
            </button>
          )}
        </motion.section>

        {/* Transmit Input */}
        {profile?.api_token && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <SliceInput
              apiToken={profile.api_token}
              onSliceCreated={(slice) => setSlices((prev) => [slice, ...prev])}
            />
          </motion.section>
        )}

        {/* Memory Vault */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              <AnimatePresence>
                {slices.map((slice, i) => (
                  <SliceCard
                    key={slice.id}
                    slice={slice}
                    index={i}
                    onDelete={handleDeleteSlice}
                    onUpdate={handleUpdateSlice}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;
