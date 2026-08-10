import { useEffect, useState } from "react";
import api from "../services/api";

export interface IncidentHistoryItem {
  incident_id: string;
  service_name: string;
  severity: string;
  status: string;
  description: string;
  created_at?: string;
}

export default function useIncidentHistory() {
  const [incidents, setIncidents] = useState<
    IncidentHistoryItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      const response = await api.get("/incidents");

      setIncidents(response.data);
    } catch (error) {
      console.error(
        "Failed to load incident history:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();

    const interval = setInterval(
      loadHistory,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  return {
    incidents,
    loading,
    reload: loadHistory,
  };
}