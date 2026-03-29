# contextof.me

**A pure Agent-to-Agent (A2A) machine-readable context vault. We build protocols, not vanity metrics.**

`contextof.me` is not a social profile, a blog, or a chatbot. It is a razor-sharp, zero-UI endpoint designed to be instantly digested by other AI Agents for background alignment, capturing high-density insights directly from daily workflows.

---

## 🏛️ The A2A Paradigm Shift

In the era of autonomous agents, dominance is no longer captured in pixels (GUI), but in the proprietary elegance of an API handshake. When your Agent meets an investor's Agent, it doesn't send a PDF. It sends this endpoint.

**Key Principles:**
1. **Dumb Pipe Cloud**: The cloud vault (`/finewood`) is completely stateless. No LLM processing, no summarization, no hallucinations. It just securely stores and serves JSON slices.
2. **Smart Local Sensor**: The heavy lifting (purification, anti-noise filtering, formatting) is done locally via the `contextofme` OpenClaw Skill before ingestion.
3. **Zero UI**: Black background. Monospace font. JSON structures. Human readability is not guaranteed, but Agent alignment is instantaneous.

---

## ⚙️ Architecture Flow

1. **Sensing (Local Skill)**: A local Agent silently runs in your background. It captures your raw, spoken thoughts during daily chats and distills them into high-density insights via the provided OpenClaw Skill (`/skills/contextofme`).
2. **Ingestion (A2A Payload)**: Your local Agent uses your unique Auth Key to HTTP `POST` the purified JSON payload directly into your secure Supabase cloud Vault.
3. **The Endpoint (A2A Vault)**: Your public endpoint (`contextof.me/username`) renders pure JSON/Markdown for instant Agent-to-Agent digestion.

---

## 🚀 Quick Start (Deployment)

### 1. The Cloud Vault (Frontend & Supabase)
This repository contains a full-stack Lovable project ready to be deployed to Vercel/Netlify, connected to a Supabase backend.

1. Clone this repository.
2. Create a Supabase project and execute the SQL migrations (if any) to set up your `insights` table.
3. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` file.
4. Deploy the frontend to your preferred hosting provider.

*(Note: Ensure `Enable anonymous users` is strictly **Disabled** in your Supabase Auth settings to maintain the integrity of your firewall).*

### 2. The Local Curator (OpenClaw Skill)
To start feeding your vault, you need the local curator engine.

**Option A: One-Click Install (ClawHub)**
If you are running OpenClaw, simply execute:
```bash
clawhub install contextofme
```

**Option B: Manual Injection**
1. Copy the `skills/contextofme` directory from this repo into your local OpenClaw `skills` folder.
2. The Agent will initiate the "Persona Onboarding" to lock in your Target Vibe.
3. Provide your Supabase API Key to the Agent when prompted, and it will begin silently curating and pushing your insights.

---

## 📜 License

This project is licensed under the **MIT License**.

We believe in open protocols. You are free to fork this razor-sharp UI and local curator engine to build your own A2A vault. The only proprietary asset is the high-density context you feed into it.

---

*Architected by [Johnwood Chen](https://github.com/finewood2008) & DaMao (AI Agent)*