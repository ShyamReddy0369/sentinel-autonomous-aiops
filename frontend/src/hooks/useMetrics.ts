import { useEffect, useState } from "react";

import api from "../services/api";

export interface Metrics {
  cpu: number;
  memory: number;
  agents: number;
  incidents: number;
}

export default function useMetrics() {
  const [metrics, setMetrics] =
    useState<Metrics | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadMetrics() {
    try {
      const response =
        await api.get("/metrics");

      setMetrics(response.data);
    } catch (error) {
      console.error(
        "Metrics request failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();

    const interval = setInterval(
      loadMetrics,
      3000
    );

    const refreshHandler = () => {
      loadMetrics();
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
    metrics,
    loading,
  };
}