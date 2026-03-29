import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/use-locale";

interface Slice {
  id: string;
  raw_text: string;
  purified_text: string | null;
  created_at: string;
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [slices, setSlices] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const { t, locale } = useLocale();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("public_profiles" as any)
        .select("user_id, is_private")
        .eq("username", username)
        .single();

      const profile = data as unknown as { user_id: string; is_private: boolean } | null;

      if (!profile) {
        setProfileExists(false);
        setLoading(false);
        return;
      }

      setProfileExists(true);

      if (profile.is_private) {
        setIsPrivate(true);
        setLoading(false);
        return;
      }

      const { data: sliceData } = await supabase
        .from("slices")
        .select("id, raw_text, purified_text, created_at")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false });

      setSlices(sliceData || []);
      setLoading(false);
    };
    load();
  }, [username]);

  const pageUrl = `https://elite-context-vault.lovable.app/${username}`;
  const pageTitle = `Context of ${username} — CONTEXTof.me`;
  const pageDescription = `Machine-readable context vault for ${username}. ${slices.length} knowledge slices curated for AI agent consumption.`;

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `Context Vault of ${username}`,
    "description": pageDescription,
    "url": pageUrl,
    "creator": {
      "@type": "Person",
      "name": username,
    },
    "distribution": {
      "@type": "DataDownload",
      "encodingFormat": "text/html",
      "contentUrl": pageUrl,
    },
    "hasPart": slices.map((slice) => ({
      "@type": "CreativeWork",
      "text": slice.purified_text || slice.raw_text,
      "dateCreated": slice.created_at,
      "identifier": slice.id,
    })),
  }), [username, slices, pageUrl, pageDescription]);

  const dateFmtLocale = locale === "zh" ? "zh-CN" : "en-US";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground font-mono text-sm animate-pulse">
          {t("resolvingEndpoint")}
        </span>
      </div>
    );
  }

  if (!profileExists) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm">
          {t("noVaultFound")} <span className="text-foreground">/{username}</span>
        </p>
      </div>
    );
  }

  if (isPrivate) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-center space-y-3">
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {t("thisVaultPrivate")}
          </h1>
          <p className="text-sm font-light text-muted-foreground max-w-md mx-auto">
            <span className="text-foreground font-medium">/{username}</span> {t("privateVaultDesc")}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest mt-6">
            {t("vaultLockedLabel")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="CONTEXTof.me" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link
          rel="alternate"
          type="application/atom+xml"
          title={`Context feed for ${username}`}
          href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feed?username=${username}`}
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-shrink-0 px-6 pt-12 pb-6 md:px-8 md:pt-20 md:pb-10"
      >
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground">
            {t("contextOf")}{" "}
            <span className="text-muted-foreground">{username}</span>
          </h1>
          <p
            className="text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto"
            style={{ color: "hsl(0 0% 53%)" }}
          >
            {t("publicVaultDesc")}
          </p>
          <p className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest">
            {slices.length} {t("slicesIndexed")}
          </p>
        </div>
      </motion.header>

      <div className="flex-1 px-6 md:px-8 pb-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {slices.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground/40">
                {t("vaultEmpty")}
              </p>
            </div>
          ) : (
            slices.map((slice, i) => (
              <motion.article
                key={slice.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="rounded-lg border p-5"
                style={{
                  background: "hsla(0, 0%, 100%, 0.02)",
                  borderColor: "hsla(0, 0%, 100%, 0.06)",
                }}
              >
                <p className="text-sm md:text-base leading-[1.9] font-light text-foreground whitespace-pre-wrap">
                  {slice.raw_text}
                </p>
                <div className="mt-3 flex items-center gap-3 text-muted-foreground/40 font-mono text-[10px] uppercase tracking-wider">
                  <time dateTime={slice.created_at}>
                    {new Date(slice.created_at).toLocaleDateString(dateFmtLocale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{slice.id.slice(0, 8)}</span>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>

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
