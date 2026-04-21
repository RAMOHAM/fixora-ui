"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getBookingCategoryMeta } from "@/app/shared/categoryConfig";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type BookingRow = {
  category: string;
  dateOfJob: string;
  bookingStatus: string;
  location?: string;
  professionalName?: string;
  revenueEUR?: number;
};

type Professional = {
    id: string;
    name: string;
    role: string;
    rating: number;
    status: "on-job" | "break" | "available";
};

const MOCK_PROS: Professional[] = [
    {
        id: "p1",
        name: "Sophie Chen",
        role: "HVAC Specialist",
        rating: 4.98,
        status: "on-job",
    },
    {id: "p2", name: "David Miller", role: "Carpenter", rating: 4.95, status: "break"},
    {id: "p3", name: "Lila Thorne", role: "Designer", rating: 4.92, status: "available"},
];

function StatusPill({status}: { status: string }) {
    const cfg =
        status === "PENDING"
            ? {labelTop: "PENDING", cls: "bg-indigo-100 text-indigo-700"}
            : status === "SCHEDULED"
                ? {labelTop: "SCHEDULED", cls: "bg-slate-100 text-slate-700"}
                : {labelTop: "COMPLETED", cls: "bg-emerald-100 text-emerald-700"};

    return (
        <div
            className={cn(
                "inline-flex flex-col items-center justify-center rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wide",
                cfg.cls
            )}
        >
            <span>{cfg.labelTop}</span>
        </div>
    );
}

function AvatarDot({seed}: { seed: string }) {
    const c = seed.charCodeAt(0) % 360;
    return (
        <div className="relative">
            <div
                className="grid size-8 place-items-center rounded-full ring-1 ring-black/5"
                style={{
                    background: `hsl(${c} 70% 90%)`,
                }}
            >
        <span className="text-xs font-semibold text-slate-700">
          {seed
              .split(" ")
              .slice(0, 2)
              .map((s) => s[0])
              .join("")}
        </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-white"/>
        </div>
    );
}

function ProStatusBadge({status}: { status: Professional["status"] }) {
    const cfg =
        status === "on-job"
            ? {label: "On-job", cls: "bg-emerald-100 text-emerald-700"}
            : status === "break"
                ? {label: "Break", cls: "bg-slate-100 text-slate-700"}
                : {label: "Available", cls: "bg-amber-100 text-amber-700"};

    return (
        <span className={cn("rounded-md px-2 py-1 text-[11px] font-semibold", cfg.cls)}>
      {cfg.label}
    </span>
    );
}

function RowActionsMenu({
  bookingKey,
  openId,
  setOpenId,
}: {
  bookingKey: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
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
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpenId(null);
      }
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
  }, [open, setOpenId]);

  const items = useMemo(
    () => [
      { id: "view-video", label: "View video" },
      { id: "confirm", label: "Confirm Appointment" },
      { id: "details", label: "See More Details" },
    ],
    []
  );

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
              aria-label="Booking actions"
              className={cn(
                "fixed z-[9999] w-56 overflow-hidden rounded-xl bg-white",
                "ring-1 ring-black/10 shadow-xl"
              )}
              style={{ top: pos.top, right: pos.right }}
            >
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  role="menuitem"
                  type="button"
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm font-medium text-slate-800",
                    "hover:bg-slate-50 focus:bg-slate-50 focus:outline-none",
                    idx !== 0 && "border-t border-black/5"
                  )}
                  onClick={() => {
                    setOpenId(null);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // get all bookings on page load from backend API
    useEffect(() => {
        const fetchAllBookings = async () => {
            setIsLoading(true);
            try {
                const bookingAPIResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/api/booking`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!bookingAPIResponse.ok) {
                    throw new Error("Failed to fetch bookings");
                }
                const bookings = await bookingAPIResponse.json();
                setBookings(bookings);
                console.log("Bookings fetched successfully:", bookings);
            } catch (e) {
                console.error("Error fetching bookings:", e);
            } finally {
                setIsLoading(false);
            }

        }
        fetchAllBookings();
    }, [])

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card className="bg-white ring-1 ring-black/5">
                <div className="flex items-center justify-between px-6 pt-6">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
                    <Button variant="ghost" className="text-sm font-semibold text-slate-600">
                        View all
                    </Button>
                </div>

                <div className="mt-4">
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
                        {bookings.map((booking, idx) => (
                            <tr key={idx} className={cn(idx !== 0 && "border-t border-black/5")}>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const meta = getBookingCategoryMeta(booking.category);
                                            const Icon = meta.icon;
                                            return (
                                                <div
                                                    className={cn(
                                                        "grid size-9 place-items-center rounded-xl border ring-1 ring-black/5",
                                                        meta.surfaceClass
                                                    )}
                                                >
                                                    <Icon className={cn("size-4", meta.accentClass)} />
                                                </div>
                                            );
                                        })()}
                                        <div className="min-w-0 leading-tight">
                                            <div className="font-semibold text-slate-900">
                                                {(() => {
                                                    const meta = getBookingCategoryMeta(booking.category);
                                                    return meta.label;
                                                })()}
                                            </div>
                                            {booking.location ? (
                                                <div className="text-sm text-slate-500">{booking.location}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        {/*TODO - replace with professionals*/}
                                        <AvatarDot seed={booking.professionalName ?? "Test Name"}/>
                                        <div className="font-semibold text-slate-800">
                                            {booking.professionalName ?? "Test Name"}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-5">
                                    <StatusPill status={booking.bookingStatus}/>
                                </td>

                                <td className="px-6 py-5 font-semibold text-slate-900">
                                    {booking.dateOfJob}
                                </td>

                                <td className="px-6 py-5 text-right">
                                  <RowActionsMenu
                                    bookingKey={`${idx}`}
                                    openId={openMenuId}
                                    setOpenId={setOpenMenuId}
                                  />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="h-6"/>
            </Card>

            <Card className="bg-white ring-1 ring-black/5">
                <div className="px-6 pt-6">
                    <h2 className="text-lg font-semibold text-slate-900">Top Professionals</h2>
                </div>

                <div className="mt-4 space-y-4 px-6 pb-6">
                    {MOCK_PROS.map((p) => (
                        <div key={p.id} className="flex items-center gap-3">
                            <AvatarDot seed={p.name}/>
                            <div className="min-w-0 flex-1">
                                <div className="truncate font-semibold text-slate-900">{p.name}</div>
                                <div className="truncate text-sm text-slate-500">
                                    {p.role} • {p.rating.toFixed(2)} ★
                                </div>
                            </div>
                            <ProStatusBadge status={p.status}/>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        className="mt-3 h-10 w-full rounded-xl font-semibold tracking-wide"
                    >
                        Manage Team
                    </Button>
                </div>
            </Card>
        </div>
    );
}
