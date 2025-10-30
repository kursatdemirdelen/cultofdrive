"use client";

import { useState, useEffect } from "react";
import { Flag, Check, X, Eye, EyeOff } from "lucide-react";

type Report = {
  id: string;
  content_type: string;
  content_id: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
};

type Props = {
  adminKey: string;
};

export function ModerationPanel({ adminKey }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (!adminKey) return;

    const fetchReports = async () => {
      try {
        const res = await fetch("/api/admin/reports", {
          headers: { "x-admin-key": adminKey },
        });
        const data = await res.json();
        setReports(data.reports || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [adminKey]);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status === 'resolved');
  const displayReports = showResolved ? resolvedReports : pendingReports;

  const handleResolve = async (id: string) => {
    try {
      await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status: "resolved" }),
      });

      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to resolve report:", error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <h2 className="mb-4 text-xl font-semibold text-white">Moderation Queue</h2>
        <p className="text-white/60">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Moderation Queue</h2>
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-400">
            {pendingReports.length} pending
          </span>
        </div>
        <button
          onClick={() => setShowResolved(!showResolved)}
          className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          {showResolved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showResolved ? 'Show Pending' : 'Show Resolved'}
        </button>
      </div>

      {displayReports.length === 0 ? (
        <p className="text-center text-white/60">
          {showResolved ? 'No resolved reports' : 'No pending reports'}
        </p>
      ) : (
        <div className="space-y-3">
          {displayReports.map((report) => (
            <div
              key={report.id}
              className="rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Flag className={`h-4 w-4 ${report.status === 'resolved' ? 'text-green-400' : 'text-red-400'}`} />
                  <span className="text-sm font-medium text-white">
                    {report.content_type} Report
                  </span>
                  {report.status === 'resolved' && (
                    <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                      Resolved
                    </span>
                  )}
                </div>
                <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
                  {report.reason}
                </span>
              </div>

              {report.description && (
                <p className="mb-3 text-sm text-white/70">{report.description}</p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">
                  {new Date(report.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <a
                    href={`/${report.content_type === "car" ? "cars" : "cars"}/${report.content_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
                  >
                    View
                  </a>
                  {report.status === 'pending' && (
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-500/30"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
