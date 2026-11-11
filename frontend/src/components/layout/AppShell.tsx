import { useDashboard } from '../../hooks/useDashboard';
import { StatusCard } from '../ui/StatusCard';
import type { DashboardCard } from '../../types';

export const AppShell = () => {
  const summary = useDashboard();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_40%),linear-gradient(135deg,#020617,#0f172a)] px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/40">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-400">
            Sentinel Incident Commander
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{summary.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{summary.subtitle}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {summary.cards.map((card: DashboardCard) => (
            <StatusCard key={card.title} card={card} />
          ))}
        </section>
      </div>
    </main>
  );
};
