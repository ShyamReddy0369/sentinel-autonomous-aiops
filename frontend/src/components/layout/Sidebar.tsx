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
    <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-cyan-500/20 bg-[#040814]/95 backdrop-blur-xl md:flex">
      <div>
        {/* Brand Header */}
        <div className="flex h-14 items-center gap-3 border-b border-cyan-500/20 px-5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_18px_rgba(0,240,255,0.4)] border border-cyan-300/40">
            <Shield size={16} className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-200 to-cyan-400 text-sm font-mono">
                SENTINEL
              </span>
              <span className="rounded bg-cyan-500/10 px-1 py-0.2 text-[9px] font-mono font-bold text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                AI OPS
              </span>
            </div>
            <p className="text-[10px] text-cyan-500/60 font-mono tracking-wider">
              DEFENSE GRID v2.4
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-500/60 font-semibold">
            CONTROL PLANE
          </p>

          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.title;

              return (
                <button
                  key={item.title}
                  onClick={() => onNavigate?.(item.title)}
                  className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-mono font-medium transition-all duration-200 ${
                    active
                      ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                      : "border border-transparent text-slate-400 hover:border-cyan-500/20 hover:bg-cyan-500/5 hover:text-cyan-200"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                  )}

                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={
                        active
                          ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
                          : "text-slate-400 transition group-hover:text-cyan-300"
                      }
                    />
                    <span className="tracking-wide">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                        active
                          ? "border border-cyan-400/40 bg-cyan-400/20 text-cyan-200 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                          : "border border-white/10 bg-white/5 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30"
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
      <div className="border-t border-cyan-500/20 p-3">
        <div className="rounded-lg border border-cyan-500/25 bg-linear-to-b from-cyan-950/20 to-black/60 p-3 shadow-[0_0_15px_rgba(0,240,255,0.08)]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-cyan-200 flex items-center gap-1.5 font-mono">
              <Sparkles size={12} className="text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
              SRE Swarm Mesh
            </span>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-400 shadow-[0_0_8px_rgba(0,255,157,0.2)]">
              5 Agents
            </span>
          </div>

          <div className="mt-2.5 space-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Cluster:</span>
              <span className="text-cyan-300 font-semibold">us-east-prod</span>
            </div>
            <div className="flex justify-between">
              <span>Latency:</span>
              <span className="text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(0,255,157,0.5)]">18ms</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-mono font-medium text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <Zap size={11} className="text-cyan-400 animate-pulse" />
            <span className="tracking-tight">AUTONOMOUS_SAFE: ON</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
