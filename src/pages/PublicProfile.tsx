import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .single();
      if (!data) setNotFound(true);
      setLoading(false);
    };
    check();
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const query = input.trim();
    if (!query || streaming) return;

    const userMsg: Message = { role: "user", content: query };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setStreaming(true);
    streamRef.current = "";

    // Add empty assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          username,
          query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Stream failed" }));
        streamRef.current = err.error || "Connection failed.";
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: streamRef.current } : m
          )
        );
        setStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              streamRef.current += content;
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === prev.length - 1
                    ? { ...m, content: streamRef.current }
                    : m
                )
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      streamRef.current = "Connection to the vault failed.";
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, content: streamRef.current } : m
        )
      );
    }

    setStreaming(false);
  }, [input, messages, streaming, username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse-slow">
          Resolving endpoint...
        </span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-mono text-sm text-muted-foreground">404</p>
          <p className="font-display text-2xl text-foreground">
            Endpoint not found
          </p>
        </div>
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
        className="flex-shrink-0 px-8 pt-16 pb-8 md:pt-24 md:pb-12"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-foreground leading-[0.9]">
            Context of{" "}
            <span className="text-muted-foreground">{username}</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed max-w-lg" style={{ color: "hsl(0 0% 53%)" }}>
            You are interacting with a digital twin. Responses are synthesized
            strictly from the principal's curated memory vault.
          </p>
        </div>
      </motion.header>

      {/* Chat Stream */}
      <div className="flex-1 overflow-y-auto px-8">
        <div className="max-w-2xl mx-auto space-y-8 pb-8">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <p
                    className={`text-sm md:text-base leading-[1.8] font-light whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {msg.content}
                    {msg.role === "assistant" && streaming && i === messages.length - 1 && (
                      <span className="inline-block ml-1 animate-pulse-slow text-muted-foreground">▮</span>
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center pt-24"
            >
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
                Awaiting query...
              </p>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-shrink-0 border-t px-8 py-5"
        style={{ borderColor: "hsl(0 0% 13%)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-muted-foreground font-mono text-sm select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Query the vault..."
            disabled={streaming}
            className="flex-1 bg-transparent font-light text-sm md:text-base text-foreground placeholder:text-muted-foreground/40 outline-none disabled:opacity-50 transition-opacity"
            autoFocus
          />
          {streaming && (
            <span className="text-muted-foreground font-mono text-xs animate-pulse-slow">
              processing
            </span>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="flex-shrink-0 px-8 py-4 border-t border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs font-mono text-muted-foreground">
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
