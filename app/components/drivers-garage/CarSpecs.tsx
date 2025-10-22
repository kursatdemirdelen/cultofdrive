interface CarSpecsProps {
  specs: string[];
}

export default function CarSpecs({ specs }: CarSpecsProps) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 font-medium text-white">Specifications</h4>
      <ul className="grid grid-cols-2 gap-2">
        {specs.map((spec, idx) => (
          <li
            key={idx}
            className="px-3 py-2 text-sm text-gray-300 rounded bg-white/5"
          >
            {spec}
          </li>
        ))}
      </ul>
    </div>
  );
}
