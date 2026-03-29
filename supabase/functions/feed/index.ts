import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response("Missing ?username= parameter", {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, username, created_at, is_private, api_token")
    .eq("username", username)
    .single();

  if (!profile) {
    return new Response("Vault not found", {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }

  // Auth check for private vaults
  if (profile.is_private) {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token || token !== profile.api_token) {
      return new Response("This vault is private. Provide a valid API key via Authorization: Bearer <key>", {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }
  }

  const { data: slices } = await supabase
    .from("slices")
    .select("id, raw_text, purified_text, created_at")
    .eq("user_id", profile.user_id)
    .order("created_at", { ascending: false })
    .limit(100);

  const siteUrl = "https://elite-context-vault.lovable.app";
  const feedUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/feed?username=${username}`;
  const profileUrl = `${siteUrl}/${username}`;
  const updated = slices?.[0]?.created_at || profile.created_at;

  const entries = (slices ?? [])
    .map((s) => {
      const content = escapeXml(s.purified_text || s.raw_text);
      return `  <entry>
    <id>urn:contextofme:${s.id}</id>
    <title>Slice ${s.id.slice(0, 8)}</title>
    <updated>${new Date(s.created_at).toISOString()}</updated>
    <content type="text">${content}</content>
    <link href="${profileUrl}" rel="alternate"/>
  </entry>`;
    })
    .join("\n");

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${feedUrl}</id>
  <title>Context Vault of ${escapeXml(username)}</title>
  <subtitle>Machine-readable context feed for AI agents — CONTEXTof.me</subtitle>
  <updated>${new Date(updated).toISOString()}</updated>
  <link href="${profileUrl}" rel="alternate"/>
  <link href="${feedUrl}" rel="self"/>
  <author><name>${escapeXml(username)}</name></author>
  <generator>CONTEXTof.me</generator>
${entries}
</feed>`;

  // Log API call (fire and forget)
  supabase.from("api_logs").insert({ user_id: profile.user_id, endpoint: "feed" }).then();

  return new Response(atom, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
});
