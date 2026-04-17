"use client";

import {MoreHorizontal} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";

type BookingStatus = "in-progress" | "scheduled" | "completed";

type BookingRow = {
    id: string;
    serviceType: string;
    location?: string;
    professionalName: string;
    status: BookingStatus;
    revenueEUR: number;
};

type Professional = {
    id: string;
    name: string;
    role: string;
    rating: number;
    status: "on-job" | "break" | "available";
};

const MOCK_BOOKINGS: BookingRow[] = [
    {
        id: "b1",
        serviceType: "Deep Clean",
        location: "(Villa)",
        professionalName: "Elena Rossi",
        status: "in-progress",
        revenueEUR: 240,
    },
    {
        id: "b2",
        serviceType: "Interior Painting",
        professionalName: "Marco V.",
        status: "scheduled",
        revenueEUR: 850,
    },
    {
        id: "b3",
        serviceType: "Emergency Plumbing",
        professionalName: "Julian Blake",
        status: "completed",
        revenueEUR: 185,
    },
];

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

function formatEUR(amount: number) {
    return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    }).format(amount);
}

function StatusPill({status}: { status: BookingStatus }) {
    const cfg =
        status === "in-progress"
            ? {labelTop: "IN-", labelBottom: "PROGRESS", cls: "bg-indigo-100 text-indigo-700"}
            : status === "scheduled"
                ? {labelTop: "SCHEDULED", labelBottom: "", cls: "bg-slate-100 text-slate-700"}
                : {labelTop: "COMPLETED", labelBottom: "", cls: "bg-emerald-100 text-emerald-700"};

    return (
        <div
            className={cn(
                "inline-flex flex-col items-center justify-center rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wide",
                cfg.cls
            )}
        >
            <span>{cfg.labelTop}</span>
            {cfg.labelBottom ? <span className="-mt-[2px]">{cfg.labelBottom}</span> : null}
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

export default function BookingsPage() {
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                if (bookingAPIResponse.ok) {
                    throw new Error("Failed to fetch bookings");
                }
                const bookings = await bookingAPIResponse.json();
                setBookings(bookings);
            }catch (e) {
                console.error("Error fetching bookings:", e);
            }finally {
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

                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-[760px] w-full border-separate border-spacing-0">
                        <thead>
                        <tr className="text-left text-[11px] font-bold tracking-[0.16em] text-slate-400">
                            <th className="px-6 py-3">SERVICE TYPE</th>
                            <th className="px-6 py-3">PROFESSIONAL ASSIGNED</th>
                            <th className="px-6 py-3">STATUS</th>
                            <th className="px-6 py-3">REVENUE</th>
                            <th className="px-6 py-3 text-right">ACTIONS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {MOCK_BOOKINGS.map((b, idx) => (
                            <tr key={b.id} className={cn(idx !== 0 && "border-t border-black/5")}>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="grid size-9 place-items-center rounded-xl bg-slate-100 ring-1 ring-black/5">
                        <span className="text-[10px] font-bold text-slate-500">
                          {b.serviceType
                              .split(" ")
                              .slice(0, 2)
                              .map((s) => s[0])
                              .join("")}
                        </span>
                                        </div>
                                        <div className="leading-tight">
                                            <div className="font-semibold text-slate-900">
                                                {b.serviceType}
                                            </div>
                                            {b.location ? (
                                                <div className="text-sm text-slate-500">{b.location}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <AvatarDot seed={b.professionalName}/>
                                        <div className="font-semibold text-slate-800">
                                            {b.professionalName}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-5">
                                    <StatusPill status={b.status}/>
                                </td>

                                <td className="px-6 py-5 font-semibold text-slate-900">
                                    {formatEUR(b.revenueEUR)}
                                </td>

                                <td className="px-6 py-5 text-right">
                                    <Button variant="ghost" size="icon" aria-label="More actions">
                                        <MoreHorizontal/>
                                    </Button>
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
