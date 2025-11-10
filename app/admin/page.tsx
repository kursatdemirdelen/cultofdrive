"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { CarFormState, AdminCar } from "./types";
import { AdminHeader } from "./components/AdminHeader";
import { AdminAuthSection } from "./components/AdminAuthSection";
import { CarList } from "./components/CarList";
import { CarForm } from "./components/CarForm";
import { LockedState } from "./components/LockedState";
import { HistoryNote } from "./components/HistoryNote";
import { AdminDashboard } from "./components/AdminDashboard";
import { toast } from "@/app/components/ui/Toast";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { ModerationPanel } from "./components/ModerationPanel";
import { MarketplacePanel } from "./components/MarketplacePanel";
import { UsersPanel } from "./components/UsersPanel";
import { AnalyticsPanel } from "./components/AnalyticsPanel";
import { AdminTabs } from "./components/AdminTabs";

type UploadResponse = {
  path: string;
  publicUrl: string;
};

const EMPTY_FORM: CarFormState = {
  model: "",
  year: "",
  description: "",
  tags: "",
  specs: "",
  imageUrl: "",
  isFeatured: false,
};

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/garage/`
  : "";

const resolveImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (!STORAGE_BASE) return path;
  return `${STORAGE_BASE}${path.replace(/^\/+/, "")}`;
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "cars" | "marketplace" | "users" | "analytics" | "moderation">("dashboard");
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CarFormState>(EMPTY_FORM);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; carId: string; carModel: string }>({ 
    isOpen: false, 
    carId: "", 
    carModel: "" 
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedKey = window.localStorage.getItem("cod-admin-key");
    if (storedKey) setAdminKey(storedKey);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (adminKey) {
      window.localStorage.setItem("cod-admin-key", adminKey);
    } else {
      window.localStorage.removeItem("cod-admin-key");
    }
  }, [adminKey]);

  const resetForm = useCallback(() => {
    setForm(EMPTY_FORM);
    setPendingFile(null);
    setPreviewUrl("");
  }, []);

  useEffect(() => {
    if (!adminKey) {
      setConnected(false);
      setCars([]);
      setSearch("");
      resetForm();
    }
  }, [adminKey, resetForm]);

  const fetchCars = useCallback(async () => {
    if (!adminKey) {
      toast.error("Admin key is required.");
      return;
    }

    setLoading(true);
    setConnected(false);

    try {
      const response = await fetch("/api/admin/cars?limit=200", {
        headers: { "x-admin-key": adminKey },
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setConnected(false);
        throw new Error(body?.error || "Unable to load cars.");
      }

      setCars(Array.isArray(body.cars) ? body.cars : []);
      setConnected(true);
      toast.success("Connected successfully.");
    } catch (err: any) {
      setConnected(false);
      toast.error(err.message || "Failed to load cars.");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  const filteredCars = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return cars;

    return cars.filter((car) => {
      const haystack = [
        car.model ?? "",
        car.description ?? "",
        (car.tags ?? []).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [cars, search]);

  const selectCar = useCallback((car: AdminCar) => {
    const formData = {
      id: car.id,
      model: car.model ?? "",
      year: car.year ? String(car.year) : "",
      description: car.description ?? "",
      tags: (car.tags ?? []).join(", "),
      specs: Array.isArray(car.specs)
        ? car.specs
            .map((item: any) => {
              if (!item) return null;
              if (typeof item === "string") return item;
              if (typeof item === "object" && "key" in item && "value" in item) {
                return `${item.key}: ${item.value}`;
              }
              try {
                return JSON.stringify(item);
              } catch {
                return String(item);
              }
            })
            .filter(Boolean)
            .join("\n")
        : "",
      imageUrl: car.image_url ?? "",
      isFeatured: Boolean(car.is_featured),
    };
    
    setForm(formData);
    setPendingFile(null);
    setPreviewUrl(resolveImageUrl(car.image_url));
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setPendingFile(file);
      setPreviewUrl(file ? URL.createObjectURL(file) : resolveImageUrl(form.imageUrl));
    },
    [form.imageUrl]
  );

  const handleCopyImage = useCallback((path?: string | null) => {
    const url = resolveImageUrl(path);
    if (!url) {
      toast.info("This car has no image URL.");
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Image URL copied."))
      .catch(() => toast.error("Unable to copy image URL."));
  }, []);

  const uploadImage = useCallback(async (): Promise<UploadResponse | null> => {
    if (!pendingFile) return null;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", pendingFile);
      data.append("slug", form.model || "car");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: data,
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(body?.error || "Upload failed.");

      return body as UploadResponse;
    } finally {
      setUploading(false);
    }
  }, [adminKey, form.model, pendingFile]);

  const parseTags = useCallback((value: string) => {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, []);

  const parseSpecs = useCallback((value: string) => {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }, []);

  const handleCarSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!adminKey) {
        toast.error("Admin key is required.");
        return;
      }

      if (!form.model || form.model.trim().length < 2) {
        toast.error("Model is required (minimum 2 characters).");
        return;
      }

      if (form.description && form.description.length > 2000) {
        toast.error("Description is too long (maximum 2000 characters).");
        return;
      }

      setSaving(true);

      try {
        let imagePath = form.imageUrl;
        let publicUrl = previewUrl;

        if (pendingFile) {
          const uploadResult = await uploadImage();
          if (!uploadResult) throw new Error("Image upload failed.");
          imagePath = uploadResult.path;
          publicUrl = uploadResult.publicUrl;
        }

        const payload = {
          model: form.model.trim(),
          year: form.year ? Number(form.year) : null,
          description: form.description.trim() || null,
          tags: parseTags(form.tags),
          isFeatured: Boolean(form.isFeatured),
          specs: parseSpecs(form.specs),
          imageUrl: imagePath,
        };

        const endpoint = form.id ? `/api/admin/cars/${form.id}` : "/api/admin/cars";
        const method = form.id ? "PATCH" : "POST";
        
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify(payload),
        });
        
        const body = await response.json().catch(() => ({}));

        if (!response.ok) throw new Error(body?.error || "Failed to save car.");

        toast.success(form.id ? "Car updated." : "Car created.");
        await fetchCars();

        if (form.id) {
          setPendingFile(null);
          setPreviewUrl(publicUrl);
        } else {
          resetForm();
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to save car.");
      } finally {
        setSaving(false);
      }
    },
    [
      adminKey,
      fetchCars,
      form,
      parseSpecs,
      parseTags,
      pendingFile,
      previewUrl,
      resetForm,
      uploadImage,
    ]
  );

  const handleDeleteClick = useCallback((id: string) => {
    const car = cars.find(c => c.id === id);
    setDeleteDialog({ isOpen: true, carId: id, carModel: car?.model || "Unknown" });
  }, [cars]);

  const handleDeleteConfirm = useCallback(
    async () => {
      const { carId: id } = deleteDialog;
      if (!adminKey) {
        toast.error("Admin key is required.");
        return;
      }

      setSaving(true);

      try {
        const response = await fetch(`/api/admin/cars/${id}`, {
          method: "DELETE",
          headers: { "x-admin-key": adminKey },
        });
        const body = await response.json().catch(() => ({}));

        if (!response.ok) throw new Error(body?.error || "Failed to delete car.");

        toast.success("Car deleted.");
        await fetchCars();
        if (form.id === id) resetForm();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete car.");
      } finally {
        setSaving(false);
        setDeleteDialog({ isOpen: false, carId: "", carModel: "" });
      }
    },
    [adminKey, fetchCars, form.id, resetForm, deleteDialog]
  );

  const disableActions = saving || uploading;

  const currentCarCreatedAt = useMemo(() => {
    if (!form.id) return null;
    return cars.find((car) => car.id === form.id)?.created_at ?? null;
  }, [cars, form.id]);

  const dashboardStats = useMemo(() => {
    const featuredCount = cars.filter(car => car.is_featured).length;
    const recentCount = cars.filter(car => {
      const createdAt = new Date(car.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdAt > weekAgo;
    }).length;
    
    return {
      totalCars: cars.length,
      featuredCars: featuredCount,
      recentCars: recentCount,
    };
  }, [cars]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AdminHeader />

        <AdminAuthSection
          adminKey={adminKey}
          setAdminKey={setAdminKey}
          loading={loading}
          connected={connected}
          onConnect={fetchCars}
        />

        {connected && adminKey && (
          <>
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "dashboard" && (
              <AdminDashboard
                totalCars={dashboardStats.totalCars}
                featuredCars={dashboardStats.featuredCars}
                recentCars={dashboardStats.recentCars}
                adminKey={adminKey}
              />
            )}

            {activeTab === "cars" && (
              <div className="grid gap-8 lg:grid-cols-2">
                <CarList
                  cars={filteredCars}
                  total={cars.length}
                  search={search}
                  onSearchChange={setSearch}
                  onSelect={selectCar}
                  onCopyImage={handleCopyImage}
                  onDelete={handleDeleteClick}
                  disableActions={disableActions}
                  activeCarId={form.id}
                  resolveImageUrl={resolveImageUrl}
                />
                <CarForm
                  form={form}
                  setForm={setForm}
                  onSubmit={handleCarSubmit}
                  onReset={resetForm}
                  pendingFile={pendingFile}
                  previewUrl={previewUrl}
                  onFileChange={handleFileChange}
                  disableActions={disableActions}
                  currentCarCreatedAt={currentCarCreatedAt}
                />
              </div>
            )}

            {activeTab === "marketplace" && <MarketplacePanel adminKey={adminKey} />}
            {activeTab === "users" && <UsersPanel adminKey={adminKey} />}
            {activeTab === "analytics" && <AnalyticsPanel adminKey={adminKey} />}
            {activeTab === "moderation" && <ModerationPanel adminKey={adminKey} />}
          </>
        )}

        {!connected && <LockedState />}

        <HistoryNote />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Car"
        message={`Are you sure you want to delete "${deleteDialog.carModel}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, carId: "", carModel: "" })}
        type="danger"
      />
    </div>
  );
}
