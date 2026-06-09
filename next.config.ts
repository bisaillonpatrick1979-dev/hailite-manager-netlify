import type { NextConfig } from "next";

// -- ⚙️ Configuration Next.js 15 pour Netlify
const nextConfig: NextConfig = {
  // -- Optimisations images (désactivé pour Netlify static)
  images: {
    unoptimized: true,
  },
  // -- Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_APP_NAME: "HailiteManager",
  },
};

export default nextConfig;
