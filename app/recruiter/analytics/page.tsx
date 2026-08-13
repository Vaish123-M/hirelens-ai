import { BarChart3, TrendingUp } from "lucide-react";
import { MetricCard, PageShell, analyticsCards, fakeStats } from "@/components/hirelens";

export default function AnalyticsPage() {
  return (
    <PageShell
      role="recruiter"
      title="Analytics"
      subtitle="Measure hiring throughput, talent quality, and impact across the funnel."
      rightAction={<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><TrendingUp className="h-4 w-4 text-emerald-500" /> +12.3% mo. over mo.</div>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {fakeStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Performance</div>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Hiring velocity</h2>
            </div>
            <BarChart3 className="h-5 w-5 text-sky-500" />
          </div>
          <div className="flex h-56 items-end gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/50">
            {[40, 58, 66, 72, 94, 88, 100].map((height, index) => (
              <div key={height} className="flex-1 rounded-t-2xl bg-gradient-to-t from-sky-500 via-blue-500 to-violet-500" style={{ height: `${height}%`, opacity: 0.7 + index * 0.05 }} />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </div>

        <div className="space-y-5">
          {analyticsCards.map((card) => (
            <div key={card.label} className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{card.label}</div>
              <div className="mt-2 flex items-end justify-between">
                <div className="text-3xl font-semibold text-slate-900 dark:text-white">{card.value}</div>
                <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{card.delta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
