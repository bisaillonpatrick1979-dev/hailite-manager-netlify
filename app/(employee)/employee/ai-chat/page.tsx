"use client";

// -- 🤖 Page Employee AI Chat
// -- Interface complète avec l'assistant IA employé

import Navbar from "@/components/nav/Navbar";
import EmployeeAIChat from "@/components/ai/EmployeeAIChat";
import { useAuth } from "@/lib/auth-context";

export default function EmployeeAIChatPage() {
  const { employeeId } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        title="Assistant Chantier IA"
        subtitle="Tes heures et paie"
        variant="employee"
      />
      <div className="flex-1 p-6 min-h-0">
        {employeeId ? (
          <EmployeeAIChat employeeId={employeeId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p>Profil employé non trouvé</p>
              <p className="text-sm mt-1">Contacte un administrateur</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
