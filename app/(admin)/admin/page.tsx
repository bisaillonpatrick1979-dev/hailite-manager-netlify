"use client";

// -- 📊 Dashboard Admin — Page principale
// -- KPIs, projets récents, activité de l'équipe

import { useState, useEffect } from "react";
import Navbar from "@/components/nav/Navbar";
import { formatCurrency } from "@/lib/utils";
import type { Project, Invoice, Employee } from "@/lib/types";

interface DashboardData {
  projects: Project[];
  invoices: Invoice[];
  employees: Employee[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    invoices: [],
    employees: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsRes, invoicesRes, employeesRes] = await Promise.all([
          fetch("/api/projects?limit=5"),
          fetch("/api/invoices"),
          fetch("/api/employees"),
        ]);

        const [projects, invoices, employees] = await Promise.all([
          projectsRes.json(),
          invoicesRes.json(),
          employeesRes.json(),
        ]);

        setData({
          projects: projects.data || [],
          invoices: invoices.data || [],
          employees: employees.data || [],
        });
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // -- Calcul KPIs
  const totalRevenue = data.invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const pendingRevenue = data.invoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const activeProjects = data.projects.filter(
    (p) => p.status === "in_progress"
  ).length;

  const activeEmployees = data.employees.filter(
    (e) => e.status === "active"
  ).length;

  const kpis = [
    {
      title: "Revenus payés",
      value: formatCurrency(totalRevenue),
      icon: "💰",
      color: "from-green-600 to-green-700",
      change: "+12% ce mois",
    },
    {
      title: "En attente",
      value: formatCurrency(pendingRevenue),
      icon: "⏳",
      color: "from-yellow-600 to-yellow-700",
      change: `${data.invoices.filter((i) => i.status === "sent").length} factures`,
    },
    {
      title: "Projets actifs",
      value: activeProjects.toString(),
      icon: "🏗️",
      color: "from-blue-600 to-blue-700",
      change: `${data.projects.length} total`,
    },
    {
      title: "Employés actifs",
      value: activeEmployees.toString(),
      icon: "👥",
      color: "from-purple-600 to-purple-700",
      change: "Sur le terrain",
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Tableau de bord" subtitle="Vue d'ensemble Hailite Xteriors" variant="admin" />

      <div className="flex-1 p-8 space-y-8">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.title}
              className={`bg-gradient-to-br ${kpi.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium opacity-90">{kpi.title}</p>
                <span className="text-2xl">{kpi.icon}</span>
              </div>
              <p className="text-3xl font-bold mb-1">
                {loading ? "—" : kpi.value}
              </p>
              <p className="text-xs opacity-75">{kpi.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Projets récents ── */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Projets récents</h3>
              <a href="/admin/projects" className="text-sm text-blue-400 hover:text-blue-300">
                Voir tous →
              </a>
            </div>
            <div className="divide-y divide-slate-700">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Chargement...</div>
              ) : data.projects.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="text-3xl mb-2">🏗️</div>
                  <p>Aucun projet pour l&apos;instant</p>
                  <a href="/admin/projects" className="text-blue-400 text-sm mt-2 inline-block">
                    Créer un projet →
                  </a>
                </div>
              ) : (
                data.projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">{project.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{project.address || "Adresse non définie"}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === "in_progress"
                          ? "bg-blue-900/50 text-blue-400"
                          : project.status === "completed"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-yellow-900/50 text-yellow-400"
                      }`}
                    >
                      {project.status === "in_progress"
                        ? "En cours"
                        : project.status === "completed"
                        ? "Terminé"
                        : "En attente"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Factures récentes ── */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-white">Factures récentes</h3>
              <a href="/admin/invoices" className="text-sm text-blue-400 hover:text-blue-300">
                Voir toutes →
              </a>
            </div>
            <div className="divide-y divide-slate-700">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Chargement...</div>
              ) : data.invoices.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="text-3xl mb-2">📄</div>
                  <p>Aucune facture pour l&apos;instant</p>
                  <a href="/admin/invoices" className="text-blue-400 text-sm mt-2 inline-block">
                    Créer une facture →
                  </a>
                </div>
              ) : (
                data.invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">{invoice.invoice_number}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{invoice.client_name || "Client non défini"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">{formatCurrency(invoice.amount)}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          invoice.status === "paid"
                            ? "bg-green-900/50 text-green-400"
                            : invoice.status === "sent"
                            ? "bg-blue-900/50 text-blue-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {invoice.status === "paid" ? "Payée" : invoice.status === "sent" ? "Envoyée" : "Brouillon"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: "/admin/projects", icon: "🏗️", label: "Nouveau projet" },
              { href: "/admin/invoices", icon: "📄", label: "Nouvelle facture" },
              { href: "/admin/employees", icon: "👥", label: "Ajouter employé" },
              { href: "/admin/ai-chat", icon: "🤖", label: "Assistant IA" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600 hover:border-blue-500 transition group"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm text-slate-300 group-hover:text-white text-center">
                  {action.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
