import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border">
        <span className="font-display text-lg tracking-tight text-foreground">
          CONTEXTOF<span className="text-muted-foreground">.ME</span>
        </span>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl text-center space-y-8"
        >
          <div className="inline-block px-3 py-1 border border-border rounded-sm mb-4">
            <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
              API Gateway · Memory Vault
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] text-foreground">
            Context
            <br />
            <span className="text-muted-foreground">Endpoint</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-light">
            Distill raw thought into razor-sharp maxims.
            Your personal AI memory vault for the relentless.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="font-mono text-sm tracking-wider px-8 py-6"
            >
              INITIALIZE →
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-px h-24 bg-border mt-20 origin-top"
          style={{ transform: "scaleY(1)" }}
        />
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>© 2026 CONTEXTOF.ME</span>
          <span className="animate-pulse-slow">●</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
