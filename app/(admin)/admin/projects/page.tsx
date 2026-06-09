"use client";

// -- 🏗️ Page Projets Admin
// -- Liste, création et gestion des projets

import { useState, useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import {
  formatDate,
  formatCurrency,
  getProjectStatusColor,
  getProjectStatusLabel,
} from "@/lib/utils";
import type { Project } from "@/lib/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    client_name: "",
    client_email: "",
    description: "",
    status: "pending",
    budget: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.data || []);
    setLoading(false);
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        budget: form.budget ? parseFloat(form.budget) : null,
      }),
    });

    setSaving(false);
    setShowForm(false);
    setForm({
      name: "",
      address: "",
      client_name: "",
      client_email: "",
      description: "",
      status: "pending",
      budget: "",
    });
    loadProjects();
  }

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Projets" subtitle="Gestion de tous les projets" variant="admin" />

      <div className="flex-1 p-8 space-y-6">
        {/* ── Header actions ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {projects.length} projet{projects.length !== 1 ? "s" : ""}
            </h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            + Nouveau projet
          </button>
        </div>

        {/* ── Formulaire création ── */}
        {showForm && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4">Nouveau projet</h3>
            <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nom du projet *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Adresse</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nom du client</label>
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email client</label>
                <input
                  type="email"
                  value={form.client_email}
                  onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Budget ($)</label>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Création..." : "Créer le projet"}
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

        {/* ── Liste des projets ── */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">🏗️</div>
              <p>Chargement des projets...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">🏗️</div>
              <p className="text-lg">Aucun projet pour l&apos;instant</p>
              <p className="text-sm mt-1">Clique sur &quot;Nouveau projet&quot; pour commencer</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Projet</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Budget</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Statut</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Créé le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{project.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{project.address || "—"}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {project.client_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {project.budget ? formatCurrency(project.budget) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                        {getProjectStatusLabel(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {formatDate(project.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
