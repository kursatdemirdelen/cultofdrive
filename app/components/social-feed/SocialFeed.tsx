"use client";

import { useSocialPosts } from "../hooks/useSocialPosts";
import SocialFeedHeader from "./SocialFeedHeader";
import PostCard from "./PostCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

export default function SocialFeed() {
  const { posts, loading, error } = useSocialPosts();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section className="px-12 py-16 bg-gradient-to-b from-gray-900 to-black/90">
      <div className="max-w-5xl mx-auto">
        <SocialFeedHeader />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} priority={true} />
          ))}
        </div>
      </div>
    </section>
  );
}
