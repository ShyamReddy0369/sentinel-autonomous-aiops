import {
  Activity,
  Database,
  Globe,
  Server,
  Layers,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ArrowDown,
} from "lucide-react";
import useServiceStatus from "../../hooks/useServiceStatus";

interface ServiceNodeProps {
  name: string;
  category: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  icon: React.ElementType;
  latency: string;
  throughput: string;
}

function ServiceNode({
  name,
  category,
  status,
  icon: Icon,
  latency,
  throughput,
}: ServiceNodeProps) {
  const isCritical = status === "CRITICAL";
  const isWarning = status === "WARNING";

  const statusBorder = isCritical
    ? "border-rose-500/60 bg-gradient-to-b from-rose-950/40 to-black/70 shadow-[0_0_20px_rgba(255,0,85,0.3)]"
    : isWarning
    ? "border-amber-500/50 bg-gradient-to-b from-amber-950/30 to-black/70 shadow-[0_0_15px_rgba(255,184,0,0.2)]"
    : "border-cyan-500/25 bg-gradient-to-b from-cyan-950/20 to-black/60 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]";

  const StatusIcon = isCritical
    ? XCircle
    : isWarning
    ? AlertTriangle
    : ShieldCheck;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-lg border p-3.5 backdrop-blur-md transition-all duration-300 ${statusBorder}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-md border ${
              isCritical
                ? "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(255,0,85,0.4)]"
                : isWarning
                ? "border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(255,184,0,0.4)]"
                : "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            }`}
          >
            <Icon size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-white tracking-tight">
              {name}
            </h4>
            <span className="font-mono text-[9px] text-cyan-400/70 font-semibold">
              {category}
            </span>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
            isCritical
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(255,0,85,0.3)] animate-pulse"
              : isWarning
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(255,184,0,0.3)]"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
          }`}
        >
          <StatusIcon size={9} />
          {status}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-cyan-500/20 pt-2 font-mono text-[10px]">
        <span className="text-slate-400">Latency: <strong className={isCritical ? "text-rose-400 font-bold drop-shadow-[0_0_6px_rgba(255,0,85,0.8)]" : "text-cyan-300 font-semibold"}>{latency}</strong></span>
        <span className="text-slate-400">RPS: <strong className="text-slate-200">{throughput}</strong></span>
      </div>
    </div>
  );
}

export default function Topology() {
  const services = useServiceStatus();

  const getStatus = (
    serviceName: string
  ): "HEALTHY" | "WARNING" | "CRITICAL" => {
    return (
      services.find((s) => s.service_name === serviceName)?.status ?? "HEALTHY"
    );
  };

  const getDatabaseStatus = (): "HEALTHY" | "WARNING" | "CRITICAL" => {
    const paymentStatus = getStatus("Payment");
    if (paymentStatus === "CRITICAL") return "CRITICAL";
    if (paymentStatus === "WARNING") return "WARNING";
    return "HEALTHY";
  };

  const authStatus = getStatus("Authentication");
  const paymentStatus = getStatus("Payment");
  const invStatus = getStatus("Inventory");
  const dbStatus = getDatabaseStatus();

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/25 bg-gradient-to-b from-[#060e22]/90 to-black/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Layers size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 font-mono">
                Mesh Topology
              </h3>
              <span className="rounded border border-cyan-500/40 bg-cyan-950/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                LIVE_NODES
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-500/70">
              Active microservice dependencies & upstream ingress mesh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400/80 font-semibold border border-cyan-500/20 bg-cyan-950/30 px-2 py-0.5 rounded">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00ff9d]" />
          <span>SYNC 1000MS</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        {/* Tier 1: Gateway & Envoy */}
        <div className="grid w-full grid-cols-2 gap-2.5">
          <div className="flex items-center justify-between rounded-lg border border-cyan-500/25 bg-black/50 p-2.5 text-xs shadow-[0_0_10px_rgba(0,240,255,0.05)]">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
              <div>
                <p className="font-bold font-mono text-white text-[11px]">Cloudflare Edge</p>
                <span className="font-mono text-[9px] text-cyan-500/70">Ingress Gateway</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(0,255,157,0.5)]">99.99%</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-cyan-500/25 bg-black/50 p-2.5 text-xs shadow-[0_0_10px_rgba(0,240,255,0.05)]">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
              <div>
                <p className="font-bold font-mono text-white text-[11px]">Envoy Load Balancer</p>
                <span className="font-mono text-[9px] text-purple-400/70">Round-Robin</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-cyan-300 font-bold">4.2k rps</span>
          </div>
        </div>

        <ArrowDown size={14} className="text-cyan-500/60 animate-pulse" />

        {/* Tier 2: Microservices Layer */}
        <div className="grid w-full gap-2.5 sm:grid-cols-3">
          <ServiceNode
            name="Authentication"
            category="OAuth2 & JWT"
            status={authStatus}
            icon={Server}
            latency={authStatus === "CRITICAL" ? "380ms" : "12ms"}
            throughput="1.8k"
          />

          <ServiceNode
            name="Payment"
            category="Stripe & Ledger"
            status={paymentStatus}
            icon={Server}
            latency={paymentStatus === "CRITICAL" ? "2,400ms" : "28ms"}
            throughput="650"
          />

          <ServiceNode
            name="Inventory"
            category="Redis Cache"
            status={invStatus}
            icon={Server}
            latency={invStatus === "CRITICAL" ? "190ms" : "6ms"}
            throughput="2.1k"
          />
        </div>

        <ArrowDown size={14} className="text-cyan-500/60 animate-pulse" />

        {/* Tier 3: Persistence Database */}
        <div className="w-full">
          <div
            className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
              dbStatus === "CRITICAL"
                ? "border-rose-500/60 bg-gradient-to-r from-rose-950/40 to-black/70 shadow-[0_0_20px_rgba(255,0,85,0.3)]"
                : "border-cyan-500/25 bg-black/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                  dbStatus === "CRITICAL"
                    ? "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(255,0,85,0.4)]"
                    : "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                }`}
              >
                <Database size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold font-mono text-white tracking-tight">
                  Relational Cluster (Multi-AZ)
                </h4>
                <p className="font-mono text-[9px] text-cyan-500/70">
                  Primary Sharded Relational Store • Connection pool size: 64
                </p>
              </div>
            </div>

            <span
              className={`font-mono text-[10px] font-bold uppercase rounded px-2.5 py-0.5 border ${
                dbStatus === "CRITICAL"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(255,0,85,0.3)] animate-pulse"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
              }`}
            >
              {dbStatus === "CRITICAL" ? "POOL SATURATED" : "HEALTHY"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
