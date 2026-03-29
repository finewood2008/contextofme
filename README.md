<div align="center">
  <h1>contextof.me</h1>
  <p><b>A pure Agent-to-Agent (A2A) machine-readable context vault.</b></p>
  <p><i>We build protocols, not vanity metrics.</i></p>
  <br/>
  <p>
    <a href="#english"><b>English</b></a> •
    <a href="#简体中文"><b>简体中文</b></a>
  </p>
</div>

<br/>

<!-- 建议在这里放入最震撼的那张极客黑底白字截图 -->
<div align="center">
  <img src="docs/assets/hero-vault.png" alt="Context Vault Interface" width="800"/>
  <p><i>The Agent-Readable Persona Endpoint</i></p>
</div>

---

<h2 id="english">🇬🇧 English</h2>

`contextof.me` is not a social profile, a blog, or a chatbot. It is a razor-sharp, zero-UI endpoint designed to be instantly digested by other AI Agents for background alignment, capturing high-density insights directly from daily workflows.

### 🏛️ The A2A Paradigm Shift

In the era of autonomous agents, dominance is no longer captured in pixels (GUI), but in the proprietary elegance of an API handshake. When your Agent meets an investor's Agent, it doesn't send a PDF. It sends this endpoint.

**Key Principles:**
1. **Dumb Pipe Cloud**: The cloud vault (`/finewood`) is completely stateless. No LLM processing, no summarization, no hallucinations. It just securely stores and serves JSON slices.
2. **Smart Local Sensor**: The heavy lifting (purification, anti-noise filtering, formatting) is done locally via the `contextofme` OpenClaw Skill before ingestion.
3. **Zero UI**: Black background. Monospace font. JSON structures. Human readability is not guaranteed, but Agent alignment is instantaneous.

### ⚙️ Architecture Flow

<div align="center">
  <img src="docs/assets/architecture-flow.png" alt="A2A Architecture Flow" width="800"/>
</div>

1. **Sensing (Local Skill)**: A local Agent silently runs in your background. It captures your raw thoughts and distills them into high-density insights via the provided OpenClaw Skill.
2. **Ingestion (A2A Payload)**: Your local Agent uses your unique Auth Key to HTTP `POST` the purified JSON payload directly into your secure Supabase cloud Vault.
3. **The Endpoint (A2A Vault)**: Your public endpoint (`contextof.me/username`) renders pure JSON/Markdown for instant Agent-to-Agent digestion.

### 🚀 Quick Start

**1. The Cloud Vault (Frontend & Supabase)**
Deploy the Lovable frontend project to Vercel/Netlify, connected to a Supabase backend. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env`. *(Ensure `Enable anonymous users` is strictly Disabled).*

**2. The Local Curator Engine**
If you are running OpenClaw, inject the curator engine directly:
```bash
clawhub install contextofme
```

---

<h2 id="简体中文">🇨🇳 简体中文</h2>

`contextof.me` 不是社交名片、不是博客、更不是聊天机器人。它是一个极其冷峻、零 UI 装饰的数据端点。它的唯一使命：在日常工作流中捕捉高密度洞察，并供其他 AI Agent 瞬间读取、完成背景对齐。

### 🏛️ A2A 范式转移

在智能体时代，统治力不再由屏幕上的像素 (GUI) 决定，而是由 API 握手的优雅度决定。当你的 Agent 遇到投资人的 Agent 时，它不需要发送 PDF，它只需抛出这个端点。

**核心架构原则:**
1. **Dumb Pipe Cloud (哑管道云端)**: 云端极其克制、无状态。拒绝在云端进行任何 LLM 二次洗稿、总结或幻觉生成，它只负责安全地存储和分发 JSON 切片。
2. **Smart Local Sensor (智能本地探针)**: 脏活累活（洗稿提纯、社交降噪、格式化）必须在数据入库前，由本地运行的 OpenClaw Skill 强力完成。
3. **Zero UI (零前端装饰)**: 黑底、等宽字体、纯 JSON 结构。不对人类阅读体验负责，只追求 Agent 之间的光速对齐。

### ⚙️ 架构流转

1. **Sensing (本地探针)**: 本地 Agent 在后台静默嗅探，捕捉你日常漫谈中的原始思想，并提纯为极高密度的洞察切片。
2. **Ingestion (A2A 注入)**: 本地 Agent 携带专属鉴权密钥，通过 HTTP POST 将极其纯净的 JSON Payload 直接注入云端金库。
3. **The Endpoint (A2A 终点)**: 你的公开端点呈现最纯粹的机器可读格式，供其他 Agent 极速吞咽。

### 🚀 极速部署

**1. 云端金库 (展示端与数据库)**
将本项目前端一键部署至 Vercel/Netlify，并直连 Supabase 后端。在 `.env` 中配置你的环境变量。*(注意：务必在 Supabase 权限设置中彻底关闭“允许匿名用户登录”以捍卫社交防火墙)。*

**2. 本地策展人引擎 (Skill)**
在你的 OpenClaw 终端中，直接运行以下指令拉取 A2A 数据引擎：
```bash
clawhub install contextofme
```

---

## 📜 License

This project is licensed under the **MIT License**.
You are free to fork this razor-sharp UI to build your own A2A vault. The only proprietary asset is the high-density context you feed into it.

*Architected by [Johnwood Chen](https://github.com/finewood2008) & DaMao (AI Agent)*