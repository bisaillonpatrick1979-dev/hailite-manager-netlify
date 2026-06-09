export const dynamic = "force-dynamic";
// -- ⏱️ API Route: Punch in/out
// -- Gestion des entrées de temps pour les employés

import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// -- GET: Obtenir l'état de punch courant
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({ error: "employeeId requis" }, { status: 400 });
    }

    // -- Chercher un punch actif (pas de punch_out)
    const { data: activePunch } = await supabase
      .from("time_entries")
      .select("*")
      .eq("employee_id", employeeId)
      .is("punch_out_time", null)
      .single();

    return NextResponse.json({
      isPunchedIn: !!activePunch,
      activePunch: activePunch || null,
    });
  } catch (error) {
    console.error("❌ GET /api/punch:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// -- POST: Punch in ou punch out
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { employeeId, action, projectId, notes } = body;

    if (!employeeId || !action) {
      return NextResponse.json(
        { error: "employeeId et action requis" },
        { status: 400 }
      );
    }

    if (action === "punch_in") {
      // -- Vérifier pas déjà poinçonné
      const { data: existing } = await supabase
        .from("time_entries")
        .select("id")
        .eq("employee_id", employeeId)
        .is("punch_out_time", null)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "Déjà poinçonné — Punch out d'abord" },
          { status: 400 }
        );
      }

      // -- Créer l'entrée punch in
      const { data, error } = await supabase
        .from("time_entries")
        .insert([
          {
            employee_id: employeeId,
            project_id: projectId || null,
            punch_in_time: new Date().toISOString(),
            notes: notes || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data, message: "Punch in réussi!" });
    }

    if (action === "punch_out") {
      // -- Trouver le punch actif
      const { data: activePunch } = await supabase
        .from("time_entries")
        .select("*")
        .eq("employee_id", employeeId)
        .is("punch_out_time", null)
        .single();

      if (!activePunch) {
        return NextResponse.json(
          { error: "Aucun punch actif trouvé" },
          { status: 400 }
        );
      }

      // -- Mettre à jour avec punch_out
      const { data, error } = await supabase
        .from("time_entries")
        .update({ punch_out_time: new Date().toISOString() })
        .eq("id", activePunch.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, data, message: "Punch out réussi!" });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (error) {
    console.error("❌ POST /api/punch:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
