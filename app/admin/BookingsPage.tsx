"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import BookingDetailsModal from "@/app/admin/BookingDetailsModal";
import ConfirmBookingModal from "@/app/admin/ConfirmBookingModal";
import {
  BookingRow,
  BookingStatus,
  getBookingId,
  getBookingProfessionalId,
  getProfessionalId,
  Professional,
} from "@/app/admin/types";
import { getBookingCategoryMeta } from "@/app/shared/categoryConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BookingFilter = "ALL" | BookingStatus;

type BookingsApiResponse =
  | BookingRow[]
  | {
      bookings?: BookingRow[];
      items?: BookingRow[];
      data?: BookingRow[];
      total?: number;
      totalPages?: number;
      page?: number;
      limit?: number;
    };

type ProfessionalsApiResponse =
  | Professional[]
  | {
      professionals?: Professional[];
      items?: Professional[];
      data?: Professional[];
    };

const STATUS_FILTERS: Array<{ id: BookingFilter; label: string }> = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
];

const BOOKING_STATUS_META: Record<
  string,
  { label: string; cls: string; icon: LucideIcon }
> = {
  PENDING: { label: "Pending", cls: "bg-indigo-100 text-indigo-700", icon: BriefcaseBusiness },
  CONFIRMED: { label: "Confirmed", cls: "bg-emerald-100 text-emerald-700", icon: UserCheck },
  COMPLETED: { label: "Completed", cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", cls: "bg-rose-100 text-rose-700", icon: XCircle },
};

function getBookingsFromResponse(payload: BookingsApiResponse) {
  if (Array.isArray(payload)) return { rows: payload, total: payload.length, totalPages: 1 };

  const rows = payload.bookings ?? payload.items ?? payload.data ?? [];
  return {
    rows,
    total: payload.total ?? rows.length,
    totalPages: payload.totalPages,
  };
}

function getProfessionalsFromResponse(payload: ProfessionalsApiResponse) {
  if (Array.isArray(payload)) return payload;
  return payload.professionals ?? payload.items ?? payload.data ?? [];
}

function getPageSize() {
  if (typeof window === "undefined") return 6;
  if (window.innerWidth >= 1024) return 6;
  if (window.innerWidth >= 640) return 4;
  return 3;
}

function StatusPill({ status }: { status: string }) {
  const cfg = BOOKING_STATUS_META[status] ?? {
    label: status || "Unknown",
    cls: "bg-slate-100 text-slate-700",
    icon: BriefcaseBusiness,
  };
  const Icon = cfg.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        cfg.cls,
      )}
    >
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

function AvatarDot({ seed }: { seed: string }) {
  const c = seed.charCodeAt(0) % 360;
  return (
    <div className="relative">
      <div
        className="grid size-8 place-items-center rounded-full ring-1 ring-black/5"
        style={{ background: `hsl(${c} 70% 90%)` }}
      >
        <span className="text-xs font-semibold text-slate-700">
          {seed
            .split(" ")
            .slice(0, 2)
            .map((s) => s[0])
            .join("")}
        </span>
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
    </div>
  );
}

function ProStatusBadge({ status }: { status: Professional["status"] }) {
  const cfg =
    status === "on-job"
      ? { label: "On-job", cls: "bg-emerald-100 text-emerald-700" }
      : status === "break"
        ? { label: "Break", cls: "bg-slate-100 text-slate-700" }
        : status === "onboarding"
          ? { label: "Onboarding", cls: "bg-blue-100 text-blue-700" }
          : { label: "Available", cls: "bg-amber-100 text-amber-700" };

  return <span className={cn("rounded-md px-2 py-1 text-[11px] font-semibold", cfg.cls)}>{cfg.label}</span>;
}

function RowActionsMenu({
  bookingKey,
  status,
  openId,
  setOpenId,
  onConfirm,
  onViewDetails,
  onCancel,
  onDelete,
}: {
  bookingKey: string;
  status: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onConfirm: () => void;
  onViewDetails: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const open = openId === bookingKey;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!open) return;

    const updatePos = () => {
      const btn = buttonRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setPos({
        top: r.bottom + 8,
        right: Math.max(12, window.innerWidth - r.right),
      });
    };

    updatePos();

    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (el && el.contains(e.target as Node)) return;

      const menuEl = document.querySelector(`[data-booking-menu="${bookingKey}"]`);
      if (menuEl && menuEl.contains(e.target as Node)) return;

      setOpenId(null);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };

    window.addEventListener("resize", updatePos);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [bookingKey, open, setOpenId]);

  const items = [
    ...(status === "PENDING" ? [{ id: "confirm", label: "Confirm Appointment", icon: UserCheck, onClick: onConfirm }] : []),
    { id: "details", label: "See More Details", icon: Eye, onClick: onViewDetails },
    ...(status !== "CANCELLED" && status !== "COMPLETED"
      ? [{ id: "cancel", label: "Cancel Booking", icon: XCircle, onClick: onCancel }]
      : []),
    { id: "delete", label: "Delete Booking", icon: Trash2, onClick: onDelete },
  ];

  return (
    <div className="relative inline-flex justify-end" ref={rootRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpenId(open ? null : bookingKey)}
      >
        <MoreHorizontal />
      </Button>

      {open && pos
        ? createPortal(
            <div
              role="menu"
              data-booking-menu={bookingKey}
              aria-label="Booking actions"
              className="fixed z-[9999] w-56 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/10"
              style={{ top: pos.top, right: pos.right }}
            >
              {items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    role="menuitem"
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-slate-800",
                      "hover:bg-slate-50 focus:bg-slate-50 focus:outline-none",
                      item.id === "cancel" && "text-rose-700",
                      item.id === "delete" && "text-rose-700",
                      idx !== 0 && "border-t border-black/5",
                    )}
                    onClick={() => {
                      setOpenId(null);
                      item.onClick();
                    }}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function BookingServiceCell({ booking }: { booking: BookingRow }) {
  const meta = getBookingCategoryMeta(booking.category);
  const Icon = meta.icon;

  return (
    <div className="flex items-center gap-3">
      <div className={cn("grid size-9 place-items-center rounded-lg border ring-1 ring-black/5", meta.surfaceClass)}>
        <Icon className={cn("size-4", meta.accentClass)} />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="font-semibold text-slate-900">{meta.label}</div>
        <div className="truncate text-xs text-slate-500">{booking.customerName || booking.email || "Customer"}</div>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  professionalName,
  openMenuId,
  setOpenMenuId,
  onConfirm,
  onViewDetails,
  onCancel,
  onDelete,
}: {
  booking: BookingRow;
  professionalName: string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onConfirm: () => void;
  onViewDetails: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const bookingKey = getBookingId(booking) || `${booking.category}-${booking.dateOfJob}`;

  return (
    <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <BookingServiceCell booking={booking} />
        <RowActionsMenu
          bookingKey={bookingKey}
          status={booking.bookingStatus}
          openId={openMenuId}
          setOpenId={setOpenMenuId}
          onConfirm={onConfirm}
          onViewDetails={onViewDetails}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </div>
      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</span>
          <StatusPill status={booking.bookingStatus} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Professional</span>
          <span className="truncate text-sm font-semibold text-slate-800">{professionalName}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date</span>
          <span className="text-sm font-semibold text-slate-900">{booking.dateOfJob}</span>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [confirmBooking, setConfirmBooking] = useState<BookingRow | null>(null);
  const [activeStatus, setActiveStatus] = useState<BookingFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [serverTotalPages, setServerTotalPages] = useState<number | null>(null);

  useEffect(() => {
    setPageSize(getPageSize());

    const onResize = () => setPageSize(getPageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      if (activeStatus !== "ALL") params.set("status", activeStatus);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      const res = await fetch(`/api/booking?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        toast.error("Could not load bookings.");
        return;
      }

      const payload = (await res.json()) as BookingsApiResponse;
      const parsed = getBookingsFromResponse(payload);
      setBookings(parsed.rows);
      setServerTotal(parsed.total);
      setServerTotalPages(parsed.totalPages ?? null);
    } catch (e) {
      console.error("Error fetching bookings:", e);
      toast.error("Something went wrong while loading bookings.");
    } finally {
      setIsLoadingBookings(false);
    }
  }, [activeStatus, page, pageSize, searchTerm]);

  const fetchProfessionals = useCallback(async () => {
    setIsLoadingProfessionals(true);
    try {
      const res = await fetch("/api/professionals", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) return;

      const payload = (await res.json()) as ProfessionalsApiResponse;
      setProfessionals(getProfessionalsFromResponse(payload));
    } catch (e) {
      console.error("Error fetching professionals:", e);
    } finally {
      setIsLoadingProfessionals(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  useEffect(() => {
    setPage(1);
  }, [activeStatus, pageSize]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setPage(1), 250);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return bookings.filter((booking) => {
      const statusMatches = activeStatus === "ALL" || booking.bookingStatus === activeStatus;
      if (!statusMatches) return false;
      if (!normalizedSearch) return true;

      return [
        booking.category,
        booking.customerName,
        booking.email,
        booking.phone,
        booking.address,
        booking.professionalName,
        booking.jobDescription,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }, [activeStatus, bookings, searchTerm]);

  const clientPageCount = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const pageCount = serverTotalPages ?? clientPageCount;
  const visibleBookings = serverTotalPages
    ? filteredBookings
    : filteredBookings.slice((page - 1) * pageSize, page * pageSize);
  const totalBookings = serverTotal ?? filteredBookings.length;
  const topProfessionals = professionals.slice(0, 5);
  const professionalsById = useMemo(() => {
    const map = new Map<string, Professional>();
    professionals.forEach((professional) => {
      const id = getProfessionalId(professional);
      if (id) map.set(id, professional);
    });
    return map;
  }, [professionals]);

  const getAssignedProfessionalName = useCallback(
    (booking: BookingRow) => {
      if (booking.professionalName) return booking.professionalName;
      console.log("booking", booking);
      const professionalId = getBookingProfessionalId(booking);
      if (!professionalId) return "Unassigned";

      return professionalsById.get(professionalId)?.workerName ?? professionalId;
    },
    [professionalsById],
  );

  const upsertBooking = (updatedBooking: BookingRow) => {
    const updatedId = getBookingId(updatedBooking);
    setBookings((current) =>
      current.map((booking) => (getBookingId(booking) === updatedId ? { ...booking, ...updatedBooking } : booking)),
    );
  };

  const cancelBooking = async (booking: BookingRow) => {
    const bookingId = getBookingId(booking);
    if (!bookingId) {
      toast.error("This booking cannot be cancelled yet.");
      return;
    }

    try {
      const res = await fetch(`/api/booking/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: "CANCELLED" }),
      });

      if (!res.ok) {
        toast.error("Could not cancel booking.");
        return;
      }

      let updatedBooking: BookingRow | null = null;
      try {
        updatedBooking = await res.json();
      } catch {
        updatedBooking = null;
      }
      upsertBooking(updatedBooking ?? { ...booking, bookingStatus: "CANCELLED" });
      toast.success("Booking cancelled.");
    } catch {
      toast.error("Something went wrong while cancelling the booking.");
    }
  };

  const deleteBooking = async (booking: BookingRow) => {
    const bookingId = getBookingId(booking);
    if (!bookingId) {
      toast.error("This booking cannot be deleted yet.");
      return;
    }

    if (!window.confirm("Delete this booking permanently?")) return;

    try {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
        }),
      });

      if (!res.ok) {
        toast.error("Could not delete booking.");
        return;
      }

      setBookings((current) => current.filter((item) => getBookingId(item) !== bookingId));
      setServerTotal((current) => (current === null ? current : Math.max(0, current - 1)));
      toast.success("Booking deleted.");
    } catch {
      toast.error("Something went wrong while deleting the booking.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
      <ConfirmBookingModal
        booking={confirmBooking}
        professionals={professionals}
        isOpen={!!confirmBooking}
        onClose={() => setConfirmBooking(null)}
        onConfirmed={upsertBooking}
      />

      <Card className="bg-white ring-1 ring-black/5">
        <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Bookings</h2>
              <p className="text-sm text-slate-500">{totalBookings} bookings found</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search bookings"
                  className="h-9 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-56"
                />
              </label>
              <Button variant="outline" onClick={fetchBookings} disabled={isLoadingBookings}>
                <RefreshCw className={cn("size-4", isLoadingBookings && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveStatus(filter.id)}
                className={cn(
                  "h-8 rounded-lg border px-3 text-sm font-semibold transition",
                  activeStatus === filter.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-[11px] font-bold tracking-[0.16em] text-slate-400">
                <th className="px-6 py-3">SERVICE TYPE</th>
                <th className="px-6 py-3">PROFESSIONAL ASSIGNED</th>
                <th className="px-6 py-3">STATUS</th>
                <th className="px-6 py-3">DATE OF BOOKING</th>
                <th className="px-6 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {visibleBookings.map((booking) => {
                const bookingKey = getBookingId(booking) || `${booking.category}-${booking.dateOfJob}`;
                const professionalName = getAssignedProfessionalName(booking);
                return (
                  <tr key={bookingKey} className="border-t border-black/5">
                    <td className="px-6 py-5">
                      <BookingServiceCell booking={booking} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <AvatarDot seed={professionalName} />
                        <div className="truncate font-semibold text-slate-800">{professionalName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusPill status={booking.bookingStatus} />
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-900">{booking.dateOfJob}</td>
                    <td className="px-6 py-5 text-right">
                      <RowActionsMenu
                        bookingKey={bookingKey}
                        status={booking.bookingStatus}
                        openId={openMenuId}
                        setOpenId={setOpenMenuId}
                        onConfirm={() => setConfirmBooking(booking)}
                        onViewDetails={() => setSelectedBooking(booking)}
                        onCancel={() => cancelBooking(booking)}
                        onDelete={() => deleteBooking(booking)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-3 px-4 md:hidden">
          {visibleBookings.map((booking) => (
            <BookingCard
              key={getBookingId(booking) || `${booking.category}-${booking.dateOfJob}`}
              booking={booking}
              professionalName={getAssignedProfessionalName(booking)}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onConfirm={() => setConfirmBooking(booking)}
              onViewDetails={() => setSelectedBooking(booking)}
              onCancel={() => cancelBooking(booking)}
              onDelete={() => deleteBooking(booking)}
            />
          ))}
        </div>

        {!isLoadingBookings && visibleBookings.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-semibold text-slate-800">No bookings found</p>
            <p className="mt-1 text-sm text-slate-500">Try another status or search term.</p>
          </div>
        )}

        {isLoadingBookings && (
          <div className="px-6 py-12 text-center text-sm font-medium text-slate-500">Loading bookings...</div>
        )}

        <div className="flex flex-col gap-3 border-t border-black/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-500">
            Page {page} of {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={page <= 1 || isLoadingBookings} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= pageCount || isLoadingBookings}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-white ring-1 ring-black/5">
        <div className="px-6 pt-6">
          <h2 className="text-lg font-semibold text-slate-900">Available Professionals</h2>
          <p className="mt-1 text-sm text-slate-500">Quick view for assignment readiness.</p>
        </div>

        <div className="mt-4 space-y-4 px-6 pb-6">
          {topProfessionals.map((p) => (
            <div key={getProfessionalId(p)} className="flex items-center gap-3">
              <AvatarDot seed={p.workerName} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-slate-900">{p.workerName}</div>
                <div className="truncate text-sm text-slate-500">
                  {getBookingCategoryMeta(p.category).label}
                  {p.rating ? ` · ${p.rating.toFixed(2)} rating` : ""}
                </div>
              </div>
              <ProStatusBadge status={p.status} />
            </div>
          ))}

          {!isLoadingProfessionals && topProfessionals.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No professionals added yet.</p>
          )}

          <Button variant="outline" className="mt-3 h-10 w-full rounded-lg font-semibold tracking-wide">
            Manage Team
          </Button>
        </div>
      </Card>
    </div>
  );
}
