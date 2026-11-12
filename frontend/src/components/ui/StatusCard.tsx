import type { DashboardCard } from '../../types';

interface StatusCardProps {
  card: DashboardCard;
}

export const StatusCard = ({ card }: StatusCardProps) => (
  <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
    <div className={`h-2 w-20 rounded-full bg-linear-to-r ${card.accent}`} />
    <h2 className="mt-4 text-lg font-semibold text-white">{card.title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-400">{card.description}</p>
  </article>
);
