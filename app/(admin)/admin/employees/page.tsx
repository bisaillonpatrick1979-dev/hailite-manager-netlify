"use client";

// -- 👥 Page Employés Admin
// -- Liste et gestion de l'équipe

import { useState, useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import { formatCurrency, getInitials } from "@/lib/utils";
import type { Employee } from "@/lib/types";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-900/50 text-purple-400",
  supervisor: "bg-blue-900/50 text-blue-400",
  employee: "bg-green-900/50 text-green-400",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  supervisor: "Superviseur",
  employee: "Employé",
};

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "employee",
    hourly_rate: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    setLoading(true);
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data.data || []);
    setLoading(false);
  }

  async function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      }),
    });

    setSaving(false);
    setShowForm(false);
    setForm({ first_name: "", last_name: "", email: "", role: "employee", hourly_rate: "", phone: "" });
    loadEmployees();
  }

  const activeCount = employees.filter((e) => e.status === "active").length;

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Employés" subtitle="Gestion de l'équipe" variant="admin" />

      <div className="flex-1 p-8 space-y-6">
        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{employees.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Actifs</p>
            <p className="text-2xl font-bold text-green-400">{activeCount}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Taux moyen</p>
            <p className="text-2xl font-bold text-white">
              {employees.length > 0
                ? formatCurrency(
                    employees
                      .filter((e) => e.hourly_rate)
                      .reduce((sum, e) => sum + (e.hourly_rate || 0), 0) /
                      employees.filter((e) => e.hourly_rate).length || 0
                  ) + "/h"
                : "—"}
            </p>
          </div>
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Équipe</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            + Ajouter employé
          </button>
        </div>

        {/* ── Formulaire ── */}
        {showForm && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4">Nouvel employé</h3>
            <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Prénom *</label>
                <input
                  type="text"
                  required
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="employee">Employé</option>
                  <option value="supervisor">Superviseur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Taux horaire ($/h)</label>
                <input
                  type="number"
                  step="0.50"
                  value={form.hourly_rate}
                  onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Création..." : "Ajouter l'employé"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Liste employés (grid cards) ── */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement...</div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">👥</div>
            <p>Aucun employé pour l&apos;instant</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(emp.first_name, emp.last_name)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {emp.first_name} {emp.last_name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${ROLE_COLORS[emp.role] || "bg-gray-700 text-gray-400"}`}>
                      {ROLE_LABELS[emp.role] || emp.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  {emp.email && (
                    <p className="text-slate-400">📧 {emp.email}</p>
                  )}
                  {emp.phone && (
                    <p className="text-slate-400">📞 {emp.phone}</p>
                  )}
                  {emp.hourly_rate && (
                    <p className="text-slate-400">
                      💰 {formatCurrency(emp.hourly_rate)}/h
                    </p>
                  )}
                  <p className={`text-xs ${emp.status === "active" ? "text-green-400" : "text-red-400"}`}>
                    ● {emp.status === "active" ? "Actif" : "Inactif"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
