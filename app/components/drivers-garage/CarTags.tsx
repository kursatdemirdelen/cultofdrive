interface CarTagsProps {
  tags: string[];
}

export default function CarTags({ tags }: CarTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="
            px-3 py-[6px] text-sm
            bg-white/10 backdrop-blur-sm
            text-white/80 rounded-[6px]
          "
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
