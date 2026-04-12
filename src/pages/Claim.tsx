import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
import LanguageToggle from "@/components/LanguageToggle";
import { ShieldCheck, ArrowRight, Key } from "lucide-react";

const Claim = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("claim-account", {
        body: { token, email, password },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSuccess(true);

      setTimeout(() => {
        navigate("/auth");
      }, 2000);
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

  // No token — invalid state
  if (!token) {
    return (
      <div className="min-h-screen bg-background flex relative">
        <div className="absolute top-6 right-8 z-10">
          <LanguageToggle />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
            <Key className="w-5 h-5 text-red-500" />
          </div>
          <h1 className="font-display text-2xl text-foreground">{t("claimInvalidToken")}</h1>
          <p className="text-muted-foreground font-mono text-sm max-w-md">
            {t("claimInvalidDesc")}
          </p>
          <a href="/auth">
            <Button variant="outline" className="mt-4 font-mono">
              {t("claimGoToLogin")}
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-background flex relative">
        <div className="absolute top-6 right-8 z-10">
          <LanguageToggle />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="font-display text-2xl text-foreground">{t("claimSuccess")}</h1>
          <p className="text-muted-foreground font-mono text-sm max-w-md">
            {t("claimSuccessDesc")}
          </p>
        </div>
      </div>
    );
  }

  // Claim form
  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="absolute top-6 right-8 z-10">
        <LanguageToggle />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="font-display text-3xl font-light text-foreground">
              {t("claimSecureVault")}
            </h1>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              {t("claimSecureDesc")}
            </p>
          </div>

          <form onSubmit={handleClaim} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {t("claimPermanentEmail")}
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
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {t("claimNewPassword")}
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
              className="w-full font-mono text-sm tracking-wider h-12 mt-4"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">{t("claimSecuring")}</span>
              ) : (
                <>
                  {t("claimAccountButton")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Claim;
