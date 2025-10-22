interface CarTagsProps {
  tags: string[];
}

export default function CarTags({ tags }: CarTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 text-sm text-blue-300 border rounded-full bg-blue-600/20 border-blue-600/30"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
