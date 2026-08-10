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
    load();

    const timer = setInterval(load, 5000);

    return () => clearInterval(timer);
  }, []);

  async function load() {
    const response = await api.get("/diagnosis");
    setDiagnosis(response.data);
  }

  return diagnosis;
}