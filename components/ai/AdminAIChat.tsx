"use client";

// -- 🤖 Admin AI Chat Component
// -- UI: Thème sombre, look premium
// -- Status: OPÉRATIONNEL — Réponses mock, Anthropic plus tard

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import type { ChatMessage } from "@/lib/types";

export default function AdminAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // -- Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -- Questions suggérées
  const suggestions = [
    "Combien j'ai facturé ce mois?",
    "Montre-moi les projets actifs",
    "Statistiques de l'équipe",
    "Factures en retard?",
  ];

  async function handleSendMessage(messageText?: string) {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading || !user) return;

    setInput("");
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setThinking(true);

    try {
      const res = await fetch("/api/ai/admin-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          userId: user.id,
        }),
      });

      const data = await res.json();

      // -- Délai simulation réflexion
      await new Promise((resolve) => setTimeout(resolve, 500));
      setThinking(false);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.success
          ? data.response
          : `❌ Erreur: ${data.error || "Erreur inconnue"}`,
        timestamp: new Date(),
        debug: data.debug,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Erreur Admin AI:", error);
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "❌ Erreur de connexion au serveur",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      {/* ── HEADER ── */}
      <div className="p-6 border-b border-slate-700 bg-slate-800/60 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-bold">Assistant Admin IA</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Accès complet • Insights temps réel
            </p>
          </div>
          <div className="ml-auto">
            <span className="px-3 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded-full border border-yellow-700/50">
              PLACEHOLDER
            </span>
          </div>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4 opacity-40">🤖</div>
            <h3 className="text-xl font-semibold mb-2 opacity-70">
              Assistant Admin IA
            </h3>
            <p className="text-slate-400 max-w-sm text-sm mb-8">
              Pose des questions sur tes projets, employés, factures et KPIs.
            </p>

            {/* -- Suggestions */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSendMessage(s)}
                  className="text-left px-4 py-3 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm mr-3 shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-2xl p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-700 text-slate-100 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </p>
                {msg.debug && (
                  <p className="text-xs mt-2 opacity-50 border-t border-current/20 pt-2">
                    ℹ️ {msg.debug}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        {/* -- Animation "réflexion" */}
        {thinking && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm mr-3 shrink-0">
              🤖
            </div>
            <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span className="text-sm text-slate-400">Analyse en cours</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT ── */}
      <div className="p-5 border-t border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Pose une question à l'assistant..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
          >
            {loading ? "..." : "Envoyer ➤"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Mode placeholder • Anthropic API coming soon ✨
        </p>
      </div>
    </div>
  );
}
