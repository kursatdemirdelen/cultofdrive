import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // İzin verilen ana domain(ler)
    domains: ["scontent.cdninstagram.com"],

    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 64, 128, 256, 512, 800, 1200],
    minimumCacheTTL: 60 * 60 * 24 * 14,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; sandbox;",

    // Instagram CDN pattern'leri
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'instagram.fada2-2.fna.fbcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.fbcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'scontent-*.cdninstagram.com',
        port: '',
        pathname: '/**',
      }

    ],
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
