import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .single();
      setProfileExists(!!data);
      setLoading(false);
    };
    check();
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typewriterReply = useCallback(
    (text: string) => {
      setStreaming(true);
      streamRef.current = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let i = 0;
      const interval = setInterval(() => {
        i++;
        streamRef.current = text.slice(0, i);
        setMessages((prev) =>
          prev.map((m, idx) =>
            idx === prev.length - 1
              ? { ...m, content: streamRef.current }
              : m
          )
        );
        if (i >= text.length) {
          clearInterval(interval);
          setStreaming(false);
        }
      }, 18);
    },
    []
  );

  const sendMessage = useCallback(() => {
    const query = input.trim();
    if (!query || streaming) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setInput("");

    // Hardcoded reply with typewriter effect
    setTimeout(() => {
      typewriterReply(
        "Insufficient context available to process this query."
      );
    }, 300);
  }, [input, streaming, typewriterReply]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse-slow">
          Resolving endpoint...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-shrink-0 px-6 pt-12 pb-6 md:px-8 md:pt-20 md:pb-10"
      >
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground">
            Context of{" "}
            <span className="text-muted-foreground">{username}</span>
          </h1>
          <p
            className="text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto"
            style={{ color: "hsl(0 0% 53%)" }}
          >
            You are interacting with a digital twin. Responses are synthesized
            strictly from the principal's curated memory vault.
          </p>
        </div>
      </motion.header>

      {/* Chat Interface — Glassmorphic */}
      <div className="flex-1 flex justify-center px-6 md:px-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-3xl flex flex-col rounded-2xl border backdrop-blur-xl overflow-hidden"
          style={{
            background: "hsla(0, 0%, 100%, 0.03)",
            borderColor: "hsla(0, 0%, 100%, 0.08)",
            minHeight: "420px",
            maxHeight: "520px",
          }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <p
                    className={`inline-block text-sm md:text-base leading-[1.9] font-light whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {msg.content}
                    {msg.role === "assistant" &&
                      streaming &&
                      i === messages.length - 1 && (
                        <span className="inline-block ml-0.5 animate-pulse-slow text-muted-foreground">
                          ▮
                        </span>
                      )}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground/40">
                  {profileExists
                    ? "Awaiting query..."
                    : "Terminal active — no vault data loaded"}
                </p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 px-6 py-4 flex items-center gap-3"
            style={{ borderTop: "1px solid hsl(0 0% 13%)" }}
          >
            <span className="text-muted-foreground font-mono text-sm select-none">
              $
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Query the vault..."
              disabled={streaming}
              className="flex-1 bg-transparent font-light text-sm md:text-base text-foreground placeholder:text-muted-foreground/30 outline-none border-none disabled:opacity-50 transition-opacity"
              autoFocus
            />
            {streaming && (
              <span className="text-muted-foreground font-mono text-xs animate-pulse-slow">
                ···
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 px-8 py-4 border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>
            CONTEXT<span className="opacity-50">of.me</span>
          </span>
          <span className="opacity-30">●</span>
        </div>
      </footer>
    </div>
  );
};

export default PublicProfile;
