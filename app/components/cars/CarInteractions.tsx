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
      <section className="rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-white/40">Comments</h3>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <MessageCircle className="h-3.5 w-3.5" />
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
            <div className="relative">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Share your thoughts..."
                rows={2}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white placeholder-white/30 transition focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
              />
              <button
                onClick={submitComment}
                disabled={posting || !commentBody.trim()}
                className="absolute bottom-3 right-3 rounded-md bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center text-xs text-white/50">
            <Link href="/auth" className="text-white/70 underline hover:text-white">
              Sign in
            </Link>{" "}
            to comment
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-2 h-3 w-3/4 rounded bg-white/10" />
                <div className="h-2 w-1/4 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center">
            <MessageCircle className="mx-auto mb-2 h-6 w-6 text-white/30" />
            <p className="text-xs text-white/50">No comments yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="group rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.05]">
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">{c.body}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-white/40">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {c.user_id === userId && (
                    <button className="opacity-0 transition group-hover:opacity-100 text-red-400/60 hover:text-red-400">
                      <Trash2 className="h-3 w-3" />
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
