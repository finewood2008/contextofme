import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
import { LogOut, ExternalLink, Lock, Unlock, Copy, Check } from "lucide-react";
import SliceCard from "@/components/dashboard/SliceCard";
import SliceInput from "@/components/dashboard/SliceInput";
import UsageStats from "@/components/dashboard/UsageStats";
import XPlatformConfig from "@/components/dashboard/XPlatformConfig";
import ProfileContext from "@/components/dashboard/ProfileContext";
import LanguageToggle from "@/components/LanguageToggle";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);

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
      toast({ title: t("invalid"), description: t("invalidDesc"), variant: "destructive" });
      return;
    }

    setSavingUsername(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: existing } = await supabase
      .from("public_profiles" as any)
      .select("user_id")
      .eq("username", slug)
      .neq("user_id", session.user.id)
      .maybeSingle();

    if (existing) {
      toast({ title: t("unavailable"), description: t("unavailableDesc"), variant: "destructive" });
      setSavingUsername(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: slug })
      .eq("user_id", session.user.id);

    if (error) {
      toast({ title: t("error"), description: t("failedUpdate"), variant: "destructive" });
    } else {
      setProfile((p) => p ? { ...p, username: slug } : p);
      toast({ title: t("claimed"), description: t("claimedDesc").replace("{slug}", slug) });
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
      toast({
        title: newVal ? t("vaultLockedToast") : t("vaultUnlockedToast"),
        description: newVal ? t("vaultLockedDesc") : t("vaultUnlockedDesc"),
      });
    }
  };

  const handleCopyToken = () => {
    if (!profile?.api_token) return;
    navigator.clipboard.writeText(profile.api_token);
    setCopiedToken(true);
    toast({ title: t("copied"), description: t("copiedToken") });
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleDeleteSlice = (id: string) => {
    setSlices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSlice = (id: string, text: string) => {
    setSlices((prev) => prev.map((s) => s.id === id ? { ...s, raw_text: text } : s));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse-slow">{t("loading")}</span>
      </div>
    );
  }

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border">
        <span className="font-display text-lg tracking-tight text-foreground cursor-pointer" onClick={() => navigate("/")}>
          CONTEXT<span className="text-muted-foreground">of.me</span>
        </span>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            <span className="font-mono text-xs">{t("exit")}</span>
          </Button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-16">
        {/* Public Gateway - always visible */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mb-10">
          <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{t("publicGateway")}</h2>

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
              {profile?.username ? t("changeEndpoint") : t("claimEndpoint")}
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
                {savingUsername ? "..." : t("claimButton")}
              </button>
            </div>
          </div>
        </motion.section>

        {/* Tabs */}
        <Tabs defaultValue="vault" className="space-y-8">
          <TabsList className="bg-card border border-border rounded-sm p-0.5 w-full">
            <TabsTrigger
              value="vault"
              className="flex-1 font-mono text-xs tracking-widest uppercase rounded-sm data-[state=active]:bg-accent data-[state=active]:text-foreground text-muted-foreground"
            >
              {t("vault")}
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex-1 font-mono text-xs tracking-widest uppercase rounded-sm data-[state=active]:bg-accent data-[state=active]:text-foreground text-muted-foreground"
            >
              {t("profile")}
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="flex-1 font-mono text-xs tracking-widest uppercase rounded-sm data-[state=active]:bg-accent data-[state=active]:text-foreground text-muted-foreground"
            >
              {t("api")}
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="flex-1 font-mono text-xs tracking-widest uppercase rounded-sm data-[state=active]:bg-accent data-[state=active]:text-foreground text-muted-foreground"
            >
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Vault Tab */}
          <TabsContent value="vault" className="space-y-12">
            {profile?.api_token && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <SliceInput
                  apiToken={profile.api_token}
                  onSliceCreated={(slice) => setSlices((prev) => [slice, ...prev])}
                />
              </motion.section>
            )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-6"
            >
              <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
                {t("memoryVault")} ({slices.length})
              </h2>

              {slices.length === 0 ? (
                <div className="glass-card rounded-sm p-8 text-center">
                  <p className="text-muted-foreground text-sm font-mono">
                    {t("noSlicesYet")}
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
                        userId={userId!}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.section>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-8">
            {profile?.api_token && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{t("apiToken")}</h2>
                <div className="glass-card rounded-sm p-4 flex items-center justify-between gap-4">
                  <code className="font-mono text-xs text-foreground/70 truncate flex-1">
                    {profile.api_token.slice(0, 12)}{"••••••••••••"}
                  </code>
                  <button onClick={handleCopyToken} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </motion.section>
            )}

            {profile?.username && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }} className="space-y-4">
                <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{t("accessControl")}</h2>
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
                      {profile.is_private ? t("vaultLocked") : t("vaultPublic")}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/50 uppercase">
                    {profile.is_private ? t("unlock") : t("lock")}
                  </span>
                </button>
              </motion.section>
            )}

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{t("endpoints")}</h2>
                <button
                  onClick={() => navigate("/docs")}
                  className="font-mono text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors uppercase"
                >
                  {t("fullDocs")}
                </button>
              </div>
              <div className="glass-card rounded-sm divide-y divide-border">
                {[
                  { method: "GET", path: "/context", desc: t("endpointDescContext") },
                  { method: "GET", path: "/feed", desc: t("endpointDescFeed") },
                  { method: "POST", path: "/ingest", desc: t("endpointDescIngest") },
                  { method: "POST", path: "/chat", desc: t("endpointDescChat") },
                ].map((ep) => (
                  <div key={ep.path} className="px-4 py-3 flex items-center gap-3">
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      ep.method === "GET" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-xs text-foreground">{ep.path}</code>
                    <span className="text-xs text-muted-foreground/50 ml-auto hidden sm:block">{ep.desc}</span>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-sm p-3">
                <p className="font-mono text-[10px] text-muted-foreground/40 tracking-wider">
                  BASE: <span className="text-muted-foreground/60">{baseUrl}/functions/v1</span>
                </p>
              </div>
            </motion.section>

            {userId && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }} className="space-y-4">
                <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{t("usage")}</h2>
                <UsageStats userId={userId} />
              </motion.section>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            {userId && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Profile Context</h2>
                <ProfileContext userId={userId} />
              </motion.section>
            )}
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-8">
            {userId && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">X Platform</h2>
                <XPlatformConfig userId={userId} />
              </motion.section>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
