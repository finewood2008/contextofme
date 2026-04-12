import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiter: max 5 provisions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Max 5 provisions per hour." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Generate a random "ghost" email and complex password
    const randomHex = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    const ghostEmail = `ghost_${randomHex}@contextof.me`;
    const ghostPassword = crypto.randomUUID() + crypto.randomUUID();

    // 2. Create the Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ghostEmail,
      password: ghostPassword,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error("Auth creation error:", authError);
      throw new Error("Failed to provision ghost user");
    }

    const userId = authData.user.id;

    // 3. Generate a temporary read-only username based on the hex
    const tempUsername = `anon_${randomHex.slice(0, 8)}`;

    // 4. Update the profile with the temp username (profile is auto-created by trigger)
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({ username: tempUsername, is_private: false })
      .eq("user_id", userId);

    if (profileUpdateError) {
      console.error("Profile update error:", profileUpdateError);
      // Non-fatal, continue to fetch token
    }

    // 5. Fetch the auto-generated api_token
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("api_token")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      console.error("Profile fetch error:", profileError);
      throw new Error("Failed to retrieve provisioned token");
    }

    // 6. Return the credentials to the Agent
    return new Response(
      JSON.stringify({
        success: true,
        api_token: profile.api_token,
        username: tempUsername,
        endpoint_url: `https://contextof.me/${tempUsername}`,
        claim_url: `https://contextof.me/claim?token=${profile.api_token}`,
        message: "Provisional vault created. Limited capacity until claimed."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (e) {
    console.error("auto-provision error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});