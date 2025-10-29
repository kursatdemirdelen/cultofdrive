"use client"

import { useEffect, useMemo, useState } from "react"

type Resource = "cars" | "social-posts"

type StatusResponse = {
  fallbackEnabled: boolean
  local: {
    cars: number
    socialPosts: number
  }
  timestamp: string
}

type SyncResult = {
  message: string
  synced?: number
  upserted?: number
  inserted?: number
}

const RESOURCE_LABELS: Record<Resource, string> = {
  cars: "Cars",
  "social-posts": "Social Posts",
}

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("")
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [syncing, setSyncing] = useState<Resource | null>(null)
  const [loadingResource, setLoadingResource] = useState<Resource | null>(null)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const [error, setError] = useState<string>("")
  const [localData, setLocalData] = useState<Record<Resource, any[]>>({ cars: [], "social-posts": [] })

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem("cod-admin-key")
    if (stored) {
      setAdminKey(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (adminKey) {
      window.localStorage.setItem("cod-admin-key", adminKey)
    } else {
      window.localStorage.removeItem("cod-admin-key")
    }
  }, [adminKey])

  const fallbackStatus = useMemo(() => {
    if (!status) return "Unknown"
    return status.fallbackEnabled ? "Enabled" : "Disabled"
  }, [status])

  const handleFetchStatus = async () => {
    setError("")
    try {
      const res = await fetch("/api/admin/status", {
        headers: { "x-admin-key": adminKey },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Status request failed")
      }
      const data: StatusResponse = await res.json()
      setStatus(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch status")
    }
  }

  const handleLoadLocal = async (resource: Resource) => {
    setError("")
    setLoadingResource(resource)
    try {
      const res = await fetch(`/api/admin/local-data?resource=${resource}`, {
        headers: { "x-admin-key": adminKey },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Failed to load local data")
      }
      const json = await res.json()
      const items = json.cars || json.posts || []
      setLocalData((prev) => ({ ...prev, [resource]: items }))
    } catch (err: any) {
      setError(err.message || "Failed to load local data")
    } finally {
      setLoadingResource(null)
    }
  }

  const handleSync = async (resource: Resource) => {
    setError("")
    setSyncResult(null)
    setSyncing(resource)
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ resource }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(body.error || "Sync failed")
      }
      setSyncResult(body)
      await handleFetchStatus()
    } catch (err: any) {
      setError(err.message || "Sync failed")
    } finally {
      setSyncing(null)
    }
  }

  const disabled = !adminKey

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Admin Control Center</h1>
          <p className="text-white/60">
            Use this panel to monitor fallback mode, sync JSON with Supabase, and preview local data snapshots.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-xl font-medium mb-4">Authentication</h2>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-white/60">Admin Key</span>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a0ff]"
                placeholder="Enter admin key"
              />
            </label>
            <button
              onClick={handleFetchStatus}
              disabled={disabled}
              className="rounded-md bg-[#0055ff] px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-white/20"
            >
              Refresh Status
            </button>
          </div>
          <div className="mt-4 text-sm text-white/70">
            <p>
              Fallback mode: <span className="font-medium text-white">{fallbackStatus}</span>
            </p>
            {status && (
              <p className="mt-1">
                Local data: {status.local.cars} cars, {status.local.socialPosts} social posts
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {(['cars', 'social-posts'] as Resource[]).map((resource) => {
            const items = localData[resource] || []
            const preview = items.slice(0, 3)
            const isLoading = loadingResource === resource
            const isSyncing = syncing === resource
            return (
              <div key={resource} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <header className="mb-4 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-medium">{RESOURCE_LABELS[resource]}</h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Local JSON</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadLocal(resource)}
                      disabled={disabled || isLoading}
                      className="rounded-md border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isLoading ? "Loading..." : "Preview"}
                    </button>
                    <button
                      onClick={() => handleSync(resource)}
                      disabled={disabled || isSyncing}
                      className="rounded-md bg-[#00a0ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSyncing ? "Syncing..." : "Push to Supabase"}
                    </button>
                  </div>
                </header>
                <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-xs text-white/70 max-h-48 overflow-auto">
                  {preview.length === 0 ? (
                    <p className="text-white/40">No data loaded yet.</p>
                  ) : (
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(preview, null, 2)}
                    </pre>
                  )}
                </div>
                {items.length > preview.length && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/30">
                    Total {items.length} records
                  </p>
                )}
              </div>
            )
          })}
        </section>

        {(error || syncResult) && (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-medium mb-3">Operation Log</h2>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {syncResult && (
              <div className="text-sm text-white/70">
                <p className="font-medium text-white">{syncResult.message}</p>
                <div className="mt-2 grid grid-cols-3 gap-3 text-xs uppercase tracking-[0.2em] text-white/40">
                  {syncResult.synced !== undefined && <span>Total: {syncResult.synced}</span>}
                  {syncResult.upserted !== undefined && <span>Updated: {syncResult.upserted}</span>}
                  {syncResult.inserted !== undefined && <span>Inserted: {syncResult.inserted}</span>}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

