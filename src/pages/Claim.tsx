import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
import { ShieldCheck, ArrowRight, Key } from "lucide-react";

const Claim = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifying(false);
        return;
      }

      try {
        // Call a special edge function to verify the token and get the user ID
        // Note: In a real app, this should be a secure RPC call or edge function
        // that checks if this token belongs to an unclaimed ghost account
        const { data, error } = await supabase
          .from("profiles")
          .select("user_id, email")
          .eq("api_token", token)
          .single();

        if (error || !data) throw new Error("Invalid token");

        // Check if it's actually a ghost account (email starts with ghost_)
        if (data.email && !data.email.startsWith("ghost_")) {
          // Already claimed, redirect to login
          navigate("/auth");
          return;
        }

        setValidToken(true);
        setUserId(data.user_id);
      } catch (err) {
        console.error("Token verification failed:", err);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !token) return;
    
    setLoading(true);

    try {
      // 1. Call Edge Function to update Auth user email and password
      // Since we can't update another user's email directly from client for security,
      // we need a secure edge function to do this.
      const { data, error } = await supabase.functions.invoke("claim-account", {
        body: { token, email, password }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // 2. Sign in with the new credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      toast({
        title: "Account Claimed!",
        description: "Your vault is now fully secured.",
      });
      
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse">Verifying token...</span>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
          <Key className="w-5 h-5 text-red-500" />
        </div>
        <h1 className="font-display text-2xl text-foreground">Invalid or Expired Link</h1>
        <p className="text-muted-foreground font-mono text-sm max-w-md">
          This provisioning token is invalid or the account has already been claimed.
        </p>
        <Button variant="outline" onClick={() => navigate("/auth")} className="mt-4 font-mono">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="font-display text-3xl font-light text-foreground">Secure Your Vault</h1>
          <p className="text-muted-foreground font-mono text-sm leading-relaxed">
            Your Agent has already started curating insights into an anonymous vault. Set an email and password to claim permanent ownership.
          </p>
        </div>

        <form onSubmit={handleClaim} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Permanent Email
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
              New Password
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
              <span className="animate-pulse">SECURING...</span>
            ) : (
              <>
                CLAIM ACCOUNT
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Claim;