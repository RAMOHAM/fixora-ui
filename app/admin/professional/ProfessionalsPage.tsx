"use client";

import { ProfessionalsGridList } from "@/app/admin/professional/ProfessionalGridList";
import { Button } from "@base-ui/react";
import { UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

const AddProfessionalFormModal = dynamic(
    () => import("@/app/admin/professional/AddProfessionalFormModal"),
    { ssr: false, loading: () => null },
);

export type Professional = {
    id: string;
    workerName: string;
    workerEmail: string;
    category: string;
    phoneNumber: string;
    rating?: number;
    status?: "on-job" | "break" | "available" | "onboarding";
    avatarColor?: string;
};

export default function ProfessionalsPage() {
    const [isAddProfessionalModalOpen, setIsAddProfessionalModalOpen] = useState<boolean>(false);
    const [loading, setIsLoading] = useState<boolean>(true);
    const [professionalsList, setProfessionalsList] = useState<Professional[]>([]);
    // get all bookings on page load from backend API
    useEffect(() => {
        const fetchAllProfessionals = async () => {
            setIsLoading(true);
            try {
                const professionalListAPIResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/api/professionals`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (professionalListAPIResponse.ok) {
                    const professionals = await professionalListAPIResponse.json();
                    setProfessionalsList(professionals);
                }
            } catch (e) {
                console.error("Error fetching bookings:", e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAllProfessionals();
    }, [])
    return (
        <div className="bg-gray-50">
            {/*Add Professional Modal */}
            <AddProfessionalFormModal
                isOpen={isAddProfessionalModalOpen}
                onClose={() => {setIsAddProfessionalModalOpen(false)}}
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                            Directory &rsaquo;{" "}
                            <span className="text-primary">Professionals</span>
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Professional Network
                        </h1>
                        <p className="text-sm text-gray-500 max-w-sm mt-0.5">
                            Manage, vet, and oversee your elite fleet of home service specialists
                            across all regions.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button
                            className="flex items-center bg-secondary hover:bg-gray-800 text-white rounded-2xl px-5 py-2.5 h-auto text-sm font-semibold gap-2 shadow-sm transition-colors"
                            onClick={() => setIsAddProfessionalModalOpen(true)}
                        >
                            <UserPlus className="w-4 h-4 shrink-0" />
                            <span>Add New Professional</span>
                        </Button>
                    </div>
                </div>
                <ProfessionalsGridList
                    professionals={professionalsList}
                />
            </div>
        </div>
    );
}