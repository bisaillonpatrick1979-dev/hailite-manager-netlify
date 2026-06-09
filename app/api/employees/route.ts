export const dynamic = "force-dynamic";
// -- 👥 API Route: Employés
// -- CRUD complet pour la gestion des employés

import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// -- GET: Lister tous les employés
export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("last_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    console.error("❌ GET /api/employees:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// -- POST: Créer un employé
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          user_id: body.user_id || null,
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email || null,
          role: body.role || "employee",
          hourly_rate: body.hourly_rate || null,
          status: body.status || "active",
          phone: body.phone || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/employees:", error);
    return NextResponse.json({ error: "Erreur création employé" }, { status: 500 });
  }
}
