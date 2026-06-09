// -- 📦 Types TypeScript pour HailiteManager
// -- Toutes les interfaces partagées dans l'application

// ─────────────────────────────────────────────
// UTILISATEUR & AUTHENTIFICATION
// ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: "admin" | "supervisor" | "employee";
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ─────────────────────────────────────────────
// EMPLOYÉ
// ─────────────────────────────────────────────

export interface Employee {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  role: "admin" | "supervisor" | "employee";
  hourly_rate: number | null;
  status: "active" | "inactive";
  phone?: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// PROJET
// ─────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  address: string | null;
  client_name?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  description?: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// TEMPS / PUNCH
// ─────────────────────────────────────────────

export interface TimeEntry {
  id: string;
  employee_id: string;
  project_id: string | null;
  punch_in_time: string;
  punch_out_time: string | null;
  notes?: string | null;
  created_at: string;
  // -- Relations
  employee?: Employee;
  project?: Project;
}

// ─────────────────────────────────────────────
// FACTURE
// ─────────────────────────────────────────────

export interface Invoice {
  id: string;
  invoice_number: string;
  project_id: string | null;
  client_name?: string | null;
  amount: number;
  tax_rate?: number | null;
  total_with_tax?: number | null;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  due_date?: string | null;
  notes?: string | null;
  created_at: string;
  // -- Relations
  project?: Project;
}

// ─────────────────────────────────────────────
// MATÉRIAUX
// ─────────────────────────────────────────────

export interface Material {
  id: string;
  name: string;
  sku: string | null;
  description?: string | null;
  unit?: string | null;
  price_tier_1: number | null; // -- Prix régulier
  price_tier_2: number | null; // -- Prix contracteur
  price_tier_3: number | null; // -- Prix volume
  stock_quantity?: number | null;
  created_at: string;
}

// ─────────────────────────────────────────────
// KPI (Dashboard)
// ─────────────────────────────────────────────

export interface DashboardKPIs {
  totalRevenue: number;
  monthlyRevenue: number;
  activeProjects: number;
  completedProjects: number;
  totalEmployees: number;
  activeEmployees: number;
  pendingInvoices: number;
  paidInvoices: number;
  averageHourlyRate: number;
  totalHoursThisMonth: number;
}

// ─────────────────────────────────────────────
// AI CHAT
// ─────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  debug?: string;
}

export interface AIResponse {
  success: boolean;
  response: string;
  debug?: string;
  error?: string;
}

// ─────────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
};

// ─────────────────────────────────────────────
// STATUTS (pour UI)
// ─────────────────────────────────────────────

export const PROJECT_STATUSES = {
  pending: { label: "En attente", color: "yellow" },
  in_progress: { label: "En cours", color: "blue" },
  completed: { label: "Terminé", color: "green" },
  cancelled: { label: "Annulé", color: "red" },
} as const;

export const INVOICE_STATUSES = {
  draft: { label: "Brouillon", color: "gray" },
  sent: { label: "Envoyée", color: "blue" },
  paid: { label: "Payée", color: "green" },
  overdue: { label: "En retard", color: "red" },
  cancelled: { label: "Annulée", color: "gray" },
} as const;

export const EMPLOYEE_ROLES = {
  admin: { label: "Administrateur", color: "purple" },
  supervisor: { label: "Superviseur", color: "blue" },
  employee: { label: "Employé", color: "green" },
} as const;
