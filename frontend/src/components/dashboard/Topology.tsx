import {
  Activity,
  Database,
  Globe,
  Server,
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
      "border-green-500/40 bg-green-500/10 text-green-400",

    WARNING:
      "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",

    CRITICAL:
      "border-red-500/40 bg-red-500/10 text-red-400",
  };

  return (
    <div
      className={`flex min-w-40 flex-col items-center gap-2 rounded-2xl border p-5 ${statusStyles[status]}`}
    >
      <Icon size={28} />

      <span className="font-semibold text-white">
        {name}
      </span>

      <span className="text-xs font-bold">
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

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Infrastructure Topology
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Live service dependency map
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">

        <ServiceNode
          name="Internet"
          status="HEALTHY"
          icon={Globe}
        />

        <div className="h-8 w-px bg-slate-700" />

        <ServiceNode
          name="Load Balancer"
          status="HEALTHY"
          icon={Activity}
        />

        <div className="h-8 w-px bg-slate-700" />

        <div className="grid w-full gap-6 md:grid-cols-3">

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

        </div>

        <div className="h-8 w-px bg-slate-700" />

        <ServiceNode
          name="Database"
          status="HEALTHY"
          icon={Database}
        />

      </div>
    </div>
  );
}