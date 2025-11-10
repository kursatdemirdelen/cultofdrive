"use client";

import { useState, useMemo, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { Upload, X, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { TagInput } from "@/app/components/form/TagInput";
import { SpecInput } from "@/app/components/form/SpecInput";
import { toast } from "@/app/components/ui/Toast";

type Spec = { key: string; value: string };

export default function AddCarPage() {
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState<Spec[]>([{ key: "Engine", value: "" }]);
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUserId(data.user?.id ?? null);
        setCheckingAuth(false);
      }
    });
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_ev, session) => {
      setUserId(session?.user?.id ?? null);
      setCheckingAuth(false);
    });
    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      if (file) fd.set("image", file);
      fd.set("model", model);
      if (year) fd.set("year", year);
      fd.set("description", description);
      
      const cleanedSpecs = specs.filter(s => s.key || s.value);
      fd.set("specs", JSON.stringify(cleanedSpecs));
      fd.set("tags", JSON.stringify(tags));
      
      if (userId) fd.set("user_id", userId);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || "Failed to upload");
      
      toast.success("Your car has been added to the garage!");
      router.push("/profile");
    } catch (err: any) {
      toast.error(err?.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 text-center">
        <h1 className="font-heading text-3xl tracking-[0.12em] text-white">ADD YOUR CAR</h1>
        <p className="max-w-md text-white/60">
          Sign in to share your BMW build with the community
        </p>
        <Link
          href="/auth"
          className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <h1 className="mb-2 text-center font-heading text-3xl tracking-[0.12em] text-white">
            ADD YOUR CAR
          </h1>
          <p className="mb-8 text-center text-sm text-white/60">
            Share your BMW build with the community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Car Photo *
              </label>
              {previewUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image src={previewUrl!} alt="Preview" fill className="object-cover" sizes="800px" unoptimized />
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 transition hover:border-white/40 hover:bg-white/8">
                  <Upload className="mb-2 h-8 w-8 text-white/40" />
                  <span className="text-sm text-white/60">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Model *</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="BMW E36 M3"
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="1997"
                  min="1990"
                  max={new Date().getFullYear()}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Story / Description *
                <span className="ml-2 text-xs text-white/50">({description.length}/2000)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your car, modifications, and what makes it special..."
                required
                maxLength={2000}
                rows={5}
                className="w-full resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            {/* Specs */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Specifications
              </label>
              <SpecInput specs={specs} onChange={setSpecs} disabled={submitting} />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Tags
              </label>
              <TagInput 
                tags={tags} 
                onChange={setTags} 
                placeholder="e.g., e36, m3, manual" 
                disabled={submitting}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || !model || model.length < 2 || description.length > 2000}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                title={!model || model.length < 2 ? 'Model is required (min 2 characters)' : description.length > 2000 ? 'Description is too long' : ''}
              >
                <Plus className="h-5 w-5" />
                {submitting ? "Adding..." : "Add to Garage"}
              </button>
              <Link
                href="/profile"
                className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:bg-white/5"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
