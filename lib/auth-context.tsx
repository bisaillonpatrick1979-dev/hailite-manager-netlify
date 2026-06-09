"use client";

// -- 🔐 Context d'authentification pour HailiteManager
// -- Gère l'état de connexion dans toute l'application

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  employeeRole: "admin" | "supervisor" | "employee" | null;
  employeeId: string | null;
  signOut: () => Promise<void>;
  refreshEmployee: () => Promise<void>;
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  employeeRole: null,
  employeeId: null,
  signOut: async () => {},
  refreshEmployee: async () => {},
});

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeRole, setEmployeeRole] = useState<
    "admin" | "supervisor" | "employee" | null
  >(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  // -- Charger le profil employé depuis Supabase
  async function loadEmployeeProfile(userId: string) {
    try {
      const { data } = await supabase
        .from("employees")
        .select("id, role")
        .eq("user_id", userId)
        .single();

      const profile = data as { id: string; role: string } | null;
      if (profile) {
        setEmployeeRole(profile.role as "admin" | "supervisor" | "employee");
        setEmployeeId(profile.id);
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    }
  }

  // -- Refresh manuel du profil (après mise à jour)
  async function refreshEmployee() {
    if (user) {
      await loadEmployeeProfile(user.id);
    }
  }

  // -- Déconnexion
  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setEmployeeRole(null);
    setEmployeeId(null);
  }

  // -- Écouter les changements d'auth
  useEffect(() => {
    // -- Session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadEmployeeProfile(session.user.id);
      }
      setLoading(false);
    });

    // -- Écouter les changements
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadEmployeeProfile(session.user.id);
      } else {
        setEmployeeRole(null);
        setEmployeeId(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        employeeRole,
        employeeId,
        signOut,
        refreshEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
