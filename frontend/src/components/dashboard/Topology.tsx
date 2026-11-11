import {
  Activity,
  Database,
  Globe,
  Server,
  Layers,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import useServiceStatus from "../../hooks/useServiceStatus";

interface ServiceNodeProps {
  name: string;
  category?: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  icon: React.ElementType;
}

function ServiceNode({
  name,
  category,
  status,
  icon: Icon,
}: ServiceNodeProps) {
  const statusStyles = {
    HEALTHY:
      "border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:border-emerald-500/50 hover:shadow-emerald-950/30",
    WARNING:
      "border-amber-500/40 bg-amber-950/20 text-amber-400 hover:border-amber-500/60 hover:shadow-amber-950/30 animate-pulse",
    CRITICAL:
      "border-rose-500/50 bg-rose-950/30 text-rose-400 hover:border-rose-500/70 hover:shadow-rose-950/40 animate-pulse ring-1 ring-rose-500/30",
  };

  const badgeStyles = {
    HEALTHY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    WARNING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    CRITICAL: "bg-rose-500/10 text-rose-300 border-rose-500/30 font-bold",
  };

  const StatusIcon =
    status === "CRITICAL"
      ? XCircle
      : status === "WARNING"
      ? AlertTriangle
      : ShieldCheck;

  return (
    <div
      className={`group relative flex flex-col items-center justify-between rounded-xl border p-4 shadow-lg transition-all duration-200 ${statusStyles[status]}`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
          <Icon size={18} />
        </div>
        <span
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${badgeStyles[status]}`}
        >
          <StatusIcon size={10} />
          {status}
        </span>
      </div>

      <div className="my-2 text-center">
        <h4 className="text-sm font-semibold text-white tracking-tight">
          {name}
        </h4>
        {category && (
          <p className="text-[11px] text-slate-400">{category}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "CRITICAL"
              ? "bg-rose-500 animate-ping"
              : status === "WARNING"
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
        />
        <span>
          {status === "CRITICAL"
            ? "Failover Pending"
            : status === "WARNING"
            ? "High Load"
            : "Active & Synced"}
        </span>
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
      services.find(
        (service) => service.service_name === serviceName
      )?.status ?? "HEALTHY"
    );
  };

  const getDatabaseStatus = (): "HEALTHY" | "WARNING" | "CRITICAL" => {
    const paymentStatus = getStatus("Payment");
    if (paymentStatus === "CRITICAL") return "CRITICAL";
    if (paymentStatus === "WARNING") return "WARNING";
    return "HEALTHY";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Infrastructure Mesh Topology
            </h2>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              Live Topology Graph
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time dependency health and autonomous routing mesh
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          <Layers size={14} />
          <span>3-Tier Mesh</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {/* Tier 1: Ingress Layer */}
        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          <ServiceNode
            name="Edge Gateway"
            category="Cloudflare Ingress"
            status="HEALTHY"
            icon={Globe}
          />
          <ServiceNode
            name="Load Balancer"
            category="Envoy Proxy Cluster"
            status="HEALTHY"
            icon={Activity}
          />
        </div>

        {/* Vector Connector */}
        <div className="flex items-center gap-1 text-slate-600">
          <div className="h-4 w-px bg-linear-to-b from-slate-600 to-slate-800" />
        </div>

        {/* Tier 2: Microservices Layer (Strictly 3 Core Services) */}
        <div className="grid w-full gap-3 sm:grid-cols-3">
          <ServiceNode
            name="Authentication"
            category="OAuth & Session API"
            status={getStatus("Authentication")}
            icon={Server}
          />

          <ServiceNode
            name="Payment"
            category="Stripe Gateway & Ledger"
            status={getStatus("Payment")}
            icon={Server}
          />

          <ServiceNode
            name="Inventory"
            category="Catalog & Stock Cache"
            status={getStatus("Inventory")}
            icon={Server}
          />
        </div>

        {/* Vector Connector */}
        <div className="flex items-center gap-1 text-slate-600">
          <div className="h-4 w-px bg-linear-to-b from-slate-600 to-slate-800" />
        </div>

        {/* Tier 3: Persistence Layer */}
        <div className="w-full max-w-sm">
          <ServiceNode
            name="Primary Oracle Database Cluster"
            category="Multi-AZ Sharded Cluster"
            status={getDatabaseStatus()}
            icon={Database}
          />
        </div>
      </div>
    </div>
  );
}
