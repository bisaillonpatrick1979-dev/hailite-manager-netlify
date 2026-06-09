// -- 🤖 EMPLOYEE AI AGENT LIBRARY
// -- STATUS: PLACEHOLDER SCAFFOLDING
// --
// -- Structure pour AI Employé avec ACCÈS LIMITÉ.
// -- L'employé voit SEULEMENT ses propres données.
// -- Placeholder maintenant, vrai Anthropic plus tard.

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface EmployeeContext {
  employeeName: string;
  employeeRole: string;
  thisWeekHours: number;
  thisWeekPay: number;
  thisMonthHours: number;
  thisMonthPay: number;
  recentPunches: RecentPunch[];
  upcomingShifts: UpcomingShift[];
}

interface RecentPunch {
  date: string;
  hoursWorked: number;
  projectName?: string;
}

interface UpcomingShift {
  date: string;
  startTime: string;
  projectName?: string;
}

// ─────────────────────────────────────────────
// RÉPONSE AI EMPLOYÉ (PLACEHOLDER)
// ─────────────────────────────────────────────

export async function getEmployeeAIResponse(
  userMessage: string,
  employeeId: string,
  context: EmployeeContext
) {
  console.log("📝 Question employé:", userMessage, "ID:", employeeId);

  // -- 🚀 PLACEHOLDER: Réponses mock
  // -- TODO: Remplacer par un vrai appel Anthropic API avec contexte LIMITÉ:
  // --
  // -- import Anthropic from '@anthropic-ai/sdk';
  // -- const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // -- const message = await client.messages.create({
  // --   model: "claude-opus-4-8",
  // --   max_tokens: 512,
  // --   system: buildEmployeeSystemPrompt(context), // -- LIMITÉ à cet employé
  // --   messages: [{ role: "user", content: userMessage }],
  // -- });

  const lower = userMessage.toLowerCase();

  // -- Réponse: Heures de travail
  if (
    lower.includes("heure") ||
    lower.includes("travail") ||
    lower.includes("temps")
  ) {
    return {
      success: true,
      response: `⏱️ TES HEURES DE TRAVAIL

Cette semaine: ${context.thisWeekHours}h
Ce mois: ${context.thisMonthHours}h

${
  context.recentPunches.length > 0
    ? `Dernières entrées:\n${context.recentPunches
        .slice(0, 3)
        .map((p) => `• ${p.date}: ${p.hoursWorked}h${p.projectName ? ` — ${p.projectName}` : ""}`)
        .join("\n")}`
    : "Aucune entrée récente"
}

ℹ️ MODE PLACEHOLDER

[DÉVELOPPEMENT - Réponse Mock]`,
      debug: "PLACEHOLDER - Anthropic API non connectée",
    };
  }

  // -- Réponse: Paie
  if (
    lower.includes("paie") ||
    lower.includes("salaire") ||
    lower.includes("gagne") ||
    lower.includes("argent")
  ) {
    return {
      success: true,
      response: `💰 TA PAIE

Cette semaine: $${context.thisWeekPay.toFixed(2)}
Ce mois: $${context.thisMonthPay.toFixed(2)}

ℹ️ Calcul basé sur tes heures pointées × ton taux horaire.

MODE PLACEHOLDER — Avec Anthropic API, j'analyserai tes tendances de paie et répondrai à des questions plus complexes.

[DÉVELOPPEMENT - Réponse Mock]`,
      debug: "PLACEHOLDER - Anthropic API non connectée",
    };
  }

  // -- Réponse: Prochain shift
  if (
    lower.includes("shift") ||
    lower.includes("horaire") ||
    lower.includes("prochain") ||
    lower.includes("schedule")
  ) {
    return {
      success: true,
      response: `📅 TES PROCHAINS SHIFTS

${
  context.upcomingShifts.length > 0
    ? context.upcomingShifts
        .slice(0, 3)
        .map(
          (s) =>
            `• ${s.date} à ${s.startTime}${s.projectName ? ` — ${s.projectName}` : ""}`
        )
        .join("\n")
    : "Aucun shift programmé pour l'instant"
}

ℹ️ MODE PLACEHOLDER

[DÉVELOPPEMENT - Réponse Mock]`,
      debug: "PLACEHOLDER - Anthropic API non connectée",
    };
  }

  // -- Réponse générique
  return {
    success: true,
    response: `Salut ${context.employeeName}! 👋

Je suis ton Assistant Chantier IA.

⏳ STATUS: MODE PLACEHOLDER

Je peux répondre à:
• "Combien j'ai travaillé cette semaine?"
• "Combien je gagne ce mois?"
• "Mon prochain shift?"
• "Mes dernières heures?"

🔒 TES DONNÉES SONT PROTÉGÉES:
Je ne vois JAMAIS les infos des autres employés, ni les revenus de l'entreprise.

Anthropic API coming soon! 🚀

[DÉVELOPPEMENT - Réponse Mock]`,
    debug: "PLACEHOLDER - Anthropic API non connectée",
  };
}

// ─────────────────────────────────────────────
// CONSTRUCTION CONTEXTE EMPLOYÉ (LIMITÉ)
// ─────────────────────────────────────────────

export async function buildEmployeeContext(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  employeeId: string,
  userId: string
): Promise<EmployeeContext> {
  console.log("🔨 Construction contexte employé (limité) pour:", employeeId);

  try {
    // -- Charger profil employé
    const { data: employee } = await supabase
      .from("employees")
      .select("first_name, last_name, role, hourly_rate")
      .eq("id", employeeId)
      .eq("user_id", userId)
      .single();

    if (!employee) {
      return getDefaultContext();
    }

    const employeeName = `${employee.first_name} ${employee.last_name}`;
    const hourlyRate = employee.hourly_rate || 0;

    // -- Charger entrées de temps (7 derniers jours)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: timeEntries } = await supabase
      .from("time_entries")
      .select("punch_in_time, punch_out_time, project_id")
      .eq("employee_id", employeeId)
      .gte("punch_in_time", weekAgo.toISOString())
      .order("punch_in_time", { ascending: false })
      .limit(20);

    // -- Calculer heures semaine
    let thisWeekHours = 0;
    const recentPunches: RecentPunch[] = [];

    for (const entry of timeEntries || []) {
      if (entry.punch_out_time) {
        const hours =
          (new Date(entry.punch_out_time).getTime() -
            new Date(entry.punch_in_time).getTime()) /
          3600000;
        thisWeekHours += hours;
        recentPunches.push({
          date: new Date(entry.punch_in_time).toLocaleDateString("fr-CA"),
          hoursWorked: Math.round(hours * 100) / 100,
        });
      }
    }

    const thisWeekPay = thisWeekHours * hourlyRate;

    // -- Estimé mensuel (×4 semaines)
    const thisMonthHours = thisWeekHours * 4;
    const thisMonthPay = thisMonthHours * hourlyRate;

    return {
      employeeName,
      employeeRole: employee.role,
      thisWeekHours: Math.round(thisWeekHours * 100) / 100,
      thisWeekPay: Math.round(thisWeekPay * 100) / 100,
      thisMonthHours: Math.round(thisMonthHours * 100) / 100,
      thisMonthPay: Math.round(thisMonthPay * 100) / 100,
      recentPunches: recentPunches.slice(0, 5),
      upcomingShifts: [],
    };
  } catch (error) {
    console.error("Erreur buildEmployeeContext:", error);
    return getDefaultContext();
  }
}

function getDefaultContext(): EmployeeContext {
  return {
    employeeName: "Employé",
    employeeRole: "employee",
    thisWeekHours: 0,
    thisWeekPay: 0,
    thisMonthHours: 0,
    thisMonthPay: 0,
    recentPunches: [],
    upcomingShifts: [],
  };
}
