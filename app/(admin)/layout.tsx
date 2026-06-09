"use client";

// -- 🏛️ Layout du portail Admin
// -- Protection de route + navigation dark theme

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/nav/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, employeeRole, loading } = useAuth();
  const router = useRouter();

  // -- Redirection si non autorisé
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (employeeRole && !["admin", "supervisor"].includes(employeeRole)) {
      router.push("/employee");
    }
  }, [user, employeeRole, loading, router]);

  // -- Chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🏗️</div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // -- Non connecté ou pas admin
  if (!user || (employeeRole && !["admin", "supervisor"].includes(employeeRole))) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* -- Sidebar navigation */}
      <Sidebar variant="admin" />

      {/* -- Contenu principal */}
      <main className="flex-1 overflow-y-auto bg-slate-900">
        {children}
      </main>
    </div>
  );
}
