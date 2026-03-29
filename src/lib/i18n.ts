const translations = {
  en: {
    // Nav
    signIn: "Sign In",
    getStarted: "Get Started",
    exit: "EXIT",
    dashboard: "DASHBOARD",

    // Index hero
    heroTagline: "API Gateway · Memory Vault",
    heroTitle1: "Context",
    heroTitle2: "Endpoint",
    heroDesc: "Distill raw thought into razor-sharp maxims. Your personal AI memory vault for the relentless.",
    heroButton: "INITIALIZE →",
    footerCopy: "© 2026 CONTEXTof.me",

    // Auth
    authenticate: "AUTHENTICATE",
    createEndpoint: "CREATE ENDPOINT",
    signInButton: "SIGN IN →",
    createAccountButton: "CREATE ACCOUNT →",
    needEndpoint: "Need an endpoint? Create one.",
    alreadyInitialized: "Already initialized? Sign in.",
    checkEmail: "Check your email",
    checkEmailDesc: "We sent you a verification link.",

    // Dashboard
    publicGateway: "Public Gateway",
    changeEndpoint: "CHANGE ENDPOINT",
    claimEndpoint: "CLAIM YOUR ENDPOINT",
    claimButton: "[ CLAIM ENDPOINT ]",
    vault: "VAULT",
    api: "API",
    memoryVault: "Memory Vault",
    noSlicesYet: "No slices yet. Send your first thought via the API.",
    apiToken: "API Token",
    accessControl: "Access Control",
    vaultLocked: "VAULT LOCKED — API KEY REQUIRED",
    vaultPublic: "VAULT PUBLIC — OPEN ACCESS",
    unlock: "[ UNLOCK ]",
    lock: "[ LOCK ]",
    endpoints: "Endpoints",
    fullDocs: "[ FULL DOCS → ]",
    usage: "Usage",
    endpointDescContext: "JSON vault data with pagination",
    endpointDescFeed: "Atom feed for subscriptions",
    endpointDescIngest: "Submit new slice (auth required)",
    endpointDescChat: "Streaming AI chat over vault",
    copied: "Copied",
    copiedToken: "API token copied to clipboard.",
    claimed: "Claimed",
    claimedDesc: "Endpoint /{slug} is now active.",
    unavailable: "Unavailable",
    unavailableDesc: "This endpoint is already claimed.",
    invalid: "Invalid",
    invalidDesc: "Username must be 2-30 characters (letters, numbers, - _).",
    vaultLockedToast: "Vault locked",
    vaultUnlockedToast: "Vault unlocked",
    vaultLockedDesc: "API access now requires your API key.",
    vaultUnlockedDesc: "API access is now public.",
    error: "Error",
    failedUpdate: "Failed to update endpoint.",

    // SliceInput
    transmitThought: "Transmit Thought",
    transmitPlaceholder: "Raw thought, note, or context...",
    tooLong: "Too long",
    tooLongDesc: "Max 5000 characters.",
    transmitButton: "[ TRANSMIT ]",
    purifying: "PURIFYING...",
    transmitted: "Transmitted",
    transmittedDesc: "Thought purified and stored.",
    transmissionFailed: "Transmission failed.",

    // SliceCard
    rawInput: "Raw Input",
    save: "SAVE",
    cancel: "CANCEL",
    updated: "Updated",
    sliceUpdated: "Slice updated.",
    deleted: "Deleted",
    sliceRemoved: "Slice removed.",
    failedDelete: "Failed to delete.",
    failedUpdateSlice: "Failed to update.",

    // UsageStats
    today: "TODAY",
    sevenDays: "7 DAYS",
    allTime: "ALL TIME",
    last7Days: "Last 7 days",
    byEndpoint: "By endpoint",
    noApiCalls: "No API calls recorded yet",
    recentCalls: "Recent calls",
    loadingStats: "Loading stats...",

    // PublicProfile
    resolvingEndpoint: "Resolving endpoint...",
    noVaultFound: "No vault found for",
    thisVaultPrivate: "This Vault is Private",
    privateVaultDesc: "has restricted access to this vault. Use the API with a valid key to retrieve context.",
    vaultLockedLabel: "VAULT LOCKED",
    contextOf: "Context of",
    publicVaultDesc: "Machine-readable context vault. This page is designed for AI agents to consume the principal's curated knowledge base.",
    slicesIndexed: "slice(s) indexed",
    vaultEmpty: "Vault is empty — no context slices loaded",

    // ApiDocs
    apiReference: "API Reference",
    apiDocsDesc: "All endpoints for programmatic access to your context vault. Private vaults require your API token via",
    baseUrl: "Base URL",
    aiAgentDiscovery: "AI Agent Discovery",
    endpoint: "Endpoint",
    parameters: "Parameters",
    publicAccess: "Public Access",
    authenticatedAccess: "Authenticated Access",
    response: "Response",
    copiedCommand: "Command copied to clipboard.",
    loading: "Loading...",

    // GatewayConfigDrawer
    gatewayConfig: "GATEWAY CONFIG",
    gatewayConfiguration: "Gateway Configuration",
    yourApiToken: "Your API Token",
    useTokenDesc: "Use this Bearer token with the /ingest endpoint",
    example: "EXAMPLE",
    establishGateway: "Establish the Gateway",
  },
  zh: {
    // Nav
    signIn: "登录",
    getStarted: "开始使用",
    exit: "退出",
    dashboard: "控制台",

    // Index hero
    heroTagline: "API 网关 · 记忆仓库",
    heroTitle1: "Context",
    heroTitle2: "Endpoint",
    heroDesc: "将原始思想提炼为极致格言。为不懈追求者打造的个人 AI 记忆仓库。",
    heroButton: "开始使用 →",
    footerCopy: "© 2026 CONTEXTof.me",

    // Auth
    authenticate: "身份验证",
    createEndpoint: "创建端点",
    signInButton: "登录 →",
    createAccountButton: "创建账户 →",
    needEndpoint: "还没有端点？立即创建。",
    alreadyInitialized: "已有账户？直接登录。",
    checkEmail: "请检查邮箱",
    checkEmailDesc: "我们已发送验证链接。",

    // Dashboard
    publicGateway: "公开网关",
    changeEndpoint: "更改端点",
    claimEndpoint: "领取你的端点",
    claimButton: "[ 领取端点 ]",
    vault: "仓库",
    api: "API",
    memoryVault: "记忆仓库",
    noSlicesYet: "暂无切片。通过 API 发送你的第一条思想。",
    apiToken: "API 令牌",
    accessControl: "访问控制",
    vaultLocked: "仓库已锁定 — 需要 API 密钥",
    vaultPublic: "仓库已公开 — 开放访问",
    unlock: "[ 解锁 ]",
    lock: "[ 锁定 ]",
    endpoints: "端点列表",
    fullDocs: "[ 完整文档 → ]",
    usage: "使用统计",
    endpointDescContext: "分页的 JSON 仓库数据",
    endpointDescFeed: "Atom 订阅源",
    endpointDescIngest: "提交新切片（需认证）",
    endpointDescChat: "基于仓库的流式 AI 对话",
    copied: "已复制",
    copiedToken: "API 令牌已复制到剪贴板。",
    claimed: "已领取",
    claimedDesc: "端点 /{slug} 已激活。",
    unavailable: "不可用",
    unavailableDesc: "此端点已被占用。",
    invalid: "无效",
    invalidDesc: "用户名需为 2-30 个字符（字母、数字、- _）。",
    vaultLockedToast: "仓库已锁定",
    vaultUnlockedToast: "仓库已解锁",
    vaultLockedDesc: "API 访问现在需要你的 API 密钥。",
    vaultUnlockedDesc: "API 访问已设为公开。",
    error: "错误",
    failedUpdate: "端点更新失败。",

    // SliceInput
    transmitThought: "传输思想",
    transmitPlaceholder: "原始思想、笔记或上下文……",
    tooLong: "内容过长",
    tooLongDesc: "最多 5000 个字符。",
    transmitButton: "[ 传输 ]",
    purifying: "提炼中...",
    transmitted: "已传输",
    transmittedDesc: "思想已提炼并存储。",
    transmissionFailed: "传输失败。",

    // SliceCard
    rawInput: "原始输入",
    save: "保存",
    cancel: "取消",
    updated: "已更新",
    sliceUpdated: "切片已更新。",
    deleted: "已删除",
    sliceRemoved: "切片已移除。",
    failedDelete: "删除失败。",
    failedUpdateSlice: "更新失败。",

    // UsageStats
    today: "今日",
    sevenDays: "7 天",
    allTime: "总计",
    last7Days: "过去 7 天",
    byEndpoint: "按端点",
    noApiCalls: "暂无 API 调用记录",
    recentCalls: "最近调用",
    loadingStats: "加载统计中...",

    // PublicProfile
    resolvingEndpoint: "解析端点中...",
    noVaultFound: "未找到该用户的仓库",
    thisVaultPrivate: "此仓库为私有",
    privateVaultDesc: "已限制对此仓库的访问。请使用有效的 API 密钥通过 API 获取上下文。",
    vaultLockedLabel: "仓库已锁定",
    contextOf: "Context of",
    publicVaultDesc: "机器可读的上下文仓库。此页面供 AI 代理消费用户精心策划的知识库。",
    slicesIndexed: "个切片已索引",
    vaultEmpty: "仓库为空 — 尚无上下文切片",

    // ApiDocs
    apiReference: "API 参考文档",
    apiDocsDesc: "程序化访问上下文仓库的所有端点。私有仓库需要通过以下方式提供 API 令牌：",
    baseUrl: "基础 URL",
    aiAgentDiscovery: "AI 代理发现",
    endpoint: "端点",
    parameters: "参数",
    publicAccess: "公开访问",
    authenticatedAccess: "认证访问",
    response: "响应",
    copiedCommand: "命令已复制到剪贴板。",
    loading: "加载中...",

    // GatewayConfigDrawer
    gatewayConfig: "网关配置",
    gatewayConfiguration: "网关配置",
    yourApiToken: "你的 API 令牌",
    useTokenDesc: "使用此 Bearer 令牌调用 /ingest 端点",
    example: "示例",
    establishGateway: "建立网关",
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

const LOCALE_KEY = "contextofme_locale";

export function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === "zh" || stored === "en") return stored;
  } catch {}
  return "en";
}

export function setStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {}
}

export function t(key: TranslationKey, locale?: Locale): string {
  const l = locale || getStoredLocale();
  return translations[l]?.[key] || translations.en[key] || key;
}

export default translations;
