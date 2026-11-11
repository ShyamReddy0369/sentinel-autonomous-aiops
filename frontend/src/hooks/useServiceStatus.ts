import { useEffect, useState } from "react";
import api from "../services/api";

export interface ServiceStatus {
  service_name: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
}

const initialServices: ServiceStatus[] = [
  { service_name: "Authentication", status: "HEALTHY" },
  { service_name: "Payment", status: "HEALTHY" },
  { service_name: "Inventory", status: "HEALTHY" },
];

export default function useServiceStatus() {
  const [services, setServices] = useState<ServiceStatus[]>(initialServices);

  useEffect(() => {
    let active = true;

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

        if (active) {
          setServices(updated);
        }
      } catch (error) {
        console.error("Failed to fetch service status:", error);
      }
    }

    void loadServices();

    const timer = setInterval(() => {
      void loadServices();
    }, 3000);

    const refreshHandler = () => {
      void loadServices();
    };

    window.addEventListener("sentinel:refresh", refreshHandler);

    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("sentinel:refresh", refreshHandler);
    };
  }, []);

  return services;
}
