import {
  BrainCircuit,
  Gauge,
  Lock,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Configure Sentinel AI operations and safety policies
        </p>
      </div>

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
              defaultValue="llama-3.1-8b"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white outline-none"
            >
              <option value="llama-3.1-8b">
                Llama 3.1 8B
              </option>

              <option value="llama-3.3-70b">
                Llama 3.3 70B
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Confidence Threshold
            </label>

            <div className="mt-2 flex items-center gap-4">

              <input
                type="range"
                min="50"
                max="100"
                defaultValue="80"
                className="w-full"
              />

              <span className="font-semibold text-cyan-400">
                80%
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
              defaultChecked
              className="h-5 w-5 accent-cyan-500"
            />

          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-900 p-4">

            <div>
              <p className="font-semibold text-white">
                Human Approval
              </p>

              <p className="text-sm text-slate-400">
                Require human approval for medium and high-risk actions
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
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

            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              BLOCKED
            </span>

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
                  Human approval required
                </p>
              </div>

            </div>

            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
              REQUIRED
            </span>

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
            defaultValue="2"
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