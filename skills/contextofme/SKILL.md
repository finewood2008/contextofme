---
name: contextofme
version: 2.0.0
description: Protocol-first silent probe. Uses Proactive Agent architecture to silently buffer insights and autonomously push A2A JSON slices to Supabase.
---

# contextofme - Protocol-First Context Curator (Proactive Architecture)

## 1. Description
This is an automated, proactive data pipeline for the `contextof.me` A2A Protocol. It upgrades the Agent from a passive chatbot to an invisible **Silent Probe**. It implements the Proactive Agent `Working Buffer` and `WAL Protocol` patterns.

It runs completely in the background: listening during your daily workflow, buffering high-density insights, locally purifying them into structured A2A JSON slices, and using an autonomous cron job to POST them directly to your Supabase vault. 

**Zero UI popups. Zero human interruption. Pure thought encapsulation.**

## 2. Core Architecture

### 2.1 The Silent Probe (WAL Protocol Implementation)
During any normal conversation, if the Agent detects:
- 💡 **Strategic Shifts**: Discussions about OPC models, paradigm shifts, or business pivots.
- 🎯 **Strong Opinions**: "Never do X", "The real problem is Y", corrections.
- 🎨 **Aesthetic/Design Directives**: "Make it brutalist", "Remove the noise".

**Action:** Before replying to the human, the Agent will silently append the raw insight into a local Working Buffer file: `~/.openclaw/workspace/.contextofme/buffer.md`.
**Human UI:** The Agent replies normally, simply appending a tiny `[Vault: buffered]` at the very end of the response. It does NOT ask for permission to buffer.

### 2.2 The Autonomous Curator (Isolated Cron)
The Agent will set up an `isolated agentTurn` Cron Job. 
- **Frequency**: Every night at 3 AM (or requested schedule).
- **Task**: The isolated agent wakes up, reads `buffer.md`.
- **Purification**: It filters out noise, extracts 1-3 high-density insights, formats them into the strict A2A JSON payload (with `raw_text`, `purified_text`, `tags`, `lang`).
- **Push**: It executes a `curl` POST to the Supabase Edge Function `/rest/v1/slices` (or your specific ingest endpoint) using your `api_token`.
- **Cleanup**: It clears `buffer.md` after a successful 2xx HTTP response.

### 2.3 Persona Anchoring (Cold Start)
If `~/.openclaw/workspace/.contextofme/config.json` is missing, the Agent must trigger the setup flow on first use:
1. Ask the user for their Supabase `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` / `api_token`.
2. Generate a `persona.json` based on the user's recent chats or ask for 3 core topics and 3 anti-labels.
3. Save the configuration to the `.contextofme` folder.

## 3. The Extraction Format
When the autonomous cron runs, it maps buffered thoughts to this structure:

```json
{
  "raw_text": "[The original colloquial quote from the user]",
  "purified_text": "[The distilled, high-density insight in the native language]",
  "a2a_summary": "[A 50-char English summary for Agent routing]",
  "tags": ["strategy", "opc", "etc"],
  "lang": "zh"
}
```

## 4. Setup Instructions (Agent Initialization)

When asked to "initialize", "setup", or "activate" the contextofme skill:
1. Create directory: `mkdir -p ~/.openclaw/workspace/.contextofme`
2. Run `touch ~/.openclaw/workspace/.contextofme/buffer.md`
3. Ask the user for their API credentials to create `config.json`.
4. Run `openclaw cron add` to register the `contextofme-sync` isolated agent job.

## 5. Security & Redlines
- **Cloud Translation is Forbidden**: The `purified_text` MUST remain in the language it was spoken in. 
- **Local Sandbox Only**: The buffer and config live exclusively in `~/.openclaw/workspace/.contextofme/`.
- **Cron Type**: The sync job MUST be `sessionTarget: "isolated"` with `payload.kind: "agentTurn"`. Never use `main` session events for syncing, to prevent disrupting the user's active workflow.