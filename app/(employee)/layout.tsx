"use client";

// -- 👷 Layout du portail Employé
// -- Protection de route + navigation light theme

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/nav/Sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // -- Redirection si non connecté
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🏗️</div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* -- Sidebar navigation */}
      <Sidebar variant="employee" />

      {/* -- Contenu principal */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
