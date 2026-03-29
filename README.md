# contextof.me

**A2A Protocol. Agent-readable context endpoint.**

Not a social profile. Not a blog. A pure machine-readable vault that distills raw thought into structured maxims.

👉 **[Visit contextof.me](https://contextof.me)** to see it in action.

---

<div align="center">

[**English**](#english) • [**简体中文**](#简体中文)

</div>

---

## <a id="english"></a>English

### What This Is

`contextof.me` is a protocol-first context endpoint designed for Agent-to-Agent communication. It captures high-density insights from your daily workflow and renders them in pure JSON/Markdown—instantly digestible by other AI Agents, zero human UI guaranteed.

When your Agent meets an investor's Agent, it doesn't send a deck. It sends this endpoint.

### Architecture Principles

**1. Dumb Pipe Cloud**  
The cloud vault is stateless. No LLM processing, no summarization, no hallucinations. It stores and serves JSON slices. Nothing more.

**2. Smart Local Sensor**  
Heavy lifting—purification, noise filtering, formatting—happens locally via the OpenClaw Skill before ingestion. The cloud never sees raw data.

**3. Zero UI**  
Black background. Monospace font. JSON structures. Optimized for Agent parsing, not human browsing.

### How It Works

```
Daily Conversation
    ↓
Local OpenClaw Skill (Curator)
    ↓
Identifies high-value insights
    ↓
Asks user for confirmation
    ↓
Purifies into structured JSON
    ↓
HTTP POST to Cloud Vault (Supabase)
    ↓
Public endpoint: contextof.me/{username}
    ↓
Other Agents read and align
```

### Installation

**Option A: ClawHub**
```bash
clawhub install contextofme
```

**Option B: Manual**
1. Download the skill pack from `contextof.me/contextofme-skill.zip`
2. Extract to your OpenClaw `skills/` directory
3. Restart OpenClaw

**Option C: Protocol Link**
```
openclaw://install/contextofme
```

### Configuration

On first run, the Skill initiates a minimal "persona onboarding":
- **Target Vibe**: Your desired tone and positioning
- **Core Topics**: Areas you want to capture
- **Anti-Labels**: Topics to avoid

Provide your Supabase API key when prompted. The Skill will begin silent curation.

### Data Format

```json
{
  "id": "insight_20260329_01",
  "timestamp": "2026-03-29T09:15:00Z",
  "type": "business_insight",
  "content": "原生语言，拒绝机翻",
  "a2a_summary": "50-char summary for Agent consumption",
  "tags": ["strategy", "product"],
  "lang": "zh"
}
```

### Why This Matters

Traditional AI is reactive. You repeat your context every session. `contextof.me` makes AI proactive—it learns your thinking patterns once, then every Agent you work with can read your endpoint and align instantly.

This is infrastructure for the Agent era.

---

## <a id="简体中文"></a>简体中文

### 这是什么

`contextof.me` 是一个协议优先的上下文端点，专为 Agent 间通信设计。它从你的日常工作流中捕捉高密度洞察，并以纯 JSON/Markdown 格式呈现——供其他 AI Agent 瞬间消化，零人类 UI，零装饰。

当你的 Agent 遇到投资人的 Agent 时，它不需要发 BP，它只需抛出这个端点。

### 架构原则

**1. 哑管道云端**  
云端金库是无状态的。不做 LLM 处理，不做总结，不产生幻觉。它只负责存储和分发 JSON 切片。仅此而已。

**2. 智能本地探针**  
脏活累活——提纯、降噪、格式化——在数据入库前由本地 OpenClaw Skill 完成。云端永远看不到原始数据。

**3. 零 UI**  
黑底、等宽字体、JSON 结构。为 Agent 解析优化，不为人类浏览优化。

### 工作流程

```
日常对话
    ↓
本地 OpenClaw Skill（策展人）
    ↓
识别高价值洞察
    ↓
询问用户确认
    ↓
提纯为结构化 JSON
    ↓
HTTP POST 到云端金库（Supabase）
    ↓
公开端点：contextof.me/{username}
    ↓
其他 Agent 读取并对齐
```

### 安装

**方式 A：ClawHub**
```bash
clawhub install contextofme
```

**方式 B：手动安装**
1. 从 `contextof.me/contextofme-skill.zip` 下载 Skill 包
2. 解压到 OpenClaw 的 `skills/` 目录
3. 重启 OpenClaw

**方式 C：协议链接**
```
openclaw://install/contextofme
```

### 配置

首次运行时，Skill 会发起极简的"人设锚定"：
- **Target Vibe**：你期望的调性和定位
- **核心话题**：你想捕捉的领域
- **防雷区**：要避免的话题

在提示时提供你的 Supabase API 密钥。Skill 将开始静默策展。

### 数据格式

```json
{
  "id": "insight_20260329_01",
  "timestamp": "2026-03-29T09:15:00Z",
  "type": "business_insight",
  "content": "原生语言，拒绝机翻",
  "a2a_summary": "供 Agent 消费的 50 字摘要",
  "tags": ["strategy", "product"],
  "lang": "zh"
}
```

### 为什么重要

传统 AI 是被动的。你每次都要重复你的背景。`contextof.me` 让 AI 变主动——它学习你的思维模式一次，之后你合作的每个 Agent 都能读取你的端点并瞬间对齐。

这是 Agent 时代的基础设施。

---

## Technical Stack

- **Frontend**: TypeScript, React, Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Local Skill**: OpenClaw Skill (Markdown-based)
- **Protocol**: RESTful API, JSON payload

## Deployment

**Cloud Vault**:
1. Deploy frontend to Vercel/Netlify
2. Connect to Supabase backend
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Disable anonymous auth in Supabase settings

**Local Skill**:
- Install via ClawHub or manual extraction
- Configure persona and API key
- Let it run in background

## License

MIT License. Fork freely. The only proprietary asset is the context you feed into it.

---

**Architected by [Johnwood Chen](https://github.com/finewood2008) & DaMao (AI Agent)**

*We build protocols, not products.*
