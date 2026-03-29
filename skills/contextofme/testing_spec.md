# contextofme (人生上下文) - 思想基座主动捕捉机制测试规范

## 1. 触发逻辑测试 (Curator Engine)
*   **动作**: 嘉木总在任意会话流中抛出一段关于商业范式、产品思考或审美观点的长文本/图片。
*   **预期**: AI (大猫) 必须通过后台正则或向量相似度，判断其是否符合 `persona.json` 设定的 Target Vibe。如果符合，抛出 Hook：
    > “嘉木总，这段关于 [话题核心点] 的洞察极具杀伤力。是否提取并封装为 A2A (Agent-to-Agent) 结构化切片，Sync 至您的 contextof.me 思想基座？”

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

## 3. 防误触机制 (Anti-noise)
*   **动作**: 用户说“今天晚上吃烧烤”、“帮忙查个快递”。
*   **预期**: AI 直接执行/回复，绝对**不得**触发 Context 提取提示。