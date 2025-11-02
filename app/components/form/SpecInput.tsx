"use client";

import { Plus, X } from "lucide-react";

type Spec = { key: string; value: string };

type Props = {
  specs: Spec[];
  onChange: (specs: Spec[]) => void;
  disabled?: boolean;
};

export function SpecInput({ specs, onChange, disabled }: Props) {
  const addSpec = () => {
    onChange([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    onChange(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    onChange(
      specs.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  return (
    <div className="space-y-3">
      {specs.map((spec, i) => (
        <div key={i} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={spec.key}
            onChange={(e) => updateSpec(i, "key", e.target.value)}
            placeholder="e.g., Engine"
            disabled={disabled}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 sm:w-1/3"
          />
          <input
            type="text"
            value={spec.value}
            onChange={(e) => updateSpec(i, "value", e.target.value)}
            placeholder="e.g., S54B32"
            disabled={disabled}
            className="w-full flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => removeSpec(i)}
            disabled={disabled}
            className="self-start rounded-lg border border-white/20 bg-white/5 p-2.5 text-white/60 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 sm:self-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addSpec}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/40 hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add Specification
      </button>
    </div>
  );
}
