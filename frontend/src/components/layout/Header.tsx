import { ShieldCheck, Flame, Radio, RefreshCw } from "lucide-react";
import { useState } from "react";
import api from "../../services/api";

export default function Header() {
  const [injecting, setInjecting] = useState(false);

  async function triggerQuickChaos() {
    try {
      setInjecting(true);
      await api.post("/simulation/failure", {
        service_name: "Payment",
      });
      window.dispatchEvent(new Event("sentinel:refresh"));
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setInjecting(false), 800);
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#090d15]/80 px-6 backdrop-blur-md">
      {/* Breadcrumb path */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-mono text-slate-400">sentinel</span>
        <span className="text-slate-400">/</span>
        <span className="font-mono text-slate-400">prod-us-east-1</span>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-white">mission-control</span>
      </div>

      {/* Global Status & Quick Trigger */}
      <div className="flex items-center gap-3">
        {/* Quick chaos injection action */}
        <button
          onClick={triggerQuickChaos}
          disabled={injecting}
          className="group flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 active:scale-95 disabled:opacity-50"
          title="Quick fault injection for demo"
        >
          {injecting ? (
            <RefreshCw size={12} className="animate-spin text-rose-400" />
          ) : (
            <Flame size={12} className="text-rose-400 group-hover:scale-110 transition-transform" />
          )}
          <span className="font-mono text-[11px]">
            {injecting ? "Injecting..." : "Simulate Outage"}
          </span>
        </button>

        <div className="h-4 w-px bg-white/[0.08]" />

        {/* Global Cluster Status Pill */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
          <Radio size={12} className="animate-pulse" />
          <span>99.98% HEALTHY</span>
        </div>

        {/* SRE Guardian Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300">
          <ShieldCheck size={13} className="text-cyan-400" />
          <span className="font-mono text-[10px] text-slate-400">AUTONOMOUS</span>
        </div>
      </div>
    </header>
  );
}