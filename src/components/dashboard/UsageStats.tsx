import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/use-locale";

interface ApiLog {
  endpoint: string;
  created_at: string;
}

interface UsageStatsProps {
  userId: string;
}

const UsageStats = ({ userId }: UsageStatsProps) => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useLocale();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("api_logs")
        .select("endpoint, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(500);
      setLogs((data as ApiLog[]) || []);
      setLoading(false);
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="glass-card rounded-sm p-6 text-center">
        <span className="text-muted-foreground font-mono text-xs animate-pulse">{t("loadingStats")}</span>
      </div>
    );
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const totalCalls = logs.length;
  const todayCalls = logs.filter((l) => new Date(l.created_at) >= today).length;
  const weekCalls = logs.filter((l) => new Date(l.created_at) >= weekAgo).length;

  const byEndpoint: Record<string, number> = {};
  logs.forEach((l) => {
    byEndpoint[l.endpoint] = (byEndpoint[l.endpoint] || 0) + 1;
  });

  const dateFmtLocale = locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : locale === "ko" ? "ko-KR" : locale === "es" ? "es-ES" : locale === "fr" ? "fr-FR" : "en-US";

  const dailyData: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 86400000);
    const nextDay = new Date(day.getTime() + 86400000);
    const count = logs.filter((l) => {
      const d = new Date(l.created_at);
      return d >= day && d < nextDay;
    }).length;
    dailyData.push({
      label: day.toLocaleDateString(dateFmtLocale, { weekday: "short" }),
      count,
    });
  }

  const maxDaily = Math.max(...dailyData.map((d) => d.count), 1);

  const endpointColors: Record<string, string> = {
    context: "bg-emerald-400",
    feed: "bg-sky-400",
    chat: "bg-amber-400",
    ingest: "bg-violet-400",
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("today"), value: todayCalls },
          { label: t("sevenDays"), value: weekCalls },
          { label: t("allTime"), value: totalCalls },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-sm p-4 text-center">
            <p className="font-display text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="font-mono text-[10px] text-muted-foreground/50 tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-sm p-4 space-y-3">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{t("last7Days")}</p>
        <div className="flex items-end gap-2 h-24">
          {dailyData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-mono text-[9px] text-muted-foreground/40">{d.count || ""}</span>
              <div
                className="w-full rounded-sm bg-foreground/20 transition-all"
                style={{ height: `${Math.max((d.count / maxDaily) * 100, d.count > 0 ? 4 : 0)}%` }}
              />
              <span className="font-mono text-[9px] text-muted-foreground/30">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-sm p-4 space-y-3">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{t("byEndpoint")}</p>
        <div className="space-y-2">
          {Object.entries(byEndpoint)
            .sort((a, b) => b[1] - a[1])
            .map(([ep, count]) => (
              <div key={ep} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${endpointColors[ep] || "bg-muted-foreground"}`} />
                <span className="font-mono text-xs text-foreground flex-1">{ep}</span>
                <span className="font-mono text-xs text-muted-foreground">{count}</span>
                <div className="w-20 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${endpointColors[ep] || "bg-muted-foreground"} opacity-60`}
                    style={{ width: `${(count / totalCalls) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          {Object.keys(byEndpoint).length === 0 && (
            <p className="font-mono text-xs text-muted-foreground/40">{t("noApiCalls")}</p>
          )}
        </div>
      </div>

      {logs.length > 0 && (
        <div className="glass-card rounded-sm p-4 space-y-3">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{t("recentCalls")}</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {logs.slice(0, 20).map((l, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${endpointColors[l.endpoint] || "bg-muted-foreground"}`} />
                  <span className="font-mono text-[11px] text-foreground">{l.endpoint}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/40">
                  {new Date(l.created_at).toLocaleString(dateFmtLocale, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageStats;
