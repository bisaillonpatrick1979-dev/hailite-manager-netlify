// -- 🛠️ Fonctions utilitaires pour HailiteManager

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// -- Helper Tailwind: combine classes proprement
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -- Formatage monétaire (CAD)
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "$0.00";
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

// -- Formatage date française
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

// -- Formatage date courte
export function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dateString));
}

// -- Formatage datetime
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

// -- Calcul d'heures entre deux timestamps
export function calculateHours(
  punchIn: string,
  punchOut: string | null
): number {
  if (!punchOut) return 0;
  const diff =
    new Date(punchOut).getTime() - new Date(punchIn).getTime();
  return Math.round((diff / 3600000) * 100) / 100; // -- Arrondir à 2 décimales
}

// -- Formatage heures (ex: 7.5 → "7h 30min")
export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const min = Math.round((hours - h) * 60);
  if (min === 0) return `${h}h`;
  return `${h}h ${min}min`;
}

// -- Générer numéro de facture
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${year}${month}-${random}`;
}

// -- Truncate texte
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

// -- Initiales d'un nom
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// -- Couleur selon statut projet
export function getProjectStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// -- Couleur selon statut facture
export function getInvoiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-500",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// -- Label statut projet (français)
export function getProjectStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "En attente",
    in_progress: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  };
  return labels[status] || status;
}

// -- Label statut facture (français)
export function getInvoiceStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Brouillon",
    sent: "Envoyée",
    paid: "Payée",
    overdue: "En retard",
    cancelled: "Annulée",
  };
  return labels[status] || status;
}
