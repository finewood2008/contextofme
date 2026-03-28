import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
          title: "Check your email",
          description: "We sent you a verification link.",
        });
      }
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-light tracking-tight text-foreground">
            CONTEXT<span className="text-muted-foreground">of.me</span>
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            {isLogin ? "AUTHENTICATE" : "CREATE ENDPOINT"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-card border-border font-mono text-sm h-12"
          />
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-card border-border font-mono text-sm h-12"
          />
          <Button
            type="submit"
            className="w-full font-mono text-sm tracking-wider h-12"
            disabled={loading}
          >
            {loading ? "..." : isLogin ? "SIGN IN →" : "CREATE ACCOUNT →"}
          </Button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          {isLogin ? "Need an endpoint? Create one." : "Already initialized? Sign in."}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
