// -- 🤖 ADMIN AI AGENT LIBRARY
// -- STATUS: PLACEHOLDER SCAFFOLDING
// --
// -- Structure prête pour intégration Anthropic API.
// -- Pour l'instant: Réponses mock pour tester l'UI.
// -- Plus tard: Décommenter les appels Anthropic quand ANTHROPIC_API_KEY est ajouté.

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AdminContext {
  allProjects: AdminProject[];
  allEmployees: AdminEmployee[];
  allInvoices: AdminInvoice[];
  kpis: AdminKPIs;
}

interface AdminProject {
  id: string;
  name: string;
  status: string;
  budget?: number | null;
}

interface AdminEmployee {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  hourly_rate?: number | null;
}

interface AdminInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
}

interface AdminKPIs {
  monthlyRevenue: number;
  averageMargin: number;
  totalProjects: number;
  totalEmployees: number;
}

// ─────────────────────────────────────────────
// RÉPONSE AI ADMIN (PLACEHOLDER)
// ─────────────────────────────────────────────

export async function getAdminAIResponse(
  userMessage: string,
  context: AdminContext
) {
  console.log("📝 Question admin:", userMessage);

  // -- 🚀 PLACEHOLDER: Réponses mock
  // -- TODO: Remplacer par un vrai appel Anthropic API:
  // --
  // -- import Anthropic from '@anthropic-ai/sdk';
  // -- const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // -- const message = await client.messages.create({
  // --   model: "claude-opus-4-8",
  // --   max_tokens: 1024,
  // --   system: buildAdminSystemPrompt(context),
  // --   messages: [{ role: "user", content: userMessage }],
  // -- });
  // -- return { success: true, response: message.content[0].text };

  const lower = userMessage.toLowerCase();

  // -- Réponse: Revenus / Facturation
  if (
    lower.includes("factur") ||
    lower.includes("revenu") ||
    lower.includes("argent") ||
    lower.includes("montant")
  ) {
    const totalPaid = context.allInvoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const totalPending = context.allInvoices
      .filter((i) => i.status === "sent")
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    return {
      success: true,
      response: `📊 RÉSUMÉ FINANCIER

💰 Facturé et payé: $${totalPaid.toFixed(2)}
⏳ En attente de paiement: $${totalPending.toFixed(2)}
📋 Nombre de factures: ${context.allInvoices.length}

📈 Revenu mensuel: $${context.kpis.monthlyRevenue.toFixed(2)}

ℹ️ MODE PLACEHOLDER — Avec Anthropic API connectée, j'analyserai les tendances, identifierai les clients à risque et proposerai des optimisations.

[DÉVELOPPEMENT - Réponse Mock]`,
      debug: "PLACEHOLDER - Anthropic API non connectée",
    };
  }

  // -- Réponse: Employés
  if (
    lower.includes("employ") ||
    lower.includes("équipe") ||
    lower.includes("travailleur")
  ) {
    const activeCount = context.allEmployees.length;
    const admins = context.allEmployees.filter((e) => e.role === "admin").length;

    return {
      success: true,
      response: `👥 ÉQUIPE HAILITE

Nombre d'employés: ${activeCount}
Administrateurs: ${admins}
Superviseurs: ${context.allEmployees.filter((e) => e.role === "supervisor").length}
Employés: ${context.allEmployees.filter((e) => e.role === "employee").length}

ℹ️ MODE PLACEHOLDER — Avec Anthropic API, j'analyserai la productivité, les heures supplémentaires et identifierai les meilleurs performers.

[DÉVELOPPEMENT - Réponse Mock]`,
      debug: "PLACEHOLDER - Anthropic API non connectée",
    };
  }

  // -- Réponse: Projets
  if (
    lower.includes("projet") ||
    lower.includes("chantier") ||
    lower.includes("travail")
  ) {
    const activeProjects = context.allProjects.filter(
      (p) => p.status === "in_progress"
    ).length;
    const completedProjects = context.allProjects.filter(
      (p) => p.status === "completed"
    ).length;

    return {
      success: true,
      response: `🏗️ PROJETS

En cours: ${activeProjects}
Complétés: ${completedProjects}
Total: ${context.allProjects.length}

ℹ️ MODE PLACEHOLDER — Avec Anthropic API, j'identifierai les projets en retard, calculerai les marges et proposerai des priorités.

[DÉVELOPPEMENT - Réponse Mock]`,
      debug: "PLACEHOLDER - Anthropic API non connectée",
    };
  }

  // -- Réponse générique
  return {
    success: true,
    response: `Bonjour! Je suis l'Assistant Admin IA de Hailite Xteriors.

⏳ STATUS: MODE PLACEHOLDER

Je peux répondre à des questions comme:
• "Combien j'ai facturé ce mois?"
• "Qui sont mes meilleurs employés?"
• "Quel projet est le plus rentable?"
• "Montre-moi les KPIs du mois"
• "Quelles factures sont en retard?"

Pour l'instant, je fournis des réponses de démonstration basées sur tes données réelles.

Une fois l'Anthropic API activée (ajoute ANTHROPIC_API_KEY dans .env.local), je deviendrai beaucoup plus puissant! 🚀

[DÉVELOPPEMENT - Réponse Mock]`,
    debug: "PLACEHOLDER - Anthropic API non connectée",
  };
}

// ─────────────────────────────────────────────
// CONSTRUCTION CONTEXTE ADMIN
// ─────────────────────────────────────────────

export async function buildAdminContext(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string
): Promise<AdminContext> {
  console.log("🔨 Construction contexte admin pour userId:", userId);

  try {
    // -- Charger projets, employés, factures en parallèle
    const [projectsRes, employeesRes, invoicesRes] = await Promise.all([
      supabase.from("projects").select("id, name, status, budget").limit(100),
      supabase
        .from("employees")
        .select("id, first_name, last_name, role, hourly_rate")
        .limit(100),
      supabase
        .from("invoices")
        .select("id, invoice_number, amount, status")
        .limit(200),
    ]);

    const allProjects = projectsRes.data || [];
    const allEmployees = employeesRes.data || [];
    const allInvoices = invoicesRes.data || [];

    // -- Calculer KPIs basiques
    const paidInvoices = allInvoices.filter(
      (i: AdminInvoice) => i.status === "paid"
    );
    const monthlyRevenue = paidInvoices
      .slice(0, 20)
      .reduce((sum: number, i: AdminInvoice) => sum + (i.amount || 0), 0);

    return {
      allProjects,
      allEmployees,
      allInvoices,
      kpis: {
        monthlyRevenue,
        averageMargin: 35,
        totalProjects: allProjects.length,
        totalEmployees: allEmployees.length,
      },
    };
  } catch (error) {
    console.error("Erreur buildAdminContext:", error);
    return {
      allProjects: [],
      allEmployees: [],
      allInvoices: [],
      kpis: { monthlyRevenue: 0, averageMargin: 0, totalProjects: 0, totalEmployees: 0 },
    };
  }
}
