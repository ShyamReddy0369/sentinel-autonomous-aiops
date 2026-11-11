import {
  Activity,
  Brain,
  LayoutDashboard,
  Network,
  Settings,
  Shield,
  Zap,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: (page: string) => void;
  activePage?: string;
}

const menu = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    icon: Activity,
    title: "Incidents",
  },
  {
    icon: Brain,
    title: "AI Brain",
  },
  {
    icon: Network,
    title: "Topology",
  },
  {
    icon: Settings,
    title: "Settings",
  },
];

export default function Sidebar({
  onNavigate,
  activePage,
}: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-800/80 bg-slate-950/90 md:flex">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-indigo-600 shadow-md shadow-cyan-950/50">
            <Shield size={20} className="text-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">
                SENTINEL
              </span>
              <span className="rounded bg-cyan-500/20 px-1 py-0.2 text-[9px] font-bold text-cyan-300">
                OPS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous AI Commander
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.title;

            return (
              <button
                key={item.title}
                onClick={() => onNavigate?.(item.title)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-medium transition-all duration-150 ${
                  active
                    ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-sm shadow-cyan-950/20"
                    : "text-slate-400 hover:border-transparent hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={
                      active
                        ? "text-cyan-400"
                        : "text-slate-500 transition group-hover:text-slate-300"
                    }
                  />
                  <span>{item.title}</span>
                </div>

                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="border-t border-slate-800/80 p-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">Target Microservices</span>
            <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">3 Node</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            Auth, Payment, Inventory
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-emerald-400 font-medium text-[10px]">
            <Zap size={11} />
            <span>Chaos Engine Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}