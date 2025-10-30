"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function TagInput({ tags, onChange, placeholder = "Add tag...", disabled }: Props) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-lg border border-white/20 bg-white/5 p-3">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              disabled={disabled}
              className="rounded-full hover:bg-white/20 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm text-white placeholder-white/40 outline-none disabled:opacity-50"
        />
      </div>
      {input.trim() && (
        <button
          type="button"
          onClick={addTag}
          disabled={disabled}
          className="mt-2 flex items-center gap-1.5 text-xs text-white/60 hover:text-white disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Press Enter or click to add &quot;{input.trim()}&quot;
        </button>
      )}
    </div>
  );
}
