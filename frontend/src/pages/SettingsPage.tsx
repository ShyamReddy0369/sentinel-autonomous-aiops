import { useEffect, useState } from "react";

import {
  BrainCircuit,
  Gauge,
  Lock,
  Save,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";

import api from "../services/api";

interface Settings {
  ai_model: string;
  confidence_threshold: number;
  autonomous_remediation: boolean;
  human_approval: boolean;
  telemetry_interval: number;
  block_destructive_actions: boolean;
  medium_risk_approval: boolean;
  high_risk_approval: boolean;
}

const defaultSettings: Settings = {
  ai_model: "llama-3.1-8b-instant",
  confidence_threshold: 80,
  autonomous_remediation: true,
  human_approval: true,
  telemetry_interval: 2,
  block_destructive_actions: true,
  medium_risk_approval: true,
  high_risk_approval: true,
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response =
        await api.get("/settings");

      setSettings(response.data);
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );

      setMessage(
        "Could not load settings from backend."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setMessage("");

      const response =
        await api.put(
          "/settings",
          settings
        );

      setSettings(
        response.data.settings
      );

      setMessage(
        "Settings saved successfully."
      );

    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      setMessage(
        "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateBoolean(
    key:
      | "autonomous_remediation"
      | "human_approval"
      | "block_destructive_actions"
      | "medium_risk_approval"
      | "high_risk_approval",
    value: boolean
  ) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-slate-400">
          Loading Sentinel settings...
        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Header */}

      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Configure Sentinel AI operations and safety policies
          </p>

        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Settings"}

        </button>

      </div>

      {/* Status message */}

      {message && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-300">
          {message}
        </div>
      )}

      {/* AI Configuration */}

      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-cyan-500/10 p-3">
            <BrainCircuit
              size={24}
              className="text-cyan-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              AI Configuration
            </h2>

            <p className="text-sm text-slate-400">
              Configure the Sentinel AI decision engine
            </p>

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="text-sm text-slate-400">
              AI Model
            </label>

            <select
              value={settings.ai_model}
              onChange={(event) =>
                setSettings((previous) => ({
                  ...previous,
                  ai_model:
                    event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none"
            >

              <option value="llama-3.1-8b-instant">
                Llama 3.1 8B
              </option>

              <option value="llama-3.3-70b-versatile">
                Llama 3.3 70B
              </option>

            </select>

          </div>

          <div>

            <label className="text-sm text-slate-400">
              Confidence Threshold
            </label>

            <div className="mt-3 flex items-center gap-4">

              <input
                type="range"
                min="50"
                max="100"
                value={
                  settings.confidence_threshold
                }
                onChange={(event) =>
                  setSettings((previous) => ({
                    ...previous,
                    confidence_threshold:
                      Number(
                        event.target.value
                      ),
                  }))
                }
                className="w-full"
              />

              <span className="min-w-[45px] text-right font-bold text-cyan-400">
                {settings.confidence_threshold}%
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* Remediation */}

      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-green-500/10 p-3">
            <Zap
              size={24}
              className="text-green-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Remediation
            </h2>

            <p className="text-sm text-slate-400">
              Control autonomous incident response
            </p>

          </div>

        </div>

        <div className="space-y-5">

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-900 p-4">

            <div>

              <p className="font-semibold text-white">
                Autonomous Remediation
              </p>

              <p className="text-sm text-slate-400">
                Allow Sentinel to execute low-risk remediations automatically
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                settings.autonomous_remediation
              }
              onChange={(event) =>
                updateBoolean(
                  "autonomous_remediation",
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-cyan-500"
            />

          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-900 p-4">

            <div>

              <p className="font-semibold text-white">
                Human Approval
              </p>

              <p className="text-sm text-slate-400">
                Require human approval for protected actions
              </p>

            </div>

            <input
              type="checkbox"
              checked={
                settings.human_approval
              }
              onChange={(event) =>
                updateBoolean(
                  "human_approval",
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-cyan-500"
            />

          </label>

        </div>

      </section>

      {/* Safety */}

      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-yellow-500/10 p-3">
            <ShieldCheck
              size={24}
              className="text-yellow-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Safety Policy
            </h2>

            <p className="text-sm text-slate-400">
              Protect infrastructure from unsafe actions
            </p>

          </div>

        </div>

        <div className="space-y-4">

          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4">

            <div className="flex items-center gap-3">

              <Lock
                size={20}
                className="text-slate-400"
              />

              <div>

                <p className="font-semibold text-white">
                  Destructive Actions
                </p>

                <p className="text-sm text-slate-400">
                  Block destructive infrastructure operations
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={
                settings.block_destructive_actions
              }
              onChange={(event) =>
                updateBoolean(
                  "block_destructive_actions",
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-cyan-500"
            />

          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4">

            <div className="flex items-center gap-3">

              <UserCheck
                size={20}
                className="text-slate-400"
              />

              <div>

                <p className="font-semibold text-white">
                  Medium Risk Approval
                </p>

                <p className="text-sm text-slate-400">
                  Require human approval for medium-risk actions
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={
                settings.medium_risk_approval
              }
              onChange={(event) =>
                updateBoolean(
                  "medium_risk_approval",
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-cyan-500"
            />

          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4">

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={20}
                className="text-slate-400"
              />

              <div>

                <p className="font-semibold text-white">
                  High Risk Approval
                </p>

                <p className="text-sm text-slate-400">
                  Require human approval for high-risk actions
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={
                settings.high_risk_approval
              }
              onChange={(event) =>
                updateBoolean(
                  "high_risk_approval",
                  event.target.checked
                )
              }
              className="h-5 w-5 accent-cyan-500"
            />

          </div>

        </div>

      </section>

      {/* Telemetry */}

      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-blue-500/10 p-3">
            <Gauge
              size={24}
              className="text-blue-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Telemetry
            </h2>

            <p className="text-sm text-slate-400">
              Infrastructure monitoring configuration
            </p>

          </div>

        </div>

        <div className="max-w-md">

          <label className="text-sm text-slate-400">
            Polling Interval
          </label>

          <select
            value={
              settings.telemetry_interval
            }
            onChange={(event) =>
              setSettings((previous) => ({
                ...previous,
                telemetry_interval:
                  Number(
                    event.target.value
                  ),
              }))
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none"
          >

            <option value="1">
              1 second
            </option>

            <option value="2">
              2 seconds
            </option>

            <option value="5">
              5 seconds
            </option>

            <option value="10">
              10 seconds
            </option>

          </select>

        </div>

      </section>

    </div>
  );
}