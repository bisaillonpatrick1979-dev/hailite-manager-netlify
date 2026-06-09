"use client";

// -- 🏠 Dashboard Employé
// -- Vue personnelle: heures, paie, punch status

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/nav/Navbar";
import EmployeeAIChat from "@/components/ai/EmployeeAIChat";
import { formatCurrency, formatDateTime, calculateHours } from "@/lib/utils";

interface PunchStatus {
  isPunchedIn: boolean;
  activePunch: {
    id: string;
    punch_in_time: string;
  } | null;
}

export default function EmployeeDashboard() {
  const { user, employeeId } = useAuth();
  const [punchStatus, setPunchStatus] = useState<PunchStatus>({
    isPunchedIn: false,
    activePunch: null,
  });
  const [punchLoading, setPunchLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // -- Horloge en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // -- Charger statut punch
  useEffect(() => {
    if (employeeId) {
      loadPunchStatus();
    }
  }, [employeeId]);

  async function loadPunchStatus() {
    if (!employeeId) return;
    const res = await fetch(`/api/punch?employeeId=${employeeId}`);
    const data = await res.json();
    setPunchStatus(data);
  }

  async function handlePunch() {
    if (!employeeId) return;
    setPunchLoading(true);

    await fetch("/api/punch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId,
        action: punchStatus.isPunchedIn ? "punch_out" : "punch_in",
      }),
    });

    await loadPunchStatus();
    setPunchLoading(false);
  }

  // -- Heures depuis punch in
  const hoursWorked = punchStatus.activePunch
    ? calculateHours(
        punchStatus.activePunch.punch_in_time,
        currentTime.toISOString()
      )
    : 0;

  return (
    <div className="flex flex-col min-h-full">
      <Navbar
        title="Mon espace"
        subtitle={user?.email?.split("@")[0]}
        variant="employee"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* ── Horloge + Punch ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm">Heure actuelle</p>
              <p className="text-4xl font-bold text-gray-900 tabular-nums">
                {currentTime.toLocaleTimeString("fr-CA", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {currentTime.toLocaleDateString("fr-CA", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* -- Bouton Punch */}
            <div className="text-center">
              <button
                onClick={handlePunch}
                disabled={punchLoading || !employeeId}
                className={`w-28 h-28 rounded-full font-bold text-lg shadow-lg transition ${
                  punchStatus.isPunchedIn
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } disabled:opacity-50`}
              >
                {punchLoading ? "..." : punchStatus.isPunchedIn ? "PUNCH\nOUT" : "PUNCH\nIN"}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {punchStatus.isPunchedIn ? "En service" : "Hors service"}
              </p>
            </div>
          </div>

          {/* -- Session active */}
          {punchStatus.isPunchedIn && punchStatus.activePunch && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800 font-semibold text-sm">Session active</p>
                  <p className="text-green-600 text-xs mt-0.5">
                    Commencée à {formatDateTime(punchStatus.activePunch.punch_in_time)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-800">
                    {hoursWorked.toFixed(2)}h
                  </p>
                  <p className="text-green-600 text-xs">Heures travaillées</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Stats rapides ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Cette semaine</p>
            <p className="text-2xl font-bold text-gray-900">—h</p>
            <p className="text-gray-400 text-xs">{formatCurrency(0)} estimé</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Ce mois</p>
            <p className="text-2xl font-bold text-gray-900">—h</p>
            <p className="text-gray-400 text-xs">{formatCurrency(0)} estimé</p>
          </div>
        </div>

        {/* ── Actions rapides ── */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { href: "/employee/punch", icon: "⏱️", label: "Historique punch" },
            { href: "/employee/schedule", icon: "📅", label: "Mon horaire" },
            { href: "/employee/profile", icon: "👤", label: "Mon profil" },
            { href: "/employee/ai-chat", icon: "🤖", label: "Assistant IA" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition shadow-sm"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </a>
          ))}
        </div>

        {/* ── AI Chat compact ── */}
        {employeeId && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Assistant IA</h3>
            <EmployeeAIChat employeeId={employeeId} compact />
          </div>
        )}
      </div>
    </div>
  );
}
