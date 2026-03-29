import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface ProfileContextProps {
  userId: string;
}

const ProfileContext = ({ userId }: ProfileContextProps) => {
  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, occupation, location, bio")
      .eq("user_id", userId)
      .single();

    if (data) {
      setFullName(data.full_name || "");
      setOccupation(data.occupation || "");
      setLocation(data.location || "");
      setBio(data.bio || "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        occupation: occupation,
        location: location,
        bio: bio,
      })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save profile context",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "Profile context updated successfully",
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
        <div>
          <h3 className="font-mono text-sm text-foreground mb-2">Profile Context</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This information helps AI agents understand your context better. 
            It's private and won't appear on your public profile.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              Full Name
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              Occupation
            </label>
            <Input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. AI Product Manager, Entrepreneur"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              Location
            </label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Beijing, China"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              Bio / Self Introduction
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write anything you want agents to know about you - your background, goals, values, current projects, challenges, etc."
              className="font-mono text-sm min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground/60 mt-1.5">
              Free-form text. Write whatever helps agents understand your context.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-mono text-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Profile Context"}
        </Button>
      </div>

      <div className="glass-card rounded-sm p-4">
        <p className="font-mono text-xs text-muted-foreground/60 leading-relaxed">
          <span className="text-blue-400">ℹ️</span> This information is only accessible via API with your token. 
          It won't appear on your public profile page.
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileContext;
