import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/hooks/use-locale';
import { ArrowRight, Check, Sparkles, ExternalLink } from 'lucide-react';

interface OnboardingWizardProps {
  userId: string;
  apiToken: string;
  onComplete: () => void;
  onUsernameSet: (username: string) => void;
}

const USERNAME_RE = /^[a-z0-9][a-z0-9_-]{0,28}[a-z0-9]$/;

export default function OnboardingWizard({ userId, apiToken, onComplete, onUsernameSet }: OnboardingWizardProps) {
  const { t } = useLocale();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [checking, setChecking] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const [sliceText, setSliceText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- Step 1: Claim Username ---

  const validateUsername = (val: string) => {
    const v = val.toLowerCase();
    if (v.length < 2) return t('usernameTooShort') || 'Must be at least 2 characters';
    if (v.length > 30) return t('usernameTooLong') || 'Must be 30 characters or fewer';
    if (!USERNAME_RE.test(v)) return t('usernameInvalid') || 'Lowercase letters, numbers, hyphens, underscores only';
    return '';
  };

  const handleUsernameChange = (val: string) => {
    const v = val.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(v);
    setUsernameError(v ? validateUsername(v) : '');
  };

  const claimUsername = async () => {
    const err = validateUsername(username);
    if (err) { setUsernameError(err); return; }

    setChecking(true);
    setUsernameError('');

    try {
      // Check availability
      const { data: existing } = await supabase
        .from('public_profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (existing) {
        setUsernameError(t('usernameTaken') || 'Username is already taken');
        setChecking(false);
        return;
      }

      setClaiming(true);

      // Save to profiles
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', userId);

      if (updateErr) throw updateErr;

      onUsernameSet(username);
      toast({ title: t('usernameClaimed') || 'Username claimed!' });
      setStep(2);
    } catch (e: any) {
      setUsernameError(e.message || 'Something went wrong');
    } finally {
      setChecking(false);
      setClaiming(false);
    }
  };

  // --- Step 2: First Slice ---

  const submitSlice = async () => {
    if (!sliceText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('ingest', {
        body: { raw: sliceText.trim() },
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      if (error) throw error;
      toast({ title: t('sliceSaved') || 'First slice saved!' });
      setStep(3);
    } catch (e: any) {
      toast({ title: t('error') || 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const skipSlice = () => setStep(3);

  // --- Render ---

  const stepIndicator = (
    <div className="font-mono text-xs text-muted-foreground mb-6 flex items-center gap-2">
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] ${
            s === step
              ? 'border-primary text-primary bg-primary/10'
              : s < step
                ? 'border-primary/40 text-primary/60 bg-primary/5'
                : 'border-border text-muted-foreground'
          }`}
        >
          {s < step ? <Check className="w-3 h-3" /> : s}
        </span>
      ))}
      <span className="ml-1 text-muted-foreground">{step}/3</span>
    </div>
  );

  const fadeVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md mx-4 p-6 rounded-xl border border-border bg-background/95 shadow-2xl"
      >
        {stepIndicator}

        <AnimatePresence mode="wait">
          {/* Step 1: Claim Username */}
          {step === 1 && (
            <motion.div key="step1" {...fadeVariants} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="font-mono text-sm font-medium">
                  {t('claimUsername') || 'Claim your username'}
                </h2>
              </div>

              <p className="font-mono text-xs text-muted-foreground mb-4">
                {t('claimUsernameDesc') || 'Choose a unique handle for your public profile.'}
              </p>

              <div className="flex items-center gap-1 mb-2">
                <span className="font-mono text-sm text-muted-foreground">/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && claimUsername()}
                  placeholder="yourname"
                  maxLength={30}
                  className="flex-1 bg-transparent border border-border rounded px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {usernameError && (
                <p className="font-mono text-xs text-destructive mb-3">{usernameError}</p>
              )}

              <button
                onClick={claimUsername}
                disabled={!username || !!usernameError || checking || claiming}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs py-2.5 px-4 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checking || claiming
                  ? (t('checking') || 'Checking...')
                  : (t('claimBtn') || 'Claim')}
                {!checking && !claiming && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </motion.div>
          )}

          {/* Step 2: First Slice */}
          {step === 2 && (
            <motion.div key="step2" {...fadeVariants} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="font-mono text-sm font-medium">
                  {t('writeFirstSlice') || 'Write your first slice'}
                </h2>
              </div>

              <p className="font-mono text-xs text-muted-foreground mb-4">
                {t('writeFirstSliceDesc') || 'A slice is a thought, note, or idea. Write anything.'}
              </p>

              <textarea
                value={sliceText}
                onChange={(e) => setSliceText(e.target.value)}
                placeholder={t('slicePlaceholder') || 'What\'s on your mind?'}
                rows={4}
                className="w-full bg-transparent border border-border rounded px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={skipSlice}
                  className="flex-1 font-mono text-xs py-2.5 px-4 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('skip') || 'Skip'}
                </button>
                <button
                  onClick={submitSlice}
                  disabled={!sliceText.trim() || submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs py-2.5 px-4 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (t('saving') || 'Saving...') : (t('save') || 'Save')}
                  {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <motion.div key="step3" {...fadeVariants} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-4 h-4 text-green-500" />
                <h2 className="font-mono text-sm font-medium">
                  {t('onboardingDone') || 'You\'re all set!'}
                </h2>
              </div>

              <p className="font-mono text-xs text-muted-foreground mb-4">
                {t('onboardingDoneDesc') || 'Your context vault is ready. Start capturing your thoughts.'}
              </p>

              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-primary hover:underline mb-4"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t('viewProfile') || 'View public profile'} /{username}
              </a>

              <button
                onClick={onComplete}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-mono text-xs py-2.5 px-4 rounded hover:bg-primary/90 transition-colors"
              >
                {t('goToDashboard') || 'Go to Dashboard'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
