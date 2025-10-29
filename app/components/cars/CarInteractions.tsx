"use client";

import { useEffect, useMemo, useState } from "react";
import { CarsAPI } from "@/utils/api";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { MessageCircle, Star } from "lucide-react";

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
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
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

        const [favorites, cmts] = await Promise.all([
          CarsAPI.getFavorites(carId, userId || undefined),
          CarsAPI.listComments(carId, 30),
        ]);

        if (!mounted) return;
        setFavoriteCount(favorites?.count ?? 0);
        setFavorited(Boolean(favorites?.favorited));
        setComments(cmts?.comments ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load build activity");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [carId, userId]);

  async function toggleFavorite() {
    if (!canInteract) return;
    try {
      if (favorited) {
        await CarsAPI.unfavorite(carId, userId!);
        setFavorited(false);
        setFavoriteCount((c) => Math.max(0, c - 1));
      } else {
        await CarsAPI.favorite(carId, userId!);
        setFavorited(true);
        setFavoriteCount((c) => c + 1);
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to update favorite");
    }
  }

  async function submitComment() {
    if (!commentBody.trim()) return;
    try {
      setPosting(true);
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
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-black/55 p-6 shadow-glow">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Add to your favorites</h3>
            <p className="text-sm text-white/55">
              Bookmark this build to find it again instantly across your devices.
            </p>
          </div>
          <button
            onClick={toggleFavorite}
            disabled={!canInteract || loading}
            className={`inline-flex items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] transition ${
              favorited
                ? "border-amber-400/40 bg-amber-500/15 text-white"
                : "border-white/20 bg-white/5 text-white/80 hover:border-white/35 hover:bg-white/10 hover:text-white"
            } ${!canInteract ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <Star
              className={`h-4 w-4 ${favorited ? "text-amber-300" : "text-white/60"}`}
            />
            {favorited ? "Favorited" : "Favorite"}
            <span className="ml-2 text-base">{favoriteCount}</span>
          </button>
        </header>

        {!canInteract && (
          <p className="mt-4 text-xs text-white/55">
            <a href="/auth" className="underline">
              Sign in
            </a>{" "}
            to save this build and join the conversation.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/55 p-6 shadow-glow">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Discussion</h3>
            <p className="text-sm text-white/55">
              Share setup notes, driving impressions, or shout-outs for the owner.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/55">
            <MessageCircle className="h-4 w-4" />
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </div>
        </header>

        {err && <p className="mb-4 text-sm text-rose-300">{err}</p>}

        {canInteract ? (
          <div className="mb-6 space-y-3">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="What do you love about this build?"
              className="min-h-[120px] w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/45 focus:border-white/40 focus:outline-none focus:ring-0"
            />
            <div className="flex justify-end">
              <button
                onClick={submitComment}
                disabled={posting || !commentBody.trim()}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:border-white/35 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {posting ? "Sharing..." : "Post comment"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-sm text-white/60">
            Sign in to join the discussion and get updates when someone replies.
          </div>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-white/60">
            No comments yet. Be the first to drop your insight.
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="whitespace-pre-line text-sm text-white/85">{c.body}</p>
                <p className="mt-2 text-xs text-white/45">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
