import { useEffect, useState } from "react";
import api from "../services/api";

export interface AuditEvent {
  timestamp: string;
  event_type: string;
  incident_id: string | null;
  service_name: string | null;
  action: string | null;
  details: string | null;
  actor: string;
}

export default function useAudit() {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    async function loadAudit() {
      try {
        const response = await api.get("/audit");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      }
    }

    loadAudit();

    const interval = setInterval(loadAudit, 3000);

    return () => clearInterval(interval);
  }, []);

  return events;
}