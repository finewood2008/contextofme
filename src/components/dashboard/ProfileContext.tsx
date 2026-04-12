import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/hooks/use-locale";
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
  const { t } = useLocale();

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
        title: t("error"),
        description: t("profileSaveFailed"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("profileSaved"),
        description: t("profileSavedDesc"),
      });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-muted-foreground font-mono text-sm">{t("loading")}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card rounded-sm p-6 space-y-4">
        <div>
          <h3 className="font-mono text-sm text-foreground mb-2">{t("profileContext")}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("profileContextDesc")}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              {t("profileFullName")}
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("profileFullNamePlaceholder")}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              {t("profileOccupation")}
            </label>
            <Input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder={t("profileOccupationPlaceholder")}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              {t("profileLocation")}
            </label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("profileLocationPlaceholder")}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted-foreground block mb-1.5">
              {t("profileBio")}
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("profileBioPlaceholder")}
              className="font-mono text-sm min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground/60 mt-1.5">
              {t("profileBioHint")}
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-mono text-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? t("profileSaving") : t("profileSaveButton")}
        </Button>
      </div>

      <div className="glass-card rounded-sm p-4">
        <p className="font-mono text-xs text-muted-foreground/60 leading-relaxed">
          <span className="text-blue-400">ℹ️</span> {t("profilePrivacyNote")}
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileContext;
