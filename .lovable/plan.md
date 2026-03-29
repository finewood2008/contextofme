

## Problem

The `ingest` edge function's AI prompt forces all output into English ("razor-sharp philosophical business maxim" in English tone). When users submit Chinese text, the purified version comes back in English. The `chat` function also uses English-only prompts. Additionally, all UI text is hardcoded in English.

## Plan

### 1. Fix Ingest Prompt to Preserve Original Language

**File:** `supabase/functions/ingest/index.ts`

Update the system prompt to detect and preserve the input language:

```
"Extract the core insight from this text. Rewrite it into a single, razor-sharp, 
cold, and luxurious philosophical maxim. Remove all conversational filler. 
IMPORTANT: Respond in the SAME LANGUAGE as the input text. If the input is in 
Chinese, respond in Chinese. If in English, respond in English. 
Return ONLY the maxim, nothing else."
```

### 2. Fix Chat Prompt to Support User's Language

**File:** `supabase/functions/chat/index.ts`

Update the system prompt to respond in the language of the user's query rather than forcing English.

### 3. Add i18n Support to Frontend

Create a lightweight i18n system:

- **`src/lib/i18n.ts`** — Language detection (browser locale) + translation map with `en` and `zh` keys covering all UI strings across Index, Auth, Dashboard, PublicProfile, ApiDocs pages.
- **`src/hooks/use-locale.ts`** — React hook that returns the current locale and `t()` function.
- Update all pages to use `t()` instead of hardcoded English strings:
  - `src/pages/Index.tsx` — Hero, nav buttons
  - `src/pages/Auth.tsx` — Login/signup form labels
  - `src/pages/Dashboard.tsx` — Tab labels, section headers, buttons, toasts
  - `src/pages/PublicProfile.tsx` — Header text, empty states, private vault message
  - `src/pages/ApiDocs.tsx` — Documentation text
  - `src/components/dashboard/SliceInput.tsx` — Placeholder, button labels
  - `src/components/dashboard/SliceCard.tsx` — Action labels
  - `src/components/dashboard/UsageStats.tsx` — Chart labels

### 4. Redeploy Edge Functions

Both `ingest` and `chat` functions need redeployment after prompt updates.

## Summary

- 2 edge function prompt fixes (preserve input language)
- 1 new i18n utility + hook
- ~8 frontend files updated to use translated strings
- No database changes needed

