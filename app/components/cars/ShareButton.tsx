"use client";

import { useState } from "react";
import { Share2, Check, Twitter, Facebook, Link as LinkIcon } from "lucide-react";

type Props = {
  carModel: string;
  carId: string;
};

export function ShareButton({ carModel, carId }: Props) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/cars/${carId}` : "";
  const text = `Check out this ${carModel} on Cult of Drive`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform in urls) {
      window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400");
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-xl">
          <button
            onClick={handleCopy}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <LinkIcon className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={() => handleShare("twitter")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10"
          >
            <Twitter className="h-4 w-4" />
            Share on Twitter
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/10"
          >
            <Facebook className="h-4 w-4" />
            Share on Facebook
          </button>
        </div>
      )}
    </div>
  );
}
