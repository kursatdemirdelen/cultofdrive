import Image from "next/image";
import { Heart, Instagram } from "lucide-react";

interface PostImageProps {
  imageUrl: string;
  username: string;
  likeCount: number;
  postUrl: string;
  priority?: boolean;
}

export default function PostImage({
  imageUrl,
  username,
  likeCount,
  postUrl,
  priority = false,
}: PostImageProps) {
  return (
    <div className="relative overflow-hidden h-60 group rounded-xl">
      <Image
        src={imageUrl}
        alt={`${username} post`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={85}
        priority={priority}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute flex items-center gap-2 text-xs bottom-3 left-3 text-white/80">
        <Heart className="w-4 h-4 text-red-400" />
        <span>{likeCount.toLocaleString()}</span>
      </div>

      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity duration-300 rounded-md opacity-0  bg-carbon/60 group-hover:opacity-100 text-white/80 hover:text-white"
      >
        <Instagram className="w-5 h-5 mr-2 text-white/75" />
        View
      </a>
    </div>
  );
}
