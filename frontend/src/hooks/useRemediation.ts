import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export interface Remediation {
  incident_id?: string;
  service_name?: string;
  action: string;
  reason: string;
  risk: string;
  requires_approval: boolean;
  status: string;
}

export default function useRemediation() {
  const [remediation, setRemediation] =
    useState<Remediation | null>(null);

  const [executing, setExecuting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const loadRemediation = useCallback(async () => {
    try {
      const response = await api.get(
        "/remediation"
      );

      console.log(
        "REMIDIATION RESPONSE:",
        response.data
      );

      setRemediation(response.data);

    } catch (error) {
      console.error(
        "Failed to fetch remediation:",
        error
      );
    }
  }, []);

  useEffect(() => {
    loadRemediation();

    const interval = setInterval(
      loadRemediation,
      3000
    );

    const refreshHandler = () => {
      loadRemediation();
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
  }, [loadRemediation]);

  async function executeRemediation() {
    if (!remediation?.incident_id) {
      setMessage(
        "No active incident available."
      );
      return;
    }

    try {
      setExecuting(true);
      setMessage("");

      const response = await api.post(
        "/remediation/execute",
        {
          incident_id:
            remediation.incident_id,

          action:
            remediation.action,

          approved: true,
        }
      );

      setMessage(
        response.data.message ||
          "Remediation executed successfully."
      );

      window.dispatchEvent(
        new Event("sentinel:refresh")
      );

      await loadRemediation();

    } catch (error) {
      console.error(
        "Remediation execution failed:",
        error
      );

      setMessage(
        "Remediation execution failed."
      );
    } finally {
      setExecuting(false);
    }
  }

  async function rejectRemediation() {
    if (!remediation?.incident_id) {
      return;
    }

    try {
      await api.post(
        "/remediation/reject",
        {
          incident_id:
            remediation.incident_id,
        }
      );

      setMessage(
        "Remediation recommendation rejected."
      );

      window.dispatchEvent(
        new Event("sentinel:refresh")
      );

      await loadRemediation();

    } catch (error) {
      console.error(
        "Failed to reject remediation:",
        error
      );

      setMessage(
        "Failed to reject remediation."
      );
    }
  }

  return {
    remediation,
    executing,
    message,
    executeRemediation,
    rejectRemediation,
  };
}