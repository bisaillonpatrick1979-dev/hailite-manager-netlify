"use client";

// -- 📅 Page Horaire Employé
// -- Vue calendrier simplifiée

import Navbar from "@/components/nav/Navbar";

export default function EmployeeSchedulePage() {
  const today = new Date();
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];

  // -- Générer les jours de la semaine courante
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="flex flex-col min-h-full">
      <Navbar title="Mon horaire" subtitle="Semaine courante" variant="employee" />

      <div className="flex-1 p-6 space-y-6">
        {/* ── Header ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-1">
            {months[today.getMonth()]} {today.getFullYear()}
          </h2>
          <p className="text-gray-500 text-sm">Semaine du {weekDays[0].getDate()} au {weekDays[6].getDate()}</p>
        </div>

        {/* ── Semaine ── */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === today.toDateString();
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={i}
                className={`rounded-xl border p-3 text-center ${
                  isToday
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isWeekend
                    ? "bg-gray-50 border-gray-200 text-gray-400"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                <p className="text-xs font-medium mb-1">{days[day.getDay()]}</p>
                <p className={`text-xl font-bold ${isToday ? "text-white" : ""}`}>
                  {day.getDate()}
                </p>
                <p className={`text-xs mt-1 ${isToday ? "text-blue-200" : "text-gray-400"}`}>
                  {isWeekend ? "—" : "8h"}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Info ── */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="font-semibold text-blue-900">Horaire en développement</h3>
              <p className="text-blue-700 text-sm mt-1">
                La gestion avancée des horaires sera disponible prochainement.
                Pour l&apos;instant, utilise le punch in/out pour enregistrer tes heures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
