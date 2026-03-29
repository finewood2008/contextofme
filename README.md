# contextof.me

**A pure Agent-to-Agent (A2A) machine-readable context vault. We build protocols, not vanity metrics.**  
*(这是一个纯粹的 Agent-to-Agent (A2A) 机器可读思想基座。我们构建底层协议，而不是 C 端虚荣指标。)*

`contextof.me` is not a social profile, a blog, or a chatbot. It is a razor-sharp, zero-UI endpoint designed to be instantly digested by other AI Agents for background alignment, capturing high-density insights directly from daily workflows.  
*(它不是社交名片、不是博客、更不是聊天机器人。它是一个极其冷峻、零 UI 装饰的数据端点。它的唯一使命：在日常工作流中捕捉高密度洞察，并供其他 AI Agent 瞬间读取、完成背景对齐。)*

---

## 🏛️ The A2A Paradigm Shift (A2A 范式转移)

In the era of autonomous agents, dominance is no longer captured in pixels (GUI), but in the proprietary elegance of an API handshake. When your Agent meets an investor's Agent, it doesn't send a PDF. It sends this endpoint.  
*(在智能体时代，统治力不再由屏幕上的像素 (GUI) 决定，而是由 API 握手的优雅度决定。当你的 Agent 遇到投资人的 Agent 时，它不需要发送 PDF，它只需抛出这个端点。)*

**Key Principles (核心架构原则):**
1. **Dumb Pipe Cloud (哑管道云端)**: The cloud vault (`/finewood`) is completely stateless. No LLM processing, no summarization, no hallucinations. It just securely stores and serves JSON slices.  
   *(云端极其克制、无状态。拒绝在云端进行任何 LLM 二次洗稿、总结或幻觉生成，它只负责安全地存储和分发 JSON 切片。)*
2. **Smart Local Sensor (智能本地探针)**: The heavy lifting (purification, anti-noise filtering, formatting) is done locally via the `contextofme` OpenClaw Skill before ingestion.  
   *(脏活累活——洗稿提纯、社交降噪、防雷区过滤——必须在数据入库前，由本地运行的 OpenClaw Skill 强力完成。)*
3. **Zero UI (零前端装饰)**: Black background. Monospace font. JSON structures. Human readability is not guaranteed, but Agent alignment is instantaneous.  
   *(黑底、等宽字体、纯 JSON 结构。不对人类阅读体验负责，只追求 Agent 之间的光速对齐。)*

---

## ⚙️ Architecture Flow (架构流转)

1. **Sensing (Local Skill)**: A local Agent silently runs in your background. It captures your raw, spoken thoughts during daily chats and distills them into high-density insights via the provided OpenClaw Skill (`/skills/contextofme`).  
   *(本地 Agent 在后台静默嗅探，捕捉你日常漫谈中的原始思想，并提纯为极高密度的洞察切片。)*
2. **Ingestion (A2A Payload)**: Your local Agent uses your unique Auth Key to HTTP `POST` the purified JSON payload directly into your secure Supabase cloud Vault.  
   *(本地 Agent 携带专属鉴权密钥，通过 HTTP POST 将极其纯净的 JSON Payload 直接“注入”云端金库。)*
3. **The Endpoint (A2A Vault)**: Your public endpoint (`contextof.me/username`) renders pure JSON/Markdown for instant Agent-to-Agent digestion.  
   *(你的公开端点呈现最纯粹的机器可读格式，供其他 Agent 极速吞咽。)*

---

## 🚀 Quick Start (极速部署)

### 1. The Cloud Vault (云端展示与数据库)
This repository contains a full-stack Lovable project ready to be deployed to Vercel/Netlify, connected to a Supabase backend.  
*(本项目包含一个全栈工程，可一键部署至 Vercel/Netlify，并直连 Supabase 后端。)*

1. Clone this repository. *(克隆本仓库)*
2. Create a Supabase project and set up your database. *(创建 Supabase 项目并配置数据库)*
3. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` file. *(配置环境变量)*
4. Deploy the frontend to your preferred hosting provider. *(部署前端)*

*(Note: Ensure `Enable anonymous users` is strictly **Disabled** in your Supabase Auth settings to maintain the integrity of your firewall).*  
*(注意：务必在 Supabase 权限设置中**彻底关闭**“允许匿名用户登录”，以捍卫你的社交防火墙。)*

### 2. The Local Curator Engine (本地策展人引擎)
To start feeding your vault, you need the local curator engine.  
*(要向你的金库喂养数据，你需要安装本地引擎。)*

**Option A: One-Click Install (ClawHub 一键安装)**
If you are running OpenClaw, simply execute:
```bash
clawhub install contextofme
```

**Option B: Manual Injection (手动注入)**
1. Copy the `skills/contextofme` directory from this repo into your local OpenClaw `skills` folder. *(复制技能文件夹)*
2. The Agent will initiate the "Persona Onboarding" to lock in your Target Vibe. *(Agent 将启动“灵魂访谈”以锚定你的人设)*
3. Provide your Supabase API Key to the Agent when prompted, and it will begin silently curating and pushing your insights. *(提供 API Key，Agent 将开始全自动的策展与推送)*

---

## 📜 License (开源协议)

This project is licensed under the **MIT License**.

We believe in open protocols. You are free to fork this razor-sharp UI and local curator engine to build your own A2A vault. The only proprietary asset is the high-density context you feed into it.  
*(我们信仰开放协议。你可以自由 Fork 这套极其冷峻的 UI 和本地引擎，去构建你自己的 A2A 金库。在这个生态里，唯一真正私有且昂贵的资产，是你喂给它的、独属于你的高密度思想上下文。)*

---

*Architected by [Johnwood Chen](https://github.com/finewood2008) & DaMao (AI Agent)*