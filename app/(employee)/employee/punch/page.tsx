"use client";

// -- ⏱️ Page Punch Employé
// -- Pointer entrée/sortie + historique

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/nav/Navbar";
import { formatDateTime, calculateHours, formatHours } from "@/lib/utils";

interface TimeEntry {
  id: string;
  punch_in_time: string;
  punch_out_time: string | null;
  notes: string | null;
}

export default function EmployeePunchPage() {
  const { employeeId } = useAuth();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [activePunch, setActivePunch] = useState<TimeEntry | null>(null);
  const [history, setHistory] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (employeeId) loadStatus();
  }, [employeeId]);

  async function loadStatus() {
    if (!employeeId) return;
    const res = await fetch(`/api/punch?employeeId=${employeeId}`);
    const data = await res.json();
    setIsPunchedIn(data.isPunchedIn);
    setActivePunch(data.activePunch);
  }

  async function handlePunch(action: "punch_in" | "punch_out") {
    if (!employeeId) return;
    setLoading(true);

    const res = await fetch("/api/punch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, action }),
    });

    const data = await res.json();
    if (data.success) {
      await loadStatus();
    }
    setLoading(false);
  }

  const elapsed = activePunch
    ? calculateHours(activePunch.punch_in_time, currentTime.toISOString())
    : 0;

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Pointage" subtitle="Punch in / Punch out" variant="employee" />

      <div className="flex-1 p-6 space-y-6">
        {/* ── Punch card ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-gray-500 text-sm mb-2">Statut actuel</p>

          {isPunchedIn ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                En service
              </div>

              <div>
                <p className="text-5xl font-bold text-gray-900 tabular-nums">
                  {formatHours(elapsed)}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Depuis {formatDateTime(activePunch?.punch_in_time)}
                </p>
              </div>

              <button
                onClick={() => handlePunch("punch_out")}
                disabled={loading}
                className="w-full max-w-xs py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-lg shadow-md disabled:opacity-50 transition"
              >
                {loading ? "..." : "🔴 PUNCH OUT"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Hors service
              </div>

              <p className="text-gray-400">
                {currentTime.toLocaleTimeString("fr-CA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <button
                onClick={() => handlePunch("punch_in")}
                disabled={loading || !employeeId}
                className="w-full max-w-xs py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-lg shadow-md disabled:opacity-50 transition"
              >
                {loading ? "..." : "🟢 PUNCH IN"}
              </button>

              {!employeeId && (
                <p className="text-sm text-red-500">Profil employé non trouvé</p>
              )}
            </div>
          )}
        </div>

        {/* ── Historique ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Historique récent</h3>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">⏱️</div>
              <p>Aucune entrée récente</p>
              <p className="text-xs mt-1">Pointe pour commencer à enregistrer</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((entry) => {
                const hours = entry.punch_out_time
                  ? calculateHours(entry.punch_in_time, entry.punch_out_time)
                  : null;
                return (
                  <div key={entry.id} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(entry.punch_in_time)}
                        </p>
                        {entry.punch_out_time && (
                          <p className="text-xs text-gray-400">
                            → {formatDateTime(entry.punch_out_time)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {hours !== null ? (
                          <p className="font-semibold text-gray-900">
                            {formatHours(hours)}
                          </p>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            En cours
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
