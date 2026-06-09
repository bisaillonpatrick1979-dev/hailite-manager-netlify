"use client";

// -- 🏠 Page d'accueil HailiteManager
// -- Redirige vers admin ou employee selon le rôle

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, employeeRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // -- Pas connecté → login
      router.push("/auth/login");
      return;
    }

    // -- Connecté → rediriger selon le rôle
    if (employeeRole === "admin" || employeeRole === "supervisor") {
      router.push("/admin");
    } else {
      router.push("/employee");
    }
  }, [user, employeeRole, loading, router]);

  // -- Écran de chargement pendant la redirection
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🏗️</div>
        <h1 className="text-2xl font-bold text-white mb-2">HailiteManager</h1>
        <p className="text-slate-400">Chargement en cours...</p>
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
