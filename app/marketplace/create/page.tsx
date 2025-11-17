"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, DollarSign, Car, Wrench } from "lucide-react";
import { toast } from "@/app/components/ui/Toast";
import { buildImagePath, storageConfig } from "@/utils/storage";

export default function CreateListingPage() {
  const [user, setUser] = useState<any>(null);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [listingType, setListingType] = useState<"car" | "part">("car");
  const [carId, setCarId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      setContactEmail(user.email || "");

      const { data } = await supabaseBrowser
        .from("cars")
        .select("id, model, year")
        .eq("user_id", user.id);

      setCars(data || []);
      setLoading(false);
    };

    init();
  }, [router]);

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
      let imageUrl = "";

      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const filePath = buildImagePath({
          category: "marketplace",
          ownerId: user.id,
          label: title,
          extension: fileExt,
        });

        const { error: uploadError } = await supabaseBrowser.storage
          .from(storageConfig.bucket)
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;
        imageUrl = filePath;
        setUploading(false);
      }

      const { error: insertError } = await supabaseBrowser
        .from("marketplace_listings")
        .insert({
          listing_type: listingType,
          car_id: listingType === "car" ? (carId || null) : null,
          seller_id: user.id,
          title,
          description,
          image_url: imageUrl || null,
          price: parseFloat(price),
          location,
          contact_email: contactEmail,
          contact_phone: contactPhone,
        });

      if (insertError) throw insertError;

      toast.success("Listing created successfully!");
      router.push("/marketplace");
    } catch (err: any) {
      toast.error(err.message || "Failed to create listing");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/marketplace"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
          <h1 className="mb-2 text-center font-heading text-3xl tracking-[0.12em] text-white">
            CREATE LISTING
          </h1>
          <p className="mb-8 text-center text-sm text-white/60">
            List your BMW car or parts for sale
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Listing Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setListingType("car")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition ${
                    listingType === "car"
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <Car className="h-5 w-5" /> Car
                </button>
                <button
                  type="button"
                  onClick={() => setListingType("part")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition ${
                    listingType === "part"
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/20 bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <Wrench className="h-5 w-5" /> Part
                </button>
              </div>
            </div>

            {listingType === "car" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Select from Your Garage (Optional)
                </label>
                <select
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="" className="bg-slate-900 text-white">None - Custom listing</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id} className="bg-slate-900 text-white">
                      {car.year} {car.model}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                placeholder={listingType === "car" ? "e.g., 1997 BMW E36 M3 - Pristine Condition" : "e.g., E36 M3 Original Exhaust System"}
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
                placeholder={listingType === "car" ? "Describe your car, condition, modifications, service history..." : "Describe the part condition, compatible models, usage time..."}
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
                    placeholder={listingType === "car" ? "25000" : "500"}
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
                  placeholder="Los Angeles, CA"
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
                className="flex-1 rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Uploading..." : submitting ? "Creating..." : "Create Listing"}
              </button>
              <Link
                href="/marketplace"
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
