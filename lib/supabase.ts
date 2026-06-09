// -- 🗄️ Configuration Supabase pour HailiteManager
// -- Clients: browser (côté client) et serveur (côté serveur)

import { createClient } from "@supabase/supabase-js";

// -- Variables d'environnement (peuvent être vides au build, remplies au runtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// -- Client navigateur (accès limité par RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// -- Client serveur avec clé service (accès complet, côté serveur uniquement)
export function createServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_KEY manquant dans les variables d'environnement");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = serviceKey;

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// -- Helper: Obtenir l'utilisateur courant
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

// -- Helper: Vérifier si l'utilisateur est admin
export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("employees")
    .select("role")
    .eq("user_id", userId)
    .single();

  return (data as { role: string } | null)?.role === "admin";
}
