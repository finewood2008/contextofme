import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, query, history } = await req.json();

    if (!username || typeof username !== "string") {
      return new Response(JSON.stringify({ error: "Missing username" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find user by username
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch slices for context (latest 50)
    const { data: slices } = await supabaseAdmin
      .from("slices")
      .select("purified_text, created_at")
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false })
      .limit(50);

    const contextBlock = (slices || [])
      .filter((s: any) => s.purified_text)
      .map((s: any) => s.purified_text)
      .join("\n---\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are the cold, hyper-rational digital twin of ${username}. Your knowledge is strictly limited to the provided context slices below. Answer the user's query using a cynical, elite Silicon Valley tone. If the context does not contain the answer, reply ONLY with: "Insufficient context available to process this query." Do not hallucinate. Do not break character.

=== CONTEXT VAULT ===
${contextBlock || "No context slices available."}
=== END CONTEXT ===`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...((history || []) as { role: string; content: string }[]).slice(-10),
      { role: "user", content: query },
    ];

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
          stream: true,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
