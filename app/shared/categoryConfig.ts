import type { LucideIcon } from "lucide-react";
import { Brush, PaintRoller, Plug, Wrench } from "lucide-react";

export type BookingCategoryId = "cleaning" | "painting" | "plumbing" | "electrical";

export type BookingCategoryMeta = {
  id: BookingCategoryId;
  label: string;
  icon: LucideIcon;
  /** Background + border color for badges (admin list, etc.) */
  surfaceClass: string;
  /** Text/icon color */
  accentClass: string;
  /** Stronger selected state for form tiles */
  selectedSurfaceClass: string;
  /** Colored ring for selected state */
  selectedRingClass: string;
};

export const BOOKING_CATEGORIES: BookingCategoryMeta[] = [
  {
    id: "cleaning",
    label: "Cleaning",
    icon: Brush,
    surfaceClass: "bg-sky-50 border-sky-200",
    accentClass: "text-sky-700",
    selectedSurfaceClass: "bg-sky-100 border-sky-500",
    selectedRingClass: "ring-sky-200",
  },
  {
    id: "painting",
    label: "Painting",
    icon: PaintRoller,
    surfaceClass: "bg-violet-50 border-violet-200",
    accentClass: "text-violet-700",
    selectedSurfaceClass: "bg-violet-100 border-violet-500",
    selectedRingClass: "ring-violet-200",
  },
  {
    id: "plumbing",
    label: "Plumbing",
    icon: Wrench,
    surfaceClass: "bg-amber-50 border-amber-200",
    accentClass: "text-amber-800",
    selectedSurfaceClass: "bg-amber-100 border-amber-500",
    selectedRingClass: "ring-amber-200",
  },
  {
    id: "electrical",
    label: "Electrical",
    icon: Plug,
    surfaceClass: "bg-emerald-50 border-emerald-200",
    accentClass: "text-emerald-700",
    selectedSurfaceClass: "bg-emerald-100 border-emerald-500",
    selectedRingClass: "ring-emerald-200",
  },
];

function normalizeCategory(input: string) {
  return input.trim().toLowerCase();
}

export function getBookingCategoryMeta(category: unknown): BookingCategoryMeta {
  const raw = typeof category === "string" ? normalizeCategory(category) : "";
  const meta =
    BOOKING_CATEGORIES.find((c) => c.id === raw) ??
    BOOKING_CATEGORIES.find((c) => normalizeCategory(c.label) === raw);

  return (
    meta ?? {
      id: "cleaning",
      label: typeof category === "string" && category.trim() ? category.trim() : "Unknown",
      icon: Brush,
      surfaceClass: "bg-slate-50 border-slate-200",
      accentClass: "text-slate-700",
      selectedSurfaceClass: "bg-slate-100 border-slate-400",
      selectedRingClass: "ring-slate-200",
    }
  );
}

