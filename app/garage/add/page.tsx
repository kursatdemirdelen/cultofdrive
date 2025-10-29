"use client";

import { useState, useMemo, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseBrowser } from "@/utils/supabase-browser";

type Spec = { key: string; value: string };

export default function AddCarPage() {
  const [model, setModel] = useState("");
  const [year, setYear] = useState<string>("");
  const [owner, setOwner] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState<Spec[]>([{ key: "Engine", value: "" }]);
  const [tags, setTags] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    return () => { sub.subscription.unsubscribe(); mounted = false };
  }, []);

  const handleAddSpec = () => setSpecs((s) => [...s, { key: "", value: "" }]);
  const handleRemoveSpec = (idx: number) => setSpecs((s) => s.filter((_, i) => i !== idx));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      if (file) fd.set("image", file);
      fd.set("model", model);
      if (year) fd.set("year", year);
      if (owner) fd.set("owner", owner);
      fd.set("description", description);
      const cleanedSpecs = specs.filter((s) => s.key || s.value);
      fd.set("specs", JSON.stringify(cleanedSpecs));
      const tagArr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      fd.set("tags", JSON.stringify(tagArr));
      if (username) fd.set("username", username);
      if (userId) fd.set("user_id", userId);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to upload");
      setMessage("Your car has been added to the garage!");
      setModel("");
      setYear("");
      setOwner("");
      setUsername("");
      setDescription("");
      setSpecs([{ key: "Engine", value: "" }]);
      setTags("");
      setFile(null);
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white/70">
        Checking access...
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-gray-900 to-black text-center text-white/80 px-4">
        <h1 className="text-3xl font-heading tracking-[0.1em]">Driver&apos;s Garage</h1>
        <p className="max-w-md text-white/60">Sign in to share your BMW build, specs, and story with the community.</p>
        <Link href="/auth" className="btn-motorsport-primary">Sign in to add your car</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-10 px-4">
      <div className="max-w-3xl mx-auto border border-white/10 bg-black/40 backdrop-blur-lg rounded-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-heading tracking-[0.12em] text-white text-center mb-2">
          Add Your Car to the Garage
        </h1>
        <div className="mx-auto mb-8 h-[3px] w-[180px] bg-gradient-to-r from-[#00a0ff] via-[#0055ff] to-[#c40000] rounded-full opacity-90" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          <section>
            <h2 className="text-xl text-white/90 mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Model</label>
                <input
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
                  placeholder="BMW E36 328i Coupe"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Year</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
                  placeholder="1997"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Owner</label>
                <input
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
                  placeholder="John Doe"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Username/Handle</label>
                <input
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
                  placeholder="@johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Step 2: Upload */}
          <section>
            <h2 className="text-xl text-white/90 mb-4">Photos</h2>
            <div className="grid gap-4 md:grid-cols-2 items-start">
              <label className="flex items-center justify-center h-40 rounded-md border border-dashed border-white/20 bg-white/5 text-white/70 hover:bg-white/10 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? "Change Photo" : "Click to upload main photo"}
              </label>
              {previewUrl && (
                <div className="relative h-40 rounded-md overflow-hidden border border-white/10">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </section>

          {/* Step 3: Details */}
          <section>
            <h2 className="text-xl text-white/90 mb-4">Details</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Story / Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50 min-h-[120px]"
                  placeholder="Tell us about your car..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-white/70">Specifications</label>
                  <button type="button" onClick={handleAddSpec} className="text-sm text-white/70 hover:text-white">+ Add</button>
                </div>
                <div className="space-y-2">
                  {specs.map((s, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2">
                      <input
                        className="col-span-2 px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
                        placeholder="Key (e.g., Engine)"
                        value={s.key}
                        onChange={(e) => {
                          const v = e.target.value; setSpecs((arr) => arr.map((it, i) => i === idx ? { ...it, key: v } : it));
                        }}
                      />
                      <input
                        className="col-span-3 px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
                        placeholder="Value (e.g., S54B32)"
                        value={s.value}
                        onChange={(e) => {
                          const v = e.target.value; setSpecs((arr) => arr.map((it, i) => i === idx ? { ...it, value: v } : it));
                        }}
                      />
                      <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-sm text-white/60 hover:text-white">Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Tags</label>
                <input
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/15 text-white placeholder-white/50"
                  placeholder="#classic, #E36, #manual"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-white/50 mt-1">Separate with commas</p>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">
              {error && <p className="text-red-300">{error}</p>}
              {message && <p className="text-emerald-300">{message}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting || !userId}
              className="btn-motorsport-primary disabled:opacity-60"
            >
              {submitting ? "Adding..." : userId ? "Add to Garage" : "Sign in to add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
