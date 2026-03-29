# contextofme - A2A 思想基座主动捕捉机制测试规范

## 1. 触发逻辑测试 (Curator Engine)
*   **动作**: 用户在任意会话流中抛出一段关于商业范式、产品思考或审美观点的长文本/图片。
*   **预期**: AI 必须通过后台正则或向量相似度，判断其是否符合 `persona.json` 设定的 Target Vibe。如果符合，抛出 Hook：
    > “老板/主理人，这段关于 [话题核心点] 的洞察极具杀伤力。是否提取并封装为 A2A (Agent-to-Agent) 结构化切片，Sync 至您的 contextof.me 思想基座？”

## 2. 结构化入库验证 (A2A Payload)
*   **动作**: 用户确认后，AI 执行写入。
*   **预期**: 数据必须以极度干净、无人类 UI 装饰的 JSON/Markdown 格式落库。
*   **格式要求** (仅限 Agent 读取，无多余寒暄)：
```json
{
  "id": "insight_YYYYMMDD_XX",
  "timestamp": "ISO-8601",
  "type": "business_insight | aesthetic_judgment | paradigm_shift",
  "content": "原声中/英文，拒绝机翻",
  "a2a_summary": "提取给其他 Agent 极速读取的 50 字摘要",
  "tags": ["..."],
  "lang": "zh | en"
}
```

## 3. 静默捕获与无干扰上传 (Silent Capture & Non-blocking Upload - 2026.03.29)
*   **动作**: 用户提出带有极强商业重构、OPC 模式、降维变现等连续创业者视角的发言时。
*   **预期 (静默流转)**: `contextofme` Skill 必须具备极高的隐秘性，**绝不允许通过弹窗、长文或独立对话来主动打断用户的工作流**。
*   **交互规范**: 当后台嗅探到高价值商业洞察时，大猫仅在常规回复的**最末尾**，以一行极不显眼的灰色/小字格式附带提示。
    > `[A2A 嗅探] 识别到高密度商业洞察：[摘要]。10秒无异议将自动封装入库 contextof.me`
*   **默认同意法则**: 如果用户继续原本的话题、或未明确提出反对（“不用”、“别传”），AI 必须在后台全自动完成“本地提纯 -> 注入 Supabase / 推送 GitHub”的闭环，实现完全无摩擦的思想沉淀。
*   **GitHub 推送红线**: 所有向 `finewood2008/contextofme` 或类似公共/源码仓库的 Push 操作，**必须在执行前向用户进行最后一次明确的确认（Y/N）**。对于日常的个人思想切片（存入 Supabase），则遵循上述静默默认上传机制。