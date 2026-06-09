"use client";

// -- 🤖 Employee AI Chat Component
// -- UI: Thème clair, convivial
// -- Status: OPÉRATIONNEL — Réponses mock, Anthropic plus tard

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import type { ChatMessage } from "@/lib/types";

interface EmployeeAIChatProps {
  employeeId: string;
  compact?: boolean;
}

export default function EmployeeAIChat({
  employeeId,
  compact = false,
}: EmployeeAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestions = [
    "Mes heures cette semaine?",
    "Ma paie ce mois?",
    "Mon prochain shift?",
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
      const res = await fetch("/api/ai/employee-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          employeeId,
          userId: user.id,
        }),
      });

      const data = await res.json();
      await new Promise((resolve) => setTimeout(resolve, 400));
      setThinking(false);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.success
          ? data.response
          : `❌ ${data.error || "Erreur inconnue"}`,
        timestamp: new Date(),
        debug: data.debug,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Erreur Employee AI:", error);
      setThinking(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden ${
        compact ? "h-80" : "h-full"
      }`}
    >
      {/* ── HEADER ── */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">
                Assistant Chantier IA
              </h3>
              <p className="text-xs text-blue-600">Tes infos • Paie • Shifts</p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full border border-yellow-200">
            DEMO
          </span>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-4">
            <div className="text-3xl mb-2 opacity-40">💬</div>
            <p className="text-gray-400 text-sm mb-4">
              Pose-moi une question!
            </p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSendMessage(s)}
                  className="block w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg text-xs text-gray-600 hover:text-blue-700 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-900 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              {msg.debug && (
                <p className="text-xs mt-1 opacity-50">ℹ️ {msg.debug}</p>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT ── */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Pose une question..."
          disabled={loading}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 bg-white"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
