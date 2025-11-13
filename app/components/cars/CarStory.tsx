import { CARD_STYLES, SECTION_TITLE } from "@/utils/styles";

interface CarStoryProps {
  description?: string;
}

export function CarStory({ description }: CarStoryProps) {
  return (
    <div className={CARD_STYLES}>
      <h2 className={`mb-4 ${SECTION_TITLE}`}>Story</h2>
      <p className="whitespace-pre-line text-base leading-relaxed text-white/80">
        {description || "No story shared yet."}
      </p>
    </div>
  );
}
