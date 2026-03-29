import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/use-locale";
import LanguageToggle from "@/components/LanguageToggle";

const XPlatformSetupDocs = () => {
  const { locale } = useLocale();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const docFile = locale === "zh" ? "X_PLATFORM_SETUP_ZH.md" : "X_PLATFORM_SETUP_EN.md";
        const response = await fetch(`/docs/${docFile}`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Failed to load docs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDocs();
  }, [locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse-slow">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border">
        <a href="/" className="font-display text-lg tracking-tight text-foreground">
          CONTEXT<span className="text-muted-foreground">of.me</span>
        </a>
        <LanguageToggle />
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-sm max-w-none"
        >
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
          />
        </motion.div>
      </main>
    </div>
  );
};

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-mono text-foreground mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-mono text-foreground mt-10 mb-6">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-display text-foreground mb-8">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-card border border-border rounded-sm p-4 overflow-x-auto my-4"><code class="font-mono text-xs text-foreground">$1</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-card border border-border rounded px-1.5 py-0.5 font-mono text-xs text-foreground">$1</code>');

  // Lists
  html = html.replace(/^\d+\.\s(.*)$/gim, '<li class="ml-6 my-2 text-muted-foreground">$1</li>');
  html = html.replace(/^-\s(.*)$/gim, '<li class="ml-6 my-2 text-muted-foreground">$1</li>');

  // Paragraphs
  html = html.replace(/^(?!<[h|l|p|d])(.*$)/gim, '<p class="text-muted-foreground leading-relaxed my-4">$1</p>');

  // Emojis and warnings
  html = html.replace(/⚠️/g, '<span class="text-amber-400">⚠️</span>');
  html = html.replace(/✅/g, '<span class="text-emerald-400">✅</span>');

  return html;
}

export default XPlatformSetupDocs;
