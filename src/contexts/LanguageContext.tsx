import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Lang = "en" | "zh";

const translations = {
  en: {
    // Nav
    signIn: "Sign In",
    getStarted: "Get Started",
    exit: "EXIT",

    // Index hero
    tagline: "API Gateway · Memory Vault",
    heroTitle1: "Context",
    heroTitle2: "Endpoint",
    heroDesc: "Distill raw thought into razor-sharp maxims. Your personal AI memory vault for the relentless.",
    heroCta: "INITIALIZE →",
    copyright: "© 2026 CONTEXTof.me",
    version: "v1.0.0",

    // Auth
    authenticate: "AUTHENTICATE",
    createEndpoint: "CREATE ENDPOINT",
    emailPlaceholder: "email@domain.com",
    signInBtn: "SIGN IN →",
    createAccountBtn: "CREATE ACCOUNT →",
    needEndpoint: "Need an endpoint? Create one.",
    alreadyInit: "Already initialized? Sign in.",
    checkEmail: "Check your email",
    checkEmailDesc: "We sent you a verification link.",

    // Dashboard
    yourApiToken: "Your API Token",
    apiTokenDesc: "Use this Bearer token with the /ingest endpoint",
    endpoint: "ENDPOINT",
    example: "EXAMPLE",
    integrations: "Integrations",
    downloadSkill: "Download OpenClaw Sync Skill (.zip)",
    comingSoon: "Coming soon",
    comingSoonDesc: "OpenClaw Sync Skill will be available shortly.",
    memoryVault: "Memory Vault",
    noSlices: "No slices yet. Send your first thought via the API.",
    rawInput: "Raw input",
    copied: "Copied",
    copiedDesc: "API token copied to clipboard.",

    // Public Profile
    resolvingEndpoint: "Resolving endpoint...",
    endpointNotFound: "Endpoint not found",
    socialFirewall: "Social Firewall",
    firewallPlaceholder: "Access denied. Prove your context.",
    noTransmissions: "No transmissions yet.",

    // Common
    error: "Error",
    loading: "Loading...",
    lang: "中文",
  },
  zh: {
    signIn: "登录",
    getStarted: "开始使用",
    exit: "退出",

    tagline: "API 网关 · 记忆仓库",
    heroTitle1: "Context",
    heroTitle2: "终端",
    heroDesc: "将原始思维提炼为精准箴言。专为无畏开拓者打造的 AI 记忆仓库。",
    heroCta: "启动 →",
    copyright: "© 2026 CONTEXTof.me",
    version: "v1.0.0",

    authenticate: "身份验证",
    createEndpoint: "创建终端",
    emailPlaceholder: "email@domain.com",
    signInBtn: "登录 →",
    createAccountBtn: "创建账户 →",
    needEndpoint: "需要一个终端？立即创建。",
    alreadyInit: "已有账户？直接登录。",
    checkEmail: "检查邮箱",
    checkEmailDesc: "我们已发送验证链接。",

    yourApiToken: "你的 API 令牌",
    apiTokenDesc: "使用此 Bearer 令牌调用 /ingest 端点",
    endpoint: "端点",
    example: "示例",
    integrations: "集成",
    downloadSkill: "下载 OpenClaw 同步技能 (.zip)",
    comingSoon: "即将推出",
    comingSoonDesc: "OpenClaw 同步技能即将上线。",
    memoryVault: "记忆仓库",
    noSlices: "暂无记录。通过 API 发送你的第一条想法。",
    rawInput: "原始输入",
    copied: "已复制",
    copiedDesc: "API 令牌已复制到剪贴板。",

    resolvingEndpoint: "正在解析终端...",
    endpointNotFound: "终端未找到",
    socialFirewall: "社交防火墙",
    firewallPlaceholder: "访问被拒绝。证明你的价值。",
    noTransmissions: "暂无传输记录。",

    error: "错误",
    loading: "加载中...",
    lang: "EN",
  },
} as const;

type Translations = typeof translations.en;

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang");
    return (saved === "zh" ? "zh" : "en") as Lang;
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "zh" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
