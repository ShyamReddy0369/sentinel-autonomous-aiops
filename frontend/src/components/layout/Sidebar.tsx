import {
  Activity,
  Brain,
  LayoutDashboard,
  Network,
  Settings,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: (page: string) => void;
  activePage?: string;
}

const menu = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    badge: "Live",
  },
  {
    icon: Activity,
    title: "Incidents",
  },
  {
    icon: Brain,
    title: "AI Brain",
    badge: "Gemini",
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
    <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-white/[0.06] bg-[#090d15] md:flex">
      <div>
        {/* Brand Header */}
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20">
            <Shield size={16} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-sm">
                SENTINEL
              </span>
              <span className="rounded bg-cyan-500/10 px-1 py-0.2 text-[9px] font-mono font-semibold text-cyan-400 border border-cyan-500/20">
                AI OPS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">
              autonomous commander
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Platform
          </p>

          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.title;

              return (
                <button
                  key={item.title}
                  onClick={() => onNavigate?.(item.title)}
                  className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-all duration-150 ${
                    active
                      ? "bg-white/[0.08] text-white shadow-sm"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-cyan-400" />
                  )}

                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={
                        active
                          ? "text-cyan-400"
                          : "text-slate-400 transition group-hover:text-slate-200"
                      }
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider ${
                        active
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "bg-white/[0.05] text-slate-400 group-hover:text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Sparkles size={12} className="text-cyan-400" />
              SRE Swarm Active
            </span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-emerald-400">
              5 Agents
            </span>
          </div>

          <div className="mt-2.5 space-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Cluster:</span>
              <span className="text-slate-300">us-east-prod</span>
            </div>
            <div className="flex justify-between">
              <span>Latency:</span>
              <span className="text-emerald-400 font-semibold">18ms</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 rounded bg-cyan-500/10 px-2 py-1 text-[10px] font-medium text-cyan-300 border border-cyan-500/20">
            <Zap size={11} className="text-cyan-400" />
            <span>Autonomous Safe Mode: ON</span>
          </div>
        </div>
      </div>
    </aside>
  );
}