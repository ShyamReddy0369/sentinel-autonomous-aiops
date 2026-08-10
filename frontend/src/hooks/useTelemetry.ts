import { useCallback, useEffect, useState } from "react";

import api from "../services/api";

export interface TelemetryPoint {
  time: string;
  cpu: number;
  memory: number;
}

interface TelemetryResponse {
  cpu?: number;
  memory?: number;
  time?: string;
  data?: TelemetryPoint[];
}

export default function useTelemetry() {
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTelemetry = useCallback(async () => {
    try {
      const response = await api.get<TelemetryResponse | TelemetryPoint[]>(
        "/telemetry"
      );

      const result = response.data;

      console.log("LIVE TELEMETRY:", result);

      // Backend returns one live telemetry object
      if (
        !Array.isArray(result) &&
        typeof result.cpu === "number"
      ) {
        const point: TelemetryPoint = {
          time:
            result.time ||
            new Date().toLocaleTimeString(),

          cpu: result.cpu,

          memory:
            typeof result.memory === "number"
              ? result.memory
              : 0,
        };

        setData((previous) => {
          const updated = [...previous, point];

          return updated.slice(-30);
        });

        return;
      }

      // Backend returns an array directly
      if (Array.isArray(result)) {
        const validPoints: TelemetryPoint[] =
          result.filter(
            (item: TelemetryPoint) =>
              item &&
              typeof item.cpu === "number"
          );

        setData(validPoints.slice(-30));

        return;
      }

      // Backend returns { data: [...] }
      if (
        !Array.isArray(result) &&
        Array.isArray(result.data)
      ) {
        const validPoints: TelemetryPoint[] =
          result.data.filter(
            (item: TelemetryPoint) =>
              item &&
              typeof item.cpu === "number"
          );

        setData(validPoints.slice(-30));

        return;
      }

    } catch (error) {
      console.error(
        "Telemetry request failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTelemetry();

    const interval = setInterval(
      loadTelemetry,
      2000
    );

    const refreshHandler = () => {
      loadTelemetry();
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
  }, [loadTelemetry]);

  return {
    data,
    loading,
  };
}