import { Upload, X, Star, Calendar } from "lucide-react";
import type { CarFormState } from "../types";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";

type Props = {
  form: CarFormState;
  setForm: (form: CarFormState) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  pendingFile: File | null;
  previewUrl: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disableActions: boolean;
  currentCarCreatedAt: string | null;
};

export function CarForm({
  form,
  setForm,
  onSubmit,
  onReset,
  pendingFile,
  previewUrl,
  onFileChange,
  disableActions,
  currentCarCreatedAt,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {form.id ? "Edit Car" : "Add New Car"}
        </h2>
        {form.id && (
          <button
            type="button"
            onClick={onReset}
            disabled={disableActions}
            className="text-sm text-white/60 hover:text-white disabled:opacity-50"
          >
            Clear Form
          </button>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-5">
        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Car Image
          </label>
          <div className="flex flex-col gap-3">
            {previewUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white/5">
                <Image
                  src={previewUrl.startsWith('public/') ? `/${previewUrl.replace('public/', '')}` : previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={previewUrl.startsWith('blob:')}
                />
              </div>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-white/60 transition hover:border-white/40 hover:bg-white/8">
              <Upload className="h-4 w-4" />
              {pendingFile ? pendingFile.name : "Choose image"}
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                disabled={disableActions}
              />
            </label>
          </div>
        </div>

        {/* Model */}
        <div>
          <label htmlFor="model" className="mb-2 block text-sm font-medium text-white/80">
            Model <span className="text-red-400">*</span>
          </label>
          <input
            id="model"
            type="text"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            placeholder="e.g., BMW E36 M3"
            required
            minLength={2}
            maxLength={100}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            disabled={disableActions}
          />
        </div>

        {/* Year & Owner */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="year" className="mb-2 block text-sm font-medium text-white/80">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="1995"
              min="1990"
              max={new Date().getFullYear()}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              disabled={disableActions}
            />
          </div>
          <div>
            <label htmlFor="owner" className="mb-2 block text-sm font-medium text-white/80">
              Owner
            </label>
            <input
              id="owner"
              type="text"
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
              placeholder="Owner name"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              disabled={disableActions}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-white/80">
            Description
            <span className="ml-2 text-xs text-white/50">({form.description.length}/2000)</span>
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Tell the story of this build..."
            rows={4}
            maxLength={2000}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
            disabled={disableActions}
          />
        </div>

        {/* Specs */}
        <div>
          <label htmlFor="specs" className="mb-2 block text-sm font-medium text-white/80">
            Specifications
            <span className="ml-2 text-xs text-white/50">(one per line)</span>
          </label>
          <textarea
            id="specs"
            value={form.specs}
            onChange={(e) => setForm({ ...form, specs: e.target.value })}
            placeholder="Engine: S50B32&#10;Power: 321 HP&#10;Transmission: 6-speed manual"
            rows={5}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
            disabled={disableActions}
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="mb-2 block text-sm font-medium text-white/80">
            Tags
            <span className="ml-2 text-xs text-white/50">(comma separated)</span>
          </label>
          <input
            id="tags"
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="e36, m3, manual, coupe"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            disabled={disableActions}
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <Star className={`h-5 w-5 ${form.isFeatured ? "fill-yellow-500 text-yellow-500" : "text-white/40"}`} />
            <div>
              <p className="text-sm font-medium text-white">Featured Build</p>
              <p className="text-xs text-white/60">Show on homepage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
            disabled={disableActions}
            className={`relative h-6 w-11 rounded-full transition ${
              form.isFeatured ? "bg-yellow-500" : "bg-white/20"
            } disabled:opacity-50`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                form.isFeatured ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Created Date */}
        {currentCarCreatedAt && (
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Calendar className="h-3.5 w-3.5" />
            Created: {new Date(currentCarCreatedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={disableActions || !form.model || form.model.length < 2}
          className="flex-1 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          title={!form.model || form.model.length < 2 ? 'Model is required (min 2 characters)' : ''}
        >
          {disableActions ? "Saving..." : form.id ? "Update Car" : "Create Car"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={onReset}
            disabled={disableActions}
            className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
