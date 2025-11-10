"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, DollarSign, Car, Wrench } from "lucide-react";
import { toast } from "@/app/components/ui/Toast";

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [listingType, setListingType] = useState<"car" | "part">("car");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!id || !user) return;

    const loadListing = async () => {
      try {
        const { data, error } = await supabaseBrowser
          .from("marketplace_listings")
          .select("*")
          .eq("id", id)
          .eq("seller_id", user.id)
          .single();

        if (error) throw error;

        setListingType(data.listing_type || "car");
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPrice(String(data.price || ""));
        setLocation(data.location || "");
        setContactEmail(data.contact_email || "");
        setContactPhone(data.contact_phone || "");
        setCurrentImageUrl(data.image_url || "");
        if (data.image_url) {
          const url = data.image_url.startsWith("http") ? data.image_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/garage/${data.image_url}`;
          setImagePreview(url);
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = currentImageUrl;

      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `marketplace/${fileName}`;

        const { error: uploadError } = await supabaseBrowser.storage
          .from("garage")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;
        imageUrl = filePath;
        setUploading(false);
      }

      const { error: updateError } = await supabaseBrowser
        .from("marketplace_listings")
        .update({
          title,
          description,
          image_url: imageUrl || null,
          price: parseFloat(price),
          location,
          contact_email: contactEmail,
          contact_phone: contactPhone,
        })
        .eq("id", id)
        .eq("seller_id", user.id);

      if (updateError) throw updateError;

      toast.success("Listing updated successfully!");
      router.push(`/marketplace/${id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update listing");
    } finally {
      setSubmitting(false);
      setUploading(false);
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
        <p className="text-white/60">You must be signed in to edit listings</p>
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
          href={`/marketplace/${id}`}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listing
        </Link>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <h1 className="mb-2 text-center font-heading text-3xl tracking-[0.12em] text-white">
            EDIT LISTING
          </h1>
          <p className="mb-8 text-center text-sm text-white/60">
            Update your marketplace listing
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Listing Type
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/60">
                {listingType === "car" ? (
                  <><Car className="h-4 w-4" /> Car</>
                ) : (
                  <><Wrench className="h-4 w-4" /> Part</>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white file:mr-4 file:rounded file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-white/20"
              />
              {imagePreview && (
                <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={5}
                maxLength={100}
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

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Price (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 pl-10 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={100}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  maxLength={20}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {uploading ? "Uploading..." : submitting ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href={`/marketplace/${id}`}
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
