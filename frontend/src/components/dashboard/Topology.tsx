import {
  Activity,
  Database,
  Globe,
  Server,
  Layers,
} from "lucide-react";

import useServiceStatus from "../../hooks/useServiceStatus";

interface ServiceNodeProps {
  name: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  icon: React.ElementType;
}

function ServiceNode({
  name,
  status,
  icon: Icon,
}: ServiceNodeProps) {
  const statusStyles = {
    HEALTHY:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-emerald-950/20",
    WARNING:
      "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-amber-950/20",
    CRITICAL:
      "border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-rose-950/20 animate-pulse",
  };

  const badgeStyles = {
    HEALTHY: "bg-emerald-500/20 text-emerald-300",
    WARNING: "bg-amber-500/20 text-amber-300",
    CRITICAL: "bg-rose-500/20 text-rose-300",
  };

  return (
    <div
      className={`flex min-w-40 flex-col items-center gap-2 rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:scale-105 ${statusStyles[status]}`}
    >
      <Icon size={28} />

      <span className="font-semibold text-white">
        {name}
      </span>

      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${badgeStyles[status]}`}>
        {status}
      </span>
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
        (service) =>
          service.service_name === serviceName
      )?.status ?? "HEALTHY"
    );
  };

  const getDatabaseStatus = (): "HEALTHY" | "WARNING" | "CRITICAL" => {
    const paymentStatus = getStatus("Payment");
    const jobStatus = getStatus("Job Search API");
    if (paymentStatus === "CRITICAL" || jobStatus === "CRITICAL") return "CRITICAL";
    if (paymentStatus === "WARNING" || jobStatus === "WARNING") return "WARNING";
    return "HEALTHY";
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Infrastructure Topology
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Real-time microservice dependency & health graph
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          <Layers size={14} />
          <span>Autonomous Sync</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <ServiceNode
          name="Global Gateway"
          status="HEALTHY"
          icon={Globe}
        />

        <div className="h-6 w-0.5 bg-linear-to-b from-slate-600 to-slate-700" />

        <ServiceNode
          name="Load Balancer"
          status="HEALTHY"
          icon={Activity}
        />

        <div className="h-6 w-0.5 bg-linear-to-b from-slate-600 to-slate-700" />

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceNode
            name="Authentication"
            status={getStatus("Authentication")}
            icon={Server}
          />

          <ServiceNode
            name="Payment"
            status={getStatus("Payment")}
            icon={Server}
          />

          <ServiceNode
            name="Inventory"
            status={getStatus("Inventory")}
            icon={Server}
          />

          <ServiceNode
            name="Job Search API"
            status={getStatus("Job Search API")}
            icon={Server}
          />
        </div>

        <div className="h-6 w-0.5 bg-linear-to-b from-slate-600 to-slate-700" />

        <ServiceNode
          name="Oracle Database Cluster"
          status={getDatabaseStatus()}
          icon={Database}
        />
      </div>
    </div>
  );
}
