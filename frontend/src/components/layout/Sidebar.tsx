import {
  Activity,
  Brain,
  LayoutDashboard,
  Network,
  Settings,
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
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-[#0b1120] md:block">

      <div className="border-b border-slate-800 p-6">

        <h1 className="text-2xl font-bold text-white">
          Sentinel
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Mission Control
        </p>

      </div>

      <nav className="p-4">

        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            activePage === item.title;

          return (
            <button
              key={item.title}
              onClick={() =>
                onNavigate?.(item.title)
              }
              className={`mb-2 flex w-full items-center gap-4 rounded-xl p-4 text-left transition ${
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >

              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>

            </button>
          );
        })}

      </nav>

    </aside>
  );
}