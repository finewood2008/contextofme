import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, ExternalLink } from "lucide-react";

interface XPlatformConfigProps {
  userId: string;
}

const XPlatformConfig = ({ userId }: XPlatformConfigProps) => {
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessSecret, setAccessSecret] = useState("");
  const [autoPost, setAutoPost] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, [userId]);

  const loadConfig = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("x_api_key, x_api_secret, x_access_token, x_access_secret, x_auto_post")
      .eq("user_id", userId)
      .single();

    if (data) {
      setApiKey(data.x_api_key || "");
      setApiSecret(data.x_api_secret || "");
      setAccessToken(data.x_access_token || "");
      setAccessSecret(data.x_access_secret || "");
      setAutoPost(data.x_auto_post || false);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        x_api_key: apiKey,
        x_api_secret: apiSecret,
        x_access_token: accessToken,
        x_access_secret: accessSecret,
        x_auto_post: autoPost,
      })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save X platform configuration",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "X platform configuration updated successfully",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-muted-foreground font-mono text-sm">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm text-foreground">X Platform Configuration</h3>
          <div className="flex items-center gap-2">
            <a
              href="/docs/x-platform-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              Setup Guide
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground/30">|</span>
            <a
              href="https://developer.twitter.com/en/portal/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Get API Keys
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              API Key
            </label>
            <Input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your X API Key"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              API Secret
            </label>
            <Input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Enter your X API Secret"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              Access Token
            </label>
            <Input
              type="text"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Enter your X Access Token"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              Access Token Secret
            </label>
            <Input
              type="password"
              value={accessSecret}
              onChange={(e) => setAccessSecret(e.target.value)}
              placeholder="Enter your X Access Token Secret"
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <label className="font-mono text-xs text-foreground block mb-1">
                Auto-post to X
              </label>
              <p className="text-xs text-muted-foreground">
                Automatically post new slices to X platform
              </p>
            </div>
            <Switch
              checked={autoPost}
              onCheckedChange={setAutoPost}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-mono text-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>

      <div className="glass-card rounded-sm p-4 space-y-3">
        <h4 className="font-mono text-xs text-foreground font-medium">How to get X API credentials</h4>
        <ol className="space-y-2 text-xs text-muted-foreground leading-relaxed list-decimal list-inside">
          <li>Visit <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">X Developer Portal</a></li>
          <li>Create a new App (or use existing one)</li>
          <li>Go to "Keys and tokens" tab</li>
          <li>Generate/Copy:
            <ul className="ml-6 mt-1 space-y-1 list-disc list-inside">
              <li><strong>API Key</strong> (Consumer Key)</li>
              <li><strong>API Secret</strong> (Consumer Secret)</li>
              <li><strong>Access Token</strong></li>
              <li><strong>Access Token Secret</strong></li>
            </ul>
          </li>
          <li>Make sure your app has <strong>Read and Write</strong> permissions</li>
          <li>Paste the credentials above and save</li>
        </ol>
        <p className="font-mono text-xs text-muted-foreground/60 pt-2 border-t border-border">
          <span className="text-amber-400">⚠️</span> Your API credentials are stored securely and never shared.
        </p>
      </div>
    </motion.div>
  );
};

export default XPlatformConfig;
