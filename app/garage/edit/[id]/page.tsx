"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase-browser";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import Image from "next/image";
import { TagInput } from "@/app/components/form/TagInput";
import { SpecInput } from "@/app/components/form/SpecInput";
import { toast } from "@/app/components/ui/Toast";

type Spec = { key: string; value: string };

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  const router = useRouter();

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    let mounted = true;
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (mounted) setUser(data.user);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const loadCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (!res.ok) throw new Error("Failed to load car");
        const { car } = await res.json();
        
        setModel(car.model || "");
        setYear(car.year ? String(car.year) : "");
        setOwner(car.owner || "");
        setDescription(car.description || "");
        
        // Convert specs to Spec[] format
        if (Array.isArray(car.specs)) {
          const convertedSpecs = car.specs.map((spec: any) => {
            if (typeof spec === 'string' && spec.includes(':')) {
              const [key, ...valueParts] = spec.split(':');
              return { key: key.trim(), value: valueParts.join(':').trim() };
            }
            return { key: '', value: String(spec) };
          });
          setSpecs(convertedSpecs);
        }
        
        setTags(Array.isArray(car.tags) ? car.tags : []);
        setImageUrl(car.imageUrl || "");
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be signed in to edit");
      return;
    }

    setSaving(true);

    try {
      const cleanedSpecs = specs.filter(s => s.key || s.value);
      
      const payload = {
        model,
        year: year ? Number(year) : null,
        owner,
        description,
        specs: cleanedSpecs,
        tags,
      };

      const res = await fetch(`/api/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      toast.success("Car updated successfully!");
      router.push(`/cars/${id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 text-center">
        <h1 className="font-heading text-3xl tracking-[0.12em] text-white">SIGN IN REQUIRED</h1>
        <p className="text-white/60">You must be signed in to edit cars</p>
        <Link href="/auth" className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/cars/${id}`}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Car
        </Link>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <h1 className="mb-6 text-center font-heading text-3xl tracking-[0.12em] text-white">
            EDIT CAR
          </h1>

          {imageUrl && (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-lg">
              <Image 
                src={imageUrl.startsWith('public/') ? `/${imageUrl.replace('public/', '')}` : imageUrl} 
                alt={model} 
                fill 
                className="object-cover" 
                sizes="800px" 
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Model *</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Owner</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Description *
                <span className="ml-2 text-xs text-white/50">({description.length}/2000)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={2000}
                rows={5}
                className="w-full resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Specifications
              </label>
              <SpecInput specs={specs} onChange={setSpecs} disabled={saving} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Tags
              </label>
              <TagInput 
                tags={tags} 
                onChange={setTags} 
                placeholder="e.g., e36, m3, manual" 
                disabled={saving}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href={`/cars/${id}`}
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
