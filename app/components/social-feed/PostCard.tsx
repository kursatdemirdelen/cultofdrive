"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { SocialPost } from "../types/social.types";
import PostImage from "./PostImage";

interface PostCardProps {
  post: SocialPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="overflow-hidden border rounded-2xl bg-white/5 backdrop-blur hover:bg-white/10 border-white/10"
    >
      {post.imageUrl && (
        <PostImage
          imageUrl={post.imageUrl}
          username={post.username}
          likeCount={post.like_count}
          postUrl={post.url}
        />
      )}

      <div className="p-5">
        <div className="flex items-center mb-3 space-x-3">
          <div className="relative w-8 h-8 overflow-hidden rounded-full">
            <Image
              src={post.profilePic || "/profile.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {post.username}
            </h4>
            <p className="text-xs text-gray-500">
              {post.timestamp
                ? formatDistanceToNow(new Date(post.timestamp), {
                    addSuffix: true,
                  })
                : "Unknown time"}
            </p>
          </div>
        </div>

        <p
          className={`mb-4 text-sm text-gray-300 leading-relaxed ${
            !expanded ? "line-clamp-4" : ""
          }`}
        >
          {post.content}
        </p>
        {post.content.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </motion.article>
  );
}
