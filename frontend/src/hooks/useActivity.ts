import { useEffect, useState } from "react";
import api from "../services/api";

export interface ActivityEvent {
  timestamp: string;
  event_type: string;
  incident_id: string | null;
  service_name: string | null;
  action: string | null;
  details: string | null;
  actor: string;
}

export default function useActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  async function loadActivity() {
    try {
      const response = await api.get("/audit");

      setEvents(response.data.slice(0, 15));
    } catch (error) {
      console.error(
        "Failed to load activity:",
        error
      );
    }
  }

  useEffect(() => {
    loadActivity();

    const interval = setInterval(
      loadActivity,
      2000
    );

    return () => clearInterval(interval);
  }, []);

  return events;
}