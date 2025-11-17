const STORAGE_BUCKET = "car-images";

export const IMAGE_CATEGORIES = ["cars", "marketplace", "admin", "profiles"] as const;
export type ImageCategory = (typeof IMAGE_CATEGORIES)[number];

const defaultCategory: ImageCategory = "admin";

const slugify = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const randomId = () => {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

type BuildPathArgs = {
  category: ImageCategory;
  ownerId?: string | null;
  label?: string | null;
  extension?: string | null;
};

export const buildImagePath = ({ category, ownerId, label, extension }: BuildPathArgs) => {
  const safeCategory = (IMAGE_CATEGORIES as readonly string[]).includes(category)
    ? category
    : defaultCategory;
  const safeOwner = ownerId?.replace(/[^a-zA-Z0-9_-]/g, "") || "public";
  const safeLabel = slugify(label) || "asset";
  const safeExt = extension?.replace(/^\.+/, "").toLowerCase() || "jpg";

  const id = randomId();
  return `${safeCategory}/${safeOwner}/${id}-${safeLabel}.${safeExt}`;
};

const normalizePath = (path: string) => path.replace(/^\/+/, "");

const resolveBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  return base.replace(/\/+$/, "");
};

export const getPublicAssetUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = resolveBaseUrl();
  if (!base) return path;
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${normalizePath(path)}`;
};

export const resolveImageSource = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("public/")) {
    return `/${path.replace(/^public\//, "")}`;
  }
  return getPublicAssetUrl(path);
};

export const storageConfig = {
  bucket: STORAGE_BUCKET,
};

