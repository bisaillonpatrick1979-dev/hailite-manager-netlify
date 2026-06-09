"use client";

// -- 🧭 Sidebar de navigation admin (dark theme)
// -- Navigation principale du portail administrateur

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

// -- Liens de navigation admin
const adminNavLinks = [
  { href: "/admin", label: "Tableau de bord", icon: "📊" },
  { href: "/admin/projects", label: "Projets", icon: "🏗️" },
  { href: "/admin/invoices", label: "Factures", icon: "📄" },
  { href: "/admin/employees", label: "Employés", icon: "👥" },
  { href: "/admin/materials", label: "Matériaux", icon: "📦" },
  { href: "/admin/ai-chat", label: "Assistant IA", icon: "🤖" },
];

// -- Liens de navigation employé
const employeeNavLinks = [
  { href: "/employee", label: "Tableau de bord", icon: "🏠" },
  { href: "/employee/punch", label: "Pointer", icon: "⏱️" },
  { href: "/employee/schedule", label: "Horaire", icon: "📅" },
  { href: "/employee/profile", label: "Mon profil", icon: "👤" },
  { href: "/employee/ai-chat", label: "Assistant IA", icon: "🤖" },
];

interface SidebarProps {
  variant?: "admin" | "employee";
}

export default function Sidebar({ variant = "admin" }: SidebarProps) {
  const pathname = usePathname();
  const { signOut, employeeRole } = useAuth();

  const links = variant === "admin" ? adminNavLinks : employeeNavLinks;

  const isAdmin = variant === "admin";

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-64 shrink-0",
        isAdmin
          ? "bg-slate-900 border-r border-slate-700"
          : "bg-white border-r border-gray-200"
      )}
    >
      {/* -- Logo */}
      <div
        className={cn(
          "p-6 border-b",
          isAdmin ? "border-slate-700" : "border-gray-200"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏗️</span>
          <div>
            <h1
              className={cn(
                "font-bold text-lg leading-tight",
                isAdmin ? "text-white" : "text-gray-900"
              )}
            >
              HailiteManager
            </h1>
            <p
              className={cn(
                "text-xs",
                isAdmin ? "text-slate-400" : "text-gray-500"
              )}
            >
              {isAdmin ? "Portail Admin" : "Portail Employé"}
            </p>
          </div>
        </div>
      </div>

      {/* -- Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium",
                isAdmin
                  ? isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  : isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* -- Footer: Rôle + Déconnexion */}
      <div
        className={cn(
          "p-4 border-t",
          isAdmin ? "border-slate-700" : "border-gray-200"
        )}
      >
        <div
          className={cn(
            "text-xs px-4 py-2 rounded mb-2",
            isAdmin ? "text-slate-400" : "text-gray-500"
          )}
        >
          Rôle: <span className="font-semibold capitalize">{employeeRole}</span>
        </div>
        <button
          onClick={signOut}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium",
            isAdmin
              ? "text-slate-400 hover:bg-red-900/30 hover:text-red-400"
              : "text-gray-500 hover:bg-red-50 hover:text-red-600"
          )}
        >
          <span>🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
