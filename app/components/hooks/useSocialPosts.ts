"use client";

import { useState, useEffect } from "react";
import type { SocialPost } from "@/app/types";

export function useSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/instagram");
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        } else {
          setError("Unable to load posts at this time.");
        }
      } catch (err) {
        console.error("Instagram fetch error:", err);
        setError("Unable to load posts at this time.");
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}