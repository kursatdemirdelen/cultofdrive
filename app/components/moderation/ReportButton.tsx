"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";

type Props = {
  contentType: "car" | "comment";
  contentId: string;
};

export function ReportButton({ contentType, contentId }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/moderation/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          reason,
          description,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
          setReason("");
          setDescription("");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white"
      >
        <Flag className="h-3.5 w-3.5" />
        Report
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-white/10 bg-black/95 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Report Content</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-white/60 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center">
                <p className="text-green-400">Report submitted successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Reason *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white"
                  >
                    <option value="" className="bg-slate-900 text-white">Select a reason</option>
                    <option value="spam" className="bg-slate-900 text-white">Spam</option>
                    <option value="inappropriate" className="bg-slate-900 text-white">Inappropriate content</option>
                    <option value="misleading" className="bg-slate-900 text-white">Misleading information</option>
                    <option value="other" className="bg-slate-900 text-white">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Additional details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40"
                    placeholder="Provide more context..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg border border-white/20 px-4 py-2.5 font-medium text-white/80 transition hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !reason}
                    className="flex-1 rounded-lg bg-red-500/80 px-4 py-2.5 font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
