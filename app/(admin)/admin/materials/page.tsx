"use client";

// -- 📦 Page Matériaux Admin
// -- Catalogue de matériaux avec 3 niveaux de prix

import { useState, useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import { formatCurrency } from "@/lib/utils";
import type { Material } from "@/lib/types";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    unit: "unité",
    price_tier_1: "",
    price_tier_2: "",
    price_tier_3: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    setLoading(true);
    const res = await fetch("/api/materials");
    const data = await res.json();
    setMaterials(data.data || []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price_tier_1: form.price_tier_1 ? parseFloat(form.price_tier_1) : null,
        price_tier_2: form.price_tier_2 ? parseFloat(form.price_tier_2) : null,
        price_tier_3: form.price_tier_3 ? parseFloat(form.price_tier_3) : null,
      }),
    });

    setSaving(false);
    setShowForm(false);
    setForm({ name: "", sku: "", description: "", unit: "unité", price_tier_1: "", price_tier_2: "", price_tier_3: "" });
    loadMaterials();
  }

  // -- Filtrage côté client
  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.sku && m.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Matériaux" subtitle="Catalogue et prix" variant="admin" />

      <div className="flex-1 p-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un matériau..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium whitespace-nowrap"
          >
            + Nouveau matériau
          </button>
        </div>

        {/* ── Formulaire ── */}
        {showForm && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4">Nouveau matériau</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Unité</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="unité, kg, m², etc."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Prix Tier 1 (régulier)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price_tier_1}
                  onChange={(e) => setForm({ ...form, price_tier_1: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Prix Tier 2 (contracteur)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price_tier_2}
                  onChange={(e) => setForm({ ...form, price_tier_2: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Prix Tier 3 (volume)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price_tier_3}
                  onChange={(e) => setForm({ ...form, price_tier_3: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Création..." : "Ajouter le matériau"}
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

        {/* ── Table matériaux ── */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-700">
            <p className="text-slate-400 text-sm">
              {filteredMaterials.length} matériau{filteredMaterials.length !== 1 ? "x" : ""}
            </p>
          </div>
          {loading ? (
            <div className="p-12 text-center text-slate-400">Chargement...</div>
          ) : filteredMaterials.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">📦</div>
              <p>{search ? "Aucun résultat" : "Aucun matériau pour l'instant"}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Nom</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">SKU</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Unité</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Prix T1</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Prix T2</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Prix T3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-3 font-medium text-white text-sm">{mat.name}</td>
                    <td className="px-6 py-3 text-slate-400 font-mono text-xs">{mat.sku || "—"}</td>
                    <td className="px-6 py-3 text-slate-400 text-sm">{mat.unit || "—"}</td>
                    <td className="px-6 py-3 text-slate-300 text-sm">{mat.price_tier_1 ? formatCurrency(mat.price_tier_1) : "—"}</td>
                    <td className="px-6 py-3 text-slate-300 text-sm">{mat.price_tier_2 ? formatCurrency(mat.price_tier_2) : "—"}</td>
                    <td className="px-6 py-3 text-slate-300 text-sm">{mat.price_tier_3 ? formatCurrency(mat.price_tier_3) : "—"}</td>
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
