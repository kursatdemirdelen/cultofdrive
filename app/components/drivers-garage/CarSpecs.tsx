interface CarSpecsProps {
  specs: string[];
}

export default function CarSpecs({ specs }: CarSpecsProps) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-xl font-heading tracking-[0.03em] text-white/90">
        Specifications
      </h4>
      <ul className="grid grid-cols-2 gap-2">
        {specs.map((spec, idx) => (
          <li
            key={idx}
            className="
              px-3 py-2 text-sm
              bg-black/10 backdrop-blur-sm 
              text-white/90 rounded-[6px]
            "
          >
            {spec}
          </li>
        ))}
      </ul>
    </div>
  );
}
