import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const username =
    url.searchParams.get("username") ||
    url.pathname.split("/").filter(Boolean).pop();

  if (!username || username === "context") {
    return new Response(
      JSON.stringify({ error: "Missing username parameter. Use ?username=xxx" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, username, created_at")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return new Response(
      JSON.stringify({ error: `No vault found for "${username}"` }),
      { status: 404, headers: corsHeaders }
    );
  }

  // Get total count
  const { count } = await supabase
    .from("slices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.user_id);

  const total = count ?? 0;

  // Fetch paginated slices
  const { data: slices, error: slicesError } = await supabase
    .from("slices")
    .select("id, raw_text, purified_text, created_at")
    .eq("user_id", profile.user_id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (slicesError) {
    return new Response(
      JSON.stringify({ error: "Failed to retrieve context slices" }),
      { status: 500, headers: corsHeaders }
    );
  }

  const response = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    vault: {
      owner: profile.username,
      created_at: profile.created_at,
      total_slices: total,
    },
    pagination: {
      limit,
      offset,
      total,
      has_more: offset + limit < total,
    },
    slices: (slices ?? []).map((s) => ({
      id: s.id,
      content: s.purified_text || s.raw_text,
      raw: s.raw_text,
      created_at: s.created_at,
    })),
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: corsHeaders,
  });
});
