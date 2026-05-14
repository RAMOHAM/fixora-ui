"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Loader2, MapPin, UserCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getBookingCategoryMeta } from "@/app/shared/categoryConfig";
import { BookingRow, getBookingId, getProfessionalId, Professional } from "@/app/admin/types";

type ConfirmBookingModalProps = {
  booking: BookingRow | null;
  professionals: Professional[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: (booking: BookingRow) => void;
};

const CONFIRM_BOOKING_PATH = "/api/booking";

function professionalIsAssignable(professional: Professional, booking: BookingRow) {
  const proCategory = professional.category?.trim().toLowerCase();
  const bookingCategory = booking.category?.trim().toLowerCase();
  const status = professional.status ?? "available";

  return proCategory === bookingCategory && status !== "on-job" && status !== "break";
}

export default function ConfirmBookingModal({
  booking,
  professionals,
  isOpen,
  onClose,
  onConfirmed,
}: ConfirmBookingModalProps) {
  const [professionalId, setProfessionalId] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignableProfessionals = useMemo(() => {
    if (!booking) return [];
    return professionals.filter((professional) => professionalIsAssignable(professional, booking));
  }, [booking, professionals]);

  useEffect(() => {
    if (!isOpen) return;
    setProfessionalId("");
    setAdminNotes("");
  }, [isOpen, booking]);

  if (!booking) return null;

  const bookingId = getBookingId(booking);
  const categoryMeta = getBookingCategoryMeta(booking.category);
  const CategoryIcon = categoryMeta.icon;

  const confirmBooking = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;
    if (!baseUrl) {
      toast.error("Backend URL is not configured (NEXT_PUBLIC_BACKEND_SERVER_URL).");
      return;
    }
    if (!bookingId) {
      toast.error("This booking is missing an id, so it cannot be confirmed yet.");
      return;
    }
    if (!professionalId) {
      toast.error("Choose a professional before confirming the booking.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}${CONFIRM_BOOKING_PATH}/${bookingId}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId,
          bookingStatus: "SCHEDULED",
          adminNotes: adminNotes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        let message = "Could not confirm booking. Please try again.";
        try {
          const errBody = await res.json();
          if (typeof errBody?.message === "string") message = errBody.message;
        } catch {
          console.error("Error parsing booking confirmation response:", res.statusText);
        }
        toast.error(message);
        return;
      }

      let updatedBooking: BookingRow | null = null;
      try {
        updatedBooking = await res.json();
      } catch {
        updatedBooking = null;
      }

      const selectedProfessional = professionals.find(
        (professional) => getProfessionalId(professional) === professionalId,
      );

      onConfirmed(
        updatedBooking ?? {
          ...booking,
          bookingStatus: "SCHEDULED",
          professionalId,
          assignedProfessionalId: professionalId,
          professionalName: selectedProfessional?.workerName ?? booking.professionalName,
        },
      );
      toast.success("Booking confirmed and assigned.");
      onClose();
    } catch {
      toast.error("Something went wrong. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Confirm Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <section className="grid gap-3 rounded-lg border bg-white p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "grid size-10 place-items-center rounded-lg border ring-1 ring-black/5",
                  categoryMeta.surfaceClass,
                )}
              >
                <CategoryIcon className={cn("size-5", categoryMeta.accentClass)} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{categoryMeta.label}</p>
                <p className="line-clamp-2 text-sm text-slate-500">{booking.jobDescription}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-md bg-slate-50 p-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</p>
                  <p className="text-sm font-medium text-slate-800">{booking.address || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-md bg-slate-50 p-3">
                <Calendar className="mt-0.5 size-4 shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date</p>
                  <p className="text-sm font-medium text-slate-800">{booking.dateOfJob || "Not specified"}</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <UserCheck className="size-5" />
              <h3>Assign Professional</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalId">Professional</Label>
              <select
                id="professionalId"
                value={professionalId}
                onChange={(event) => setProfessionalId(event.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm font-medium shadow-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">Select a professional</option>
                {assignableProfessionals.map((professional) => (
                  <option key={getProfessionalId(professional)} value={getProfessionalId(professional)}>
                    {professional.workerName} · {professional.workerEmail}
                  </option>
                ))}
              </select>
              {assignableProfessionals.length === 0 && (
                <p className="text-sm text-amber-700">
                  No available professionals match this booking category yet.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin notes</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                placeholder="Optional notes for the professional"
                className="min-h-24"
              />
            </div>
          </section>
        </div>

        <DialogFooter className="mt-2 gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={confirmBooking}
            disabled={isSubmitting || !professionalId || assignableProfessionals.length === 0}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
