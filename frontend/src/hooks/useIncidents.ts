import { useEffect, useState } from "react";

import api from "../services/api";

export interface Incident {
  incident_id: string;
  service_name: string;
  severity: string;
  status: string;
  description: string;
  root_cause?: string | null;
  remediation?: string | null;
  created_at?: string;
}

export default function useIncidents() {
  const [incidents, setIncidents] =
    useState<Incident[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadIncidents() {
    try {
      const response =
        await api.get("/incidents");

      setIncidents(response.data);
    } catch (error) {
      console.error(
        "Failed to load incidents:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();

    const interval = setInterval(
      loadIncidents,
      3000
    );

    const refreshHandler = () => {
      loadIncidents();
    };

    window.addEventListener(
      "sentinel:refresh",
      refreshHandler
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "sentinel:refresh",
        refreshHandler
      );
    };
  }, []);

  return {
    incidents,
    loading,
  };
}