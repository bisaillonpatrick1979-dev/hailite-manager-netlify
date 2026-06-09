export const dynamic = "force-dynamic";
// -- 🤖 Employee AI Chat API Route
// -- STATUS: PLACEHOLDER — Réponses mock
// -- ACCÈS LIMITÉ — Données personnelles seulement

import { createServerClient } from "@/lib/supabase";
import {
  getEmployeeAIResponse,
  buildEmployeeContext,
} from "@/lib/anthropic-employee";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, employeeId, userId } = await request.json();

    if (!message || !employeeId || !userId) {
      return NextResponse.json(
        { error: "Données manquantes (message, employeeId, userId)" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // -- Vérifier que l'employé appartient bien à cet utilisateur (sécurité)
    const { data: employee } = await supabase
      .from("employees")
      .select("id")
      .eq("id", employeeId)
      .eq("user_id", userId)
      .single();

    if (!employee) {
      return NextResponse.json(
        { error: "Accès refusé — Employé non trouvé" },
        { status: 403 }
      );
    }

    // -- Construire contexte LIMITÉ à cet employé seulement
    const context = await buildEmployeeContext(supabase, employeeId, userId);

    // -- Obtenir réponse AI (mock pour l'instant)
    const aiResult = await getEmployeeAIResponse(message, employeeId, context);

    return NextResponse.json({
      success: aiResult.success,
      response: aiResult.response,
      debug: aiResult.debug,
    });
  } catch (error) {
    console.error("❌ Erreur Employee AI route:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
