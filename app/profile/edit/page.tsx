"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/utils/supabase-browser";
import { useRouter } from "next/navigation";
import { Avatar } from "@/app/components/ui/Avatar";
import { Camera, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/app/components/ui/Toast";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data } = await supabaseBrowser
        .from("user_profiles")
        .select("display_name, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          display_name: data.display_name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
        });
      }
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabaseBrowser.storage
        .from("garage")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseBrowser.storage
        .from("garage")
        .getPublicUrl(filePath);

      setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Avatar uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: updateError } = await supabaseBrowser
        .from("user_profiles")
        .update({
          display_name: profile.display_name.trim(),
          bio: profile.bio.trim(),
          avatar_url: profile.avatar_url,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast.success("Profile updated!");
      router.push("/profile");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Garage
        </Link>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <h1 className="mb-6 text-2xl font-light text-white">Edit Profile</h1>

          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm text-white/70">Profile Picture</label>
              <div className="flex items-center gap-4">
                <Avatar
                  src={profile.avatar_url}
                  alt={profile.display_name || "User"}
                  size="xl"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                    <Camera className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Change Photo"}
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Display Name</label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile((prev) => ({ ...prev, display_name: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 transition focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                rows={4}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/30 transition focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
                placeholder="Tell us about yourself and your builds..."
              />
              <p className="mt-1 text-xs text-white/40">{profile.bio.length}/500</p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
