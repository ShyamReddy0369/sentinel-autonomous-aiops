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
    ? "border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-950/30"
    : isWarning
    ? "border-amber-500/50 bg-amber-950/20"
    : "border-white/[0.08] bg-black/40 hover:border-cyan-500/30";

  const StatusIcon = isCritical
    ? XCircle
    : isWarning
    ? AlertTriangle
    : ShieldCheck;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-lg border p-3 transition-all duration-200 ${statusBorder}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-md border ${
              isCritical
                ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                : isWarning
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-white/[0.08] bg-white/[0.03] text-cyan-400"
            }`}
          >
            <Icon size={14} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white tracking-tight">
              {name}
            </h4>
            <span className="font-mono text-[9px] text-slate-400">
              {category}
            </span>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
            isCritical
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
              : isWarning
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          <StatusIcon size={9} />
          {status}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.06] pt-2 font-mono text-[10px] text-slate-400">
        <span>Latency: <strong className={isCritical ? "text-rose-400" : "text-slate-300"}>{latency}</strong></span>
        <span>RPS: <strong className="text-slate-300">{throughput}</strong></span>
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
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Layers size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Infrastructure Mesh Topology
              </h3>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-cyan-300 border border-cyan-500/20">
                LIVE GRAPH
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Active microservice dependencies & upstream cluster routing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sync 1000ms</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        {/* Tier 1: Gateway & Envoy */}
        <div className="grid w-full grid-cols-2 gap-2.5">
          <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/30 p-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-cyan-400" />
              <div>
                <p className="font-semibold text-white text-[11px]">Cloudflare Edge</p>
                <span className="font-mono text-[9px] text-slate-400">Ingress Gateway</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold">99.99%</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/30 p-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-purple-400" />
              <div>
                <p className="font-semibold text-white text-[11px]">Envoy Load Balancer</p>
                <span className="font-mono text-[9px] text-slate-400">Round-Robin</span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold">4.2k rps</span>
          </div>
        </div>

        <ArrowDown size={14} className="text-slate-400" />

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

        <ArrowDown size={14} className="text-slate-400" />

        {/* Tier 3: Persistence Database */}
        <div className="w-full">
          <div
            className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
              dbStatus === "CRITICAL"
                ? "border-rose-500/50 bg-rose-950/20"
                : "border-white/[0.06] bg-black/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                  dbStatus === "CRITICAL"
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                    : "border-white/[0.08] bg-white/[0.03] text-indigo-400"
                }`}
              >
                <Database size={15} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-tight">
                  Oracle Database Cluster (Multi-AZ)
                </h4>
                <p className="font-mono text-[9px] text-slate-400">
                  Primary Sharded Relational Store • Pool size: 64
                </p>
              </div>
            </div>

            <span
              className={`font-mono text-[10px] font-bold uppercase rounded px-2 py-0.5 border ${
                dbStatus === "CRITICAL"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
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
