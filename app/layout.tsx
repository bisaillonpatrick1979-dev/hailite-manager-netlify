// -- 🏠 Layout racine de l'application HailiteManager
// -- Wraps toute l'app avec providers globaux

import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "HailiteManager — Hailite Xteriors",
  description: "Système de gestion pour Hailite Xteriors — Projets, Employés, Facturation",
  keywords: ["hailite", "gestion", "projets", "facturation", "employés"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {/* -- Provider d'authentification global */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
