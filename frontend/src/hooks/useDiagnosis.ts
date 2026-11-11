import { useEffect, useState } from "react";
import api from "../services/api";

export interface Diagnosis {
  root_cause: string;
  confidence: number;
  recommendation: string;
}

export default function useDiagnosis() {
  const [diagnosis, setDiagnosis] = useState<Diagnosis>({
    root_cause: "",
    confidence: 0,
    recommendation: "",
  });

  useEffect(() => {
    let active = true;

    async function fetchDiagnosis() {
      try {
        const response = await api.get("/diagnosis");
        if (active) {
          setDiagnosis(response.data);
        }
      } catch (error) {
        console.error("Failed to load diagnosis:", error);
      }
    }

    void fetchDiagnosis();

    const timer = setInterval(() => {
      void fetchDiagnosis();
    }, 3000);

    const refreshHandler = () => {
      void fetchDiagnosis();
    };

    window.addEventListener("sentinel:refresh", refreshHandler);

    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("sentinel:refresh", refreshHandler);
    };
  }, []);

  return diagnosis;
}
