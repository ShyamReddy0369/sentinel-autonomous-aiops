import { useEffect, useState } from "react";
import api from "../services/api";

export interface ServiceStatus {
  service_name: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
}

export default function useServiceStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      service_name: "Authentication",
      status: "HEALTHY",
    },
    {
      service_name: "Payment",
      status: "HEALTHY",
    },
    {
      service_name: "Inventory",
      status: "HEALTHY",
    },
  ]);

  useEffect(() => {
    loadServices();

    const timer = setInterval(loadServices, 5000);

    return () => clearInterval(timer);
  }, []);

  async function loadServices() {
    try {
      const response = await api.get("/incidents");

      const serviceNames = [
        "Authentication",
        "Payment",
        "Inventory",
      ];

      const updated = serviceNames.map((serviceName) => {
        const incident = response.data.find(
          (item: {
            service_name: string;
            severity: string;
            status: string;
          }) =>
            item.service_name === serviceName &&
            item.status === "OPEN"
        );

        if (!incident) {
          return {
            service_name: serviceName,
            status: "HEALTHY" as const,
          };
        }

        if (incident.severity === "CRITICAL") {
          return {
            service_name: serviceName,
            status: "CRITICAL" as const,
          };
        }

        return {
          service_name: serviceName,
          status: "WARNING" as const,
        };
      });

      setServices(updated);
    } catch (error) {
      console.error("Failed to fetch service status:", error);
    }
  }

  return services;
}