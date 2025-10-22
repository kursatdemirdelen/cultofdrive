"use client";

import { useState, useEffect } from "react";
import type { SocialPost } from "../types/social.types";

export function useSocialPosts() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const instagramResponse = await fetch("/api/instagram");
        if (instagramResponse.ok) {
          const data = await instagramResponse.json();
          setPosts(data.posts);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Instagram fetch error:", err);
      }

      try {
        const response = await fetch("/api/social-posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
          setLoading(false);
          return;
        } else {
          setError("Unable to load posts at this time.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Fallback fetch error:", err);
        setError("Unable to load posts at this time.");
        setLoading(false);
      }

      setPosts([]);
      setError("No posts available.");
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}