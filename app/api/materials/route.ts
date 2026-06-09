export const dynamic = "force-dynamic";
// -- 📦 API Route: Matériaux
// -- CRUD complet pour la gestion des matériaux

import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// -- GET: Lister tous les matériaux
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = supabase
      .from("materials")
      .select("*")
      .order("name", { ascending: true })
      .limit(200);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    console.error("❌ GET /api/materials:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// -- POST: Créer un matériau
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("materials")
      .insert([
        {
          name: body.name,
          sku: body.sku || null,
          description: body.description || null,
          unit: body.unit || null,
          price_tier_1: body.price_tier_1 || null,
          price_tier_2: body.price_tier_2 || null,
          price_tier_3: body.price_tier_3 || null,
          stock_quantity: body.stock_quantity || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/materials:", error);
    return NextResponse.json({ error: "Erreur création matériau" }, { status: 500 });
  }
}
