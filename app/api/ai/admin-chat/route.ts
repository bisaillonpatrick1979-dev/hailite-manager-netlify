export const dynamic = "force-dynamic";
// -- 🤖 Admin AI Chat API Route
// -- STATUS: PLACEHOLDER — Réponses mock
// -- Intégrera Anthropic API plus tard

import { createServerClient } from "@/lib/supabase";
import { getAdminAIResponse, buildAdminContext } from "@/lib/anthropic-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Message ou userId manquant" },
        { status: 400 }
      );
    }

    // -- Client Supabase avec clé service
    const supabase = createServerClient();

    // -- Vérifier que l'utilisateur est admin
    const { data: employee } = await supabase
      .from("employees")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (!employee || !["admin", "supervisor"].includes(employee.role)) {
      return NextResponse.json(
        { error: "Accès refusé — Admin/Superviseur seulement" },
        { status: 403 }
      );
    }

    // -- Construire le contexte admin
    const context = await buildAdminContext(supabase, userId);

    // -- Obtenir réponse AI (mock pour l'instant)
    const aiResult = await getAdminAIResponse(message, context);

    return NextResponse.json({
      success: aiResult.success,
      response: aiResult.response,
      debug: aiResult.debug,
    });
  } catch (error) {
    console.error("❌ Erreur Admin AI route:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
