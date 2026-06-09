"use client";

// -- 👤 Page Profil Employé
// -- Informations personnelles et paramètres

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/nav/Navbar";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { Employee } from "@/lib/types";

export default function EmployeeProfilePage() {
  const { user, employeeId, signOut } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) loadProfile();
  }, [employeeId]);

  async function loadProfile() {
    if (!employeeId) return;
    setLoading(true);

    const res = await fetch("/api/employees");
    const data = await res.json();
    const myProfile = data.data?.find((e: Employee) => e.id === employeeId);
    setEmployee(myProfile || null);
    setLoading(false);
  }

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Mon profil" variant="employee" />

      <div className="flex-1 p-6 space-y-6">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : employee ? (
          <>
            {/* ── Avatar + nom ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-5">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {getInitials(employee.first_name, employee.last_name)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {employee.first_name} {employee.last_name}
                </h2>
                <p className="text-gray-500 text-sm capitalize mt-0.5">{employee.role}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                  employee.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {employee.status === "active" ? "● Actif" : "● Inactif"}
                </span>
              </div>
            </div>

            {/* ── Infos ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Informations</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-5 py-4 flex justify-between">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="text-gray-900 text-sm">{employee.email || user?.email || "—"}</span>
                </div>
                <div className="px-5 py-4 flex justify-between">
                  <span className="text-gray-500 text-sm">Téléphone</span>
                  <span className="text-gray-900 text-sm">{employee.phone || "—"}</span>
                </div>
                <div className="px-5 py-4 flex justify-between">
                  <span className="text-gray-500 text-sm">Taux horaire</span>
                  <span className="text-gray-900 text-sm font-semibold">
                    {employee.hourly_rate
                      ? `${formatCurrency(employee.hourly_rate)}/h`
                      : "—"}
                  </span>
                </div>
                <div className="px-5 py-4 flex justify-between">
                  <span className="text-gray-500 text-sm">Rôle</span>
                  <span className="text-gray-900 text-sm capitalize">{employee.role}</span>
                </div>
              </div>
            </div>

            {/* ── Compte Supabase ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Compte</h3>
              </div>
              <div className="px-5 py-4 flex justify-between">
                <span className="text-gray-500 text-sm">Email de connexion</span>
                <span className="text-gray-900 text-sm">{user?.email}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">👤</div>
            <p>Profil introuvable</p>
            <p className="text-sm mt-1">Contacte un administrateur</p>
          </div>
        )}

        {/* ── Déconnexion ── */}
        <button
          onClick={signOut}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold border border-red-200 transition"
        >
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
}
