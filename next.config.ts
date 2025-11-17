import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseHostname = (() => {
  if (!envSupabaseUrl) return undefined;
  try {
    return new URL(envSupabaseUrl).hostname;
  } catch {
    return undefined;
  }
})();

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "*.cdninstagram.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "*.fbcdn.net",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "*.supabase.co",
    port: "",
    pathname: "/storage/v1/object/**",
  },
  ...(supabaseHostname
    ? [
        {
          protocol: "https",
          hostname: supabaseHostname,
          port: "",
          pathname: "/storage/v1/object/**",
        } satisfies RemotePattern,
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    domains: supabaseHostname ? [supabaseHostname] : [],
    qualities: [75, 85, 90, 95, 100],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 64, 128, 256, 512, 800, 1200],
    minimumCacheTTL: 60 * 60 * 24 * 14,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; sandbox;",

    remotePatterns,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
