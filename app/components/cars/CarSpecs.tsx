import { CARD_STYLES, SECTION_TITLE } from "@/utils/styles";

interface CarSpecsProps {
  specs?: string[];
}

export function CarSpecs({ specs }: CarSpecsProps) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className={CARD_STYLES}>
      <h2 className={`mb-4 ${SECTION_TITLE}`}>Specifications</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {specs.map((spec: string, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded border border-white/10 bg-white/[0.03] px-4 py-2.5"
          >
            <div className="h-1 w-1 rounded-full bg-white/40" />
            <span className="text-sm text-white/70">{spec}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
