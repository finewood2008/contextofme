import { useState } from "react";
import { Copy, Eye, EyeOff, Settings, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GatewayConfigDrawerProps {
  apiToken: string;
}

const GatewayConfigDrawer = ({ apiToken }: GatewayConfigDrawerProps) => {
  const { toast } = useToast();
  const [showToken, setShowToken] = useState(false);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 hover:bg-accent">
          <Settings className="w-3.5 h-3.5" />
          GATEWAY CONFIG
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-background border-l border-border overflow-y-auto">
        <SheetHeader className="mb-8">
          <SheetTitle className="font-mono text-xs tracking-widest uppercase text-foreground">
            Gateway Configuration
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8">
          {/* API Token */}
          <section className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Your API Token</h3>
              <p className="text-xs text-muted-foreground">Use this Bearer token with the /ingest endpoint</p>
            </div>
            <div className="glass-card rounded-sm p-4 flex items-center gap-3">
              <code className="flex-1 font-mono text-sm text-foreground break-all select-all">
                {showToken ? apiToken : apiToken.slice(0, 8) + "••••••••••••"}
              </code>
              <Button variant="ghost" size="sm" onClick={() => setShowToken(!showToken)}>
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => copy(apiToken, "API token")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* Endpoint */}
          <section className="space-y-3">
            <h3 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Endpoint</h3>
            <div className="glass-card rounded-sm p-4 space-y-2">
              <code className="font-mono text-sm text-foreground block">
                POST {supabaseUrl}/functions/v1/ingest
              </code>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="font-mono text-xs text-muted-foreground mb-2">EXAMPLE</p>
                <pre className="font-mono text-xs text-secondary-foreground whitespace-pre-wrap">
{`curl -X POST \\
  ${supabaseUrl}/functions/v1/ingest \\
  -H "Authorization: Bearer ${apiToken}" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Your raw thoughts here"}'`}
                </pre>
              </div>
            </div>
          </section>

          {/* Integrations */}
          <section className="space-y-3">
            <h3 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Establish the Gateway</h3>
            <div className="glass-card rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs tracking-[0.15em] text-secondary-foreground uppercase">OpenClaw Integration</p>
                <button
                  onClick={() => copy(`clawhub install contextofme && openclaw exec "/contextofme-bind ${apiToken}"`, "Install command")}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  [COPY]
                </button>
              </div>
              <pre className="overflow-x-auto rounded-sm border border-border bg-background px-4 py-3 font-mono text-sm text-foreground whitespace-pre-wrap">
                <code>{`clawhub install contextofme && openclaw exec "/contextofme-bind ${apiToken}"`}</code>
              </pre>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GatewayConfigDrawer;
