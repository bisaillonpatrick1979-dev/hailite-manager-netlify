export const dynamic = "force-dynamic";
// -- 📄 API Route: Factures
// -- CRUD complet pour la gestion des factures

import { createServerClient } from "@/lib/supabase";
import { generateInvoiceNumber } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// -- GET: Lister toutes les factures
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("invoices")
      .select("*, project:projects(name, address)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error) {
    console.error("❌ GET /api/invoices:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// -- POST: Créer une facture
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const invoiceNumber = body.invoice_number || generateInvoiceNumber();

    const { data, error } = await supabase
      .from("invoices")
      .insert([
        {
          invoice_number: invoiceNumber,
          project_id: body.project_id || null,
          client_name: body.client_name || null,
          amount: body.amount || 0,
          tax_rate: body.tax_rate || null,
          total_with_tax: body.total_with_tax || null,
          status: body.status || "draft",
          due_date: body.due_date || null,
          notes: body.notes || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/invoices:", error);
    return NextResponse.json({ error: "Erreur création facture" }, { status: 500 });
  }
}
