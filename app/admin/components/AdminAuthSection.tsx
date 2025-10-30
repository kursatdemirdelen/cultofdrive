import { Key } from "lucide-react";

type Props = {
  adminKey: string;
  setAdminKey: (key: string) => void;
  loading: boolean;
  connected: boolean;
  onConnect: () => void;
};

export function AdminAuthSection({ adminKey, setAdminKey, loading, connected, onConnect }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="admin-key" className="mb-2 block text-sm font-medium text-white/80">
            <Key className="mb-1 inline h-4 w-4" /> Admin Key
          </label>
          <input
            id="admin-key"
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            disabled={connected}
          />
        </div>
        <button
          onClick={onConnect}
          disabled={loading || !adminKey || connected}
          className="rounded-lg bg-white/10 px-6 py-2.5 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Connecting..." : connected ? "Connected" : "Connect"}
        </button>
      </div>
    </div>
  );
}
