"use client";

// -- 🤖 Page Admin AI Chat
// -- Interface complète avec l'assistant IA administrateur

import Navbar from "@/components/nav/Navbar";
import AdminAIChat from "@/components/ai/AdminAIChat";

export default function AdminAIChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar
        title="Assistant Admin IA"
        subtitle="Insights business en temps réel"
        variant="admin"
      />
      <div className="flex-1 p-6 min-h-0">
        <AdminAIChat />
      </div>
    </div>
  );
}
