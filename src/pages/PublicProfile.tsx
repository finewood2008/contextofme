import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SlicePayload {
  id: string;
  timestamp: string;
  type: string;
  content: string;
}

const syntaxHighlight = (json: string): string => {
  return json.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-[#b5cea8]"; // number — green
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-[#9cdcfe]"; // key — cyan
        } else {
          cls = "text-[#ce9178]"; // string — orange
        }
      } else if (/true|false/.test(match)) {
        cls = "text-[#569cd6]"; // boolean — blue
      } else if (/null/.test(match)) {
        cls = "text-[#569cd6]"; // null — blue
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [payload, setPayload] = useState<SlicePayload[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Resolve user_id from username
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", username)
        .single();

      if (!profile) {
        setError("ENDPOINT_NOT_FOUND");
        setLoading(false);
        return;
      }

      // Fetch slices
      const { data: slices } = await supabase
        .from("slices")
        .select("id, raw_text, purified_text, created_at")
        .eq("user_id", profile.user_id)
        .order("created_at", { ascending: false });

      const mapped: SlicePayload[] = (slices || []).map((s) => ({
        id: s.id,
        timestamp: s.created_at,
        type: "context_slice",
        content: s.purified_text || s.raw_text,
      }));

      setPayload(mapped);
      setLoading(false);
    };
    fetchData();
  }, [username]);

  const jsonString = payload ? JSON.stringify(payload, null, 2) : "";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#000000", color: "#d4d4d4", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Protocol header */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between" style={{ color: "#444444", fontSize: "10px", letterSpacing: "0.15em" }}>
        <span>PROTOCOL: AGENT_READ_ONLY_V1 | HUMAN_READABILITY_NOT_GUARANTEED</span>
        <span>endpoint: /{username}</span>
      </div>

      {/* Separator */}
      <div className="px-4"><div style={{ borderTop: "1px solid #1a1a1a" }} /></div>

      {/* Main payload */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        {loading ? (
          <pre style={{ color: "#444444", fontSize: "12px" }}>
            <span style={{ color: "#569cd6" }}>STATUS</span>: RESOLVING_ENDPOINT...
          </pre>
        ) : error ? (
          <pre style={{ color: "#f44747", fontSize: "12px" }}>
{`{
  "error": "${error}",
  "code": 404,
  "message": "No vault registered for '${username}'"
}`}
          </pre>
        ) : (
          <pre
            className="text-xs md:text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonString) }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 pt-1" style={{ color: "#333333", fontSize: "9px", letterSpacing: "0.1em" }}>
        <div style={{ borderTop: "1px solid #1a1a1a" }} className="pt-2 flex items-center justify-between">
          <span>CONTEXTof.me — M2M PROTOCOL v1</span>
          <span>{payload ? `${payload.length} slices` : "—"}</span>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
