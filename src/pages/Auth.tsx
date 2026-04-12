import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();

  // Listen for auth state changes (handles OAuth redirect)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({
          title: t("checkEmail"),
          description: t("checkEmailDesc"),
        });
      }
    } catch (err: any) {
      toast({
        title: t("error"),
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({ title: t("error"), description: error.message, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Language toggle */}
      <div className="absolute top-6 right-8 z-10">
        <LanguageToggle />
      </div>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-2xl font-light tracking-tight text-foreground">
            CONTEXT<span className="text-muted-foreground">of.me</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-display font-light tracking-tight text-foreground leading-tight">
            {t("authHeroTitle") || "Your thoughts,\nmachine-readable."}
          </h2>
          <p className="text-muted-foreground font-mono text-sm max-w-md leading-relaxed">
            {t("authHeroDesc") || "Distill raw thought into razor-sharp, machine-readable maxims via the A2A protocol."}
          </p>

          <div className="space-y-4 pt-4">
            {[
              { icon: Shield, label: t("authFeature1") || "End-to-end encrypted vault" },
              { icon: Zap, label: t("authFeature2") || "A2A protocol compatible" },
              { icon: Globe, label: t("authFeature3") || "Open source & self-hostable" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex items-center gap-3 text-sm text-muted-foreground font-mono"
              >
                <feature.icon className="w-4 h-4 text-foreground" />
                {feature.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground font-mono">
          © 2026 CONTEXTof.me · Open Source
        </p>
      </div>

      {/* Right panel - auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-6"
        >
          {/* Mobile brand */}
          <div className="text-center lg:hidden mb-4">
            <h1 className="font-display text-3xl font-light tracking-tight text-foreground">
              CONTEXT<span className="text-muted-foreground">of.me</span>
            </h1>
          </div>

          {/* Mode toggle tabs */}
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-mono tracking-wider transition-colors ${
                isLogin
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("signInButton")?.replace(" →", "") || "SIGN IN"}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-mono tracking-wider transition-colors ${
                !isLogin
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("createAccountButton")?.replace(" →", "") || "SIGN UP"}
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground font-mono">
            {isLogin ? t("authenticate") : t("createEndpoint")}
          </p>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="font-mono text-sm h-12 gap-2 hover:bg-accent"
              disabled={loading}
              onClick={() => handleOAuth("google")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="font-mono text-sm h-12 gap-2 hover:bg-accent"
              disabled={loading}
              onClick={() => handleOAuth("apple")}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground font-mono">
                {t("authOrEmail") || "or continue with email"}
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {t("authEmailLabel") || "Email"}
              </label>
              <Input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-card border-border font-mono text-sm h-12"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {t("authPasswordLabel") || "Password"}
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-card border-border font-mono text-sm h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-mono text-sm tracking-wider h-12 mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <>
                  {isLogin ? (t("signInButton") || "SIGN IN →") : (t("createAccountButton") || "CREATE ACCOUNT →")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          {/* Terms notice for signup */}
          {!isLogin && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-center text-muted-foreground font-mono leading-relaxed"
            >
              {t("authTerms") || "By creating an account you agree to our Terms of Service and Privacy Policy."}
            </motion.p>
          )}

          <div className="text-center pt-2">
            <a href="/claim" className="font-mono text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors">
              {t('authHaveToken')} <span className="underline">{t('authClaimHere')}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
