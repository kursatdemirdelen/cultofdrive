"use client";

import { useEffect, useMemo, useState } from "react";
import { CarsAPI } from "@/utils/api";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  body: string;
  user_id: string | null;
  created_at: string;
}

function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id ?? null);
    });

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  return userId;
}

export default function CarInteractions({ carId }: { carId: string }) {
  const userId = useUserId();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  const canInteract = useMemo(() => Boolean(userId), [userId]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErr(null);

        const cmts = await CarsAPI.listComments(carId, 30);

        if (!mounted) return;
        setComments(cmts?.comments ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [carId, userId]);

  async function submitComment() {
    if (!commentBody.trim() || posting) return;
    try {
      setPosting(true);
      setErr(null);
      const { comment } = await CarsAPI.addComment(carId, commentBody.trim(), userId || undefined);
      setComments((arr) => [comment, ...arr]);
      setCommentBody("");
    } catch (e: any) {
      setErr(e?.message || "Failed to add comment");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      {/* Comments Section */}
      <section className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-white">Comments</h3>
            <p className="text-sm text-white/60">
              Share your thoughts about this build
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <MessageCircle className="h-4 w-4" />
            {comments.length}
          </div>
        </div>

        {err && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        )}

        {canInteract ? (
          <div className="mb-6">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="What do you think about this build?"
              rows={3}
              className="w-full resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={submitComment}
                disabled={posting || !commentBody.trim()}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {posting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-dashed border-white/20 bg-white/5 p-4 text-center text-sm text-white/60">
            <Link href="/auth" className="text-white underline hover:text-white/80">
              Sign in
            </Link>{" "}
            to join the discussion
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/4 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
            <MessageCircle className="mx-auto mb-3 h-8 w-8 text-white/40" />
            <p className="text-sm text-white/60">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/85">{c.body}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-white/50">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {c.user_id === userId && (
                    <button className="text-xs text-red-400/60 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
