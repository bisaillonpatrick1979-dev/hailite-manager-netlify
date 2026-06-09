"use client";

// -- 📄 Page Factures Admin
// -- Liste, création et gestion des factures

import { useState, useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import {
  formatDate,
  formatCurrency,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
} from "@/lib/utils";
import type { Invoice } from "@/lib/types";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    client_name: "",
    amount: "",
    status: "draft",
    due_date: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    setLoading(true);
    const res = await fetch("/api/invoices");
    const data = await res.json();
    setInvoices(data.data || []);
    setLoading(false);
  }

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: form.amount ? parseFloat(form.amount) : 0,
      }),
    });

    setSaving(false);
    setShowForm(false);
    setForm({ client_name: "", amount: "", status: "draft", due_date: "", notes: "" });
    loadInvoices();
  }

  // -- Totaux
  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalPending = invoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Factures" subtitle="Gestion de la facturation" variant="admin" />

      <div className="flex-1 p-8 space-y-6">
        {/* ── Summary cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4">
            <p className="text-green-400 text-sm">Total encaissé</p>
            <p className="text-2xl font-bold text-green-300 mt-1">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4">
            <p className="text-yellow-400 text-sm">En attente</p>
            <p className="text-2xl font-bold text-yellow-300 mt-1">{formatCurrency(totalPending)}</p>
          </div>
          <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total factures</p>
            <p className="text-2xl font-bold text-white mt-1">{invoices.length}</p>
          </div>
        </div>

        {/* ── Header actions ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Toutes les factures</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            + Nouvelle facture
          </button>
        </div>

        {/* ── Formulaire ── */}
        {showForm && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4">Nouvelle facture</h3>
            <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm text-slate-400 mb-1">Montant ($) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
                  <option value="draft">Brouillon</option>
                  <option value="sent">Envoyée</option>
                  <option value="paid">Payée</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Date d&apos;échéance</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Création..." : "Créer la facture"}
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

        {/* ── Table factures ── */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Chargement...</div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">📄</div>
              <p>Aucune facture pour l&apos;instant</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">#Facture</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Client</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Montant</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Statut</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Échéance</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Créée le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 font-mono text-blue-400 text-sm">{invoice.invoice_number}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{invoice.client_name || "—"}</td>
                    <td className="px-6 py-4 text-white font-semibold text-sm">{formatCurrency(invoice.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                        {getInvoiceStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(invoice.due_date)}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(invoice.created_at)}</td>
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
