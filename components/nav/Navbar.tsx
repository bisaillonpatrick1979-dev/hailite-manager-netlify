"use client";

// -- 🔝 Barre de navigation supérieure
// -- Topbar avec titre de page, actions rapides

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface NavbarProps {
  title?: string;
  subtitle?: string;
  variant?: "admin" | "employee";
}

export default function Navbar({
  title = "HailiteManager",
  subtitle,
  variant = "admin",
}: NavbarProps) {
  const { user, employeeRole } = useAuth();
  const isAdmin = variant === "admin";

  return (
    <header
      className={cn(
        "flex items-center justify-between h-16 px-6 border-b shrink-0",
        isAdmin
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200"
      )}
    >
      {/* -- Titre */}
      <div>
        <h2
          className={cn(
            "font-semibold",
            isAdmin ? "text-white" : "text-gray-900"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "text-xs",
              isAdmin ? "text-slate-400" : "text-gray-500"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* -- Info utilisateur */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className={cn(
              "text-sm font-medium",
              isAdmin ? "text-slate-200" : "text-gray-700"
            )}
          >
            {user?.email?.split("@")[0] || "Utilisateur"}
          </p>
          <p
            className={cn(
              "text-xs capitalize",
              isAdmin ? "text-slate-400" : "text-gray-500"
            )}
          >
            {employeeRole}
          </p>
        </div>
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
            isAdmin
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700"
          )}
        >
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
