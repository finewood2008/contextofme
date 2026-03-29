import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
import LanguageToggle from "@/components/LanguageToggle";

interface Profile {
  api_token: string;
  username: string | null;
}

const ApiDocs = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("api_token, username")
        .eq("user_id", session.user.id)
        .single();
      if (data) setProfile(data as Profile);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const username = profile?.username || "<username>";
  const token = profile?.api_token || "<your-api-token>";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: t("copied"), description: t("copiedCommand") });
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      id: "context",
      method: "GET",
      name: "Context API",
      description: "Retrieve a user's full context vault as structured JSON with Schema.org annotations. Supports pagination.",
      url: `${baseUrl}/functions/v1/context`,
      params: [
        { name: "username", type: "string", required: true, desc: "Vault owner's username" },
        { name: "limit", type: "integer", required: false, desc: "Slices per page (1-200, default 50)" },
        { name: "offset", type: "integer", required: false, desc: "Pagination offset (default 0)" },
      ],
      curlPublic: `curl "${baseUrl}/functions/v1/context?username=${username}&limit=20&offset=0"`,
      curlPrivate: `curl -H "Authorization: Bearer ${token}" \\
  "${baseUrl}/functions/v1/context?username=${username}"`,
      response: `{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "vault": { "owner": "${username}", "total_slices": 42 },
  "pagination": { "limit": 20, "offset": 0, "total": 42, "has_more": true },
  "slices": [
    { "id": "...", "content": "...", "raw": "...", "created_at": "..." }
  ]
}`,
    },
    {
      id: "feed",
      method: "GET",
      name: "Atom Feed",
      description: "Subscribe to context updates via standard Atom feed. Returns the latest 100 slices.",
      url: `${baseUrl}/functions/v1/feed`,
      params: [
        { name: "username", type: "string", required: true, desc: "Vault owner's username" },
      ],
      curlPublic: `curl "${baseUrl}/functions/v1/feed?username=${username}"`,
      curlPrivate: `curl -H "Authorization: Bearer ${token}" \\
  "${baseUrl}/functions/v1/feed?username=${username}"`,
      response: `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Context Vault of ${username}</title>
  <entry>
    <title>Slice f0ae1408</title>
    <content type="text">...</content>
  </entry>
</feed>`,
    },
    {
      id: "ingest",
      method: "POST",
      name: "Ingest Slice",
      description: "Submit a new context slice for AI purification and storage. Requires your API token.",
      url: `${baseUrl}/functions/v1/ingest`,
      params: [
        { name: "text", type: "string", required: true, desc: "Raw text content (1-5000 chars)" },
      ],
      curlPublic: null,
      curlPrivate: `curl -X POST \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Your context slice here..."}' \\
  "${baseUrl}/functions/v1/ingest"`,
      response: `{
  "id": "f0ae1408-...",
  "raw_text": "Your context slice here...",
  "purified_text": "AI-purified version...",
  "created_at": "2026-03-28T..."
}`,
    },
    {
      id: "chat",
      method: "POST",
      name: "Chat (Streaming)",
      description: "Query a user's vault via conversational AI. Returns streamed SSE responses synthesized from vault context.",
      url: `${baseUrl}/functions/v1/chat`,
      params: [
        { name: "username", type: "string", required: true, desc: "Vault owner's username" },
        { name: "query", type: "string", required: true, desc: "The question to ask" },
        { name: "history", type: "array", required: false, desc: "Previous messages [{role, content}]" },
      ],
      curlPublic: `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"username": "${username}", "query": "What does this person do?"}' \\
  "${baseUrl}/functions/v1/chat"`,
      curlPrivate: null,
      response: `data: {"choices":[{"delta":{"content":"Based on..."}}]}
data: {"choices":[{"delta":{"content":" the vault..."}}]}
data: [DONE]`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border">
        <span className="font-display text-lg tracking-tight text-foreground cursor-pointer" onClick={() => navigate("/")}>
          CONTEXT<span className="text-muted-foreground">of.me</span>
        </span>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-mono text-xs">{t("dashboard")}</span>
          </Button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-16 space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            {t("apiReference")}
          </h1>
          <p className="text-sm font-light leading-relaxed" style={{ color: "hsl(0 0% 53%)" }}>
            {t("apiDocsDesc")} <code className="font-mono text-xs text-foreground/70">Authorization: Bearer &lt;token&gt;</code>.
          </p>
          <div className="glass-card rounded-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{t("baseUrl")}</p>
              <p className="font-mono text-sm text-foreground break-all">{baseUrl}/functions/v1</p>
            </div>
          </div>
          <div className="glass-card rounded-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{t("aiAgentDiscovery")}</p>
              <p className="font-mono text-sm text-foreground break-all">/.well-known/ai-context.json</p>
            </div>
          </div>
        </motion.div>

        {endpoints.map((ep, idx) => (
          <motion.section
            key={ep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                ep.method === "GET" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              }`}>
                {ep.method}
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground">{ep.name}</h2>
            </div>

            <p className="text-sm font-light" style={{ color: "hsl(0 0% 53%)" }}>{ep.description}</p>

            <div className="glass-card rounded-sm p-4 space-y-1">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{t("endpoint")}</p>
              <p className="font-mono text-sm text-foreground break-all">{ep.url}</p>
            </div>

            <div className="glass-card rounded-sm overflow-hidden">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{t("parameters")}</p>
              </div>
              {ep.params.map((p) => (
                <div key={p.name} className="px-4 py-3 border-b border-border/50 flex items-start gap-4">
                  <code className="font-mono text-sm text-foreground shrink-0">{p.name}</code>
                  <span className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">{p.type}</span>
                  {p.required && <span className="font-mono text-[10px] text-red-400/70 mt-0.5">required</span>}
                  <span className="text-sm text-muted-foreground font-light ml-auto text-right">{p.desc}</span>
                </div>
              ))}
            </div>

            {ep.curlPublic && (
              <CodeBlock
                label={t("publicAccess")}
                code={ep.curlPublic}
                id={`${ep.id}-public`}
                copied={copied}
                onCopy={copyToClipboard}
              />
            )}
            {ep.curlPrivate && (
              <CodeBlock
                label={t("authenticatedAccess")}
                code={ep.curlPrivate}
                id={`${ep.id}-private`}
                copied={copied}
                onCopy={copyToClipboard}
              />
            )}

            <CodeBlock
              label={t("response")}
              code={ep.response}
              id={`${ep.id}-response`}
              copied={copied}
              onCopy={copyToClipboard}
            />
          </motion.section>
        ))}
      </main>

      <footer className="px-8 py-4 border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>CONTEXT<span className="opacity-50">of.me</span></span>
          <span className="opacity-30">●</span>
        </div>
      </footer>
    </div>
  );
};

const CodeBlock = ({
  label,
  code,
  id,
  copied,
  onCopy,
}: {
  label: string;
  code: string;
  id: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) => (
  <div className="rounded-sm overflow-hidden border" style={{ borderColor: "hsl(0 0% 13%)", background: "hsl(0 0% 4%)" }}>
    <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid hsl(0 0% 13%)" }}>
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{label}</span>
      <button
        onClick={() => onCopy(code, id)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied === id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
    <pre className="px-4 py-3 overflow-x-auto text-xs font-mono leading-relaxed text-foreground/80 whitespace-pre-wrap break-all">
      {code}
    </pre>
  </div>
);

export default ApiDocs;
