"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { SocialPost } from "../types/social.types";
import PostImage from "./PostImage";

interface PostCardProps {
  post: SocialPost;
  priority?: boolean;
}

export default function PostCard({ post, priority = false }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="overflow-hidden transition-colors duration-300 border rounded-lg  border-white/5 bg-carbon/40 hover:bg-carbon/50"
    >
      {post.imageUrl && (
        <PostImage
          imageUrl={post.imageUrl}
          username={post.username}
          likeCount={post.like_count}
          postUrl={post.url}
          priority={priority}
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
              sizes="32px"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white/90">
              {post.username}
            </h4>
            <p className="text-xs text-white/40">
              {post.timestamp
                ? formatDistanceToNow(new Date(post.timestamp), {
                    addSuffix: true,
                  })
                : "Unknown time"}
            </p>
          </div>
        </div>

        <p
          className={`mb-4 text-sm text-white/70 leading-relaxed ${
            !expanded ? "line-clamp-4" : ""
          }`}
        >
          {post.content}
        </p>
        {post.content.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs transition-colors text-white/50 hover:text-white/70"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </motion.article>
  );
}
