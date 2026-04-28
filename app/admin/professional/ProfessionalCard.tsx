"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ProfessionalAvatar } from "./ProfessionalAvatar";
import { Professional } from "@/app/admin/BookingsPage";

export function ProfessionalCard({ professional } : { professional: Professional } ) {
    const actionLabel = "View Profile";

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <ProfessionalAvatar professional={professional} />
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {professional.name}
                </h3>
                <p className="text-sm font-medium text-primary">{professional.role}</p>
            </div>
            <div className="flex items-center gap-2 pt-1">
                <Button
                    variant="outline"
                    className="flex-1 text-sm font-medium h-9 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                    {actionLabel}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-gray-200 hover:bg-gray-50 shrink-0"
                >
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                </Button>
            </div>
        </div>
    );
}