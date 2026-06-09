export const dynamic = "force-dynamic";
// -- 🏗️ API Route: Projets
// -- CRUD complet pour la gestion des projets

import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// -- GET: Lister tous les projets
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    console.error("❌ GET /api/projects:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// -- POST: Créer un projet
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          name: body.name,
          address: body.address || null,
          client_name: body.client_name || null,
          client_email: body.client_email || null,
          client_phone: body.client_phone || null,
          description: body.description || null,
          status: body.status || "pending",
          start_date: body.start_date || null,
          end_date: body.end_date || null,
          budget: body.budget || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/projects:", error);
    return NextResponse.json({ error: "Erreur création projet" }, { status: 500 });
  }
}
