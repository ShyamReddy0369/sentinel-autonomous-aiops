import { useDashboard } from '../../hooks/useDashboard';
import { StatusCard } from '../ui/StatusCard';
import type { DashboardCard } from '../../types';

export const AppShell = () => {
  const summary = useDashboard();

  return (
    <main className="min-h-screen cyber-grid px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-[#060e22]/90 to-black/80 p-8 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-xl">
          <p className="text-xs font-mono font-bold uppercase tracking-[0.35em] text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]">
            SENTINEL INCIDENT COMMANDER
          </p>
          <h1 className="mt-3 text-4xl font-black font-mono tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
            {summary.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base font-mono text-cyan-500/70">{summary.subtitle}</p>
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
