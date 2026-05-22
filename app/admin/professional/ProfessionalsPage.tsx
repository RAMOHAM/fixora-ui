"use client";

import { ProfessionalsGridList } from "@/app/admin/professional/ProfessionalGridList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getProfessionalId, Professional } from "@/app/admin/types";
import { toast } from "sonner";

const AddProfessionalFormModal = dynamic(
  () => import("@/app/admin/professional/AddProfessionalFormModal"),
  { ssr: false, loading: () => null },
);

const PROFESSIONALS_PER_PAGE = 9;

type ProfessionalsApiResponse =
  | Professional[]
  | {
      professionals?: Professional[];
      items?: Professional[];
      data?: Professional[];
    };

function getProfessionalsFromResponse(payload: ProfessionalsApiResponse) {
  if (Array.isArray(payload)) return payload;
  return payload.professionals ?? payload.items ?? payload.data ?? [];
}

export default function ProfessionalsPage() {
  const [isAddProfessionalModalOpen, setIsAddProfessionalModalOpen] =
    useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit">(
    "create",
  );
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [professionalsList, setProfessionalsList] = useState<Professional[]>(
    [],
  );
  const [page, setPage] = useState(1);
  // get all bookings on page load from backend API
  useEffect(() => {
    const fetchAllProfessionals = async () => {
      setIsLoading(true);
      try {
        const professionalListAPIResponse = await fetch("/api/professionals", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (professionalListAPIResponse.ok) {
          const professionals =
            (await professionalListAPIResponse.json()) as ProfessionalsApiResponse;
          setProfessionalsList(getProfessionalsFromResponse(professionals));
        }
      } catch (e) {
        console.error("Error fetching bookings:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProfessionals();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(professionalsList.length / PROFESSIONALS_PER_PAGE),
  );
  const visibleProfessionals = useMemo(() => {
    const start = (page - 1) * PROFESSIONALS_PER_PAGE;
    return professionalsList.slice(start, start + PROFESSIONALS_PER_PAGE);
  }, [page, professionalsList]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const openCreateModal = () => {
    setSelectedProfessional(null);
    setModalMode("create");
    setIsAddProfessionalModalOpen(true);
  };

  const openViewModal = (professional: Professional) => {
    setSelectedProfessional(professional);
    setModalMode("view");
    setIsAddProfessionalModalOpen(true);
  };

  const openEditModal = (professional: Professional) => {
    setSelectedProfessional(professional);
    setModalMode("edit");
    setIsAddProfessionalModalOpen(true);
  };

  const handleSavedProfessional = (professional: Professional) => {
    const savedId = getProfessionalId(professional);
    setProfessionalsList((current) => {
      const exists = current.some(
        (item) => getProfessionalId(item) === savedId,
      );
      if (!exists) return [professional, ...current];
      return current.map((item) =>
        getProfessionalId(item) === savedId
          ? { ...item, ...professional }
          : item,
      );
    });
    setPage(1);
  };

  const deleteProfessional = async (professional: Professional) => {
    const professionalId = getProfessionalId(professional);
    if (!professionalId) {
      toast.error("This professional cannot be deleted yet.");
      return;
    }

    if (!window.confirm(`Delete ${professional.workerName}?`)) return;

    try {
      const res = await fetch(`/api/professionals/${professionalId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
          toast.error("Could not delete professional.");
          return;
      }

      setProfessionalsList((current) =>
        current.filter((item) => getProfessionalId(item) !== professionalId),
      );
      toast.success("Professional deleted.");
    } catch {
      toast.error("Something went wrong while deleting the professional.");
    }
  };

  return (
    <div className="bg-gray-50">
      {/*Add Professional Modal */}
      <AddProfessionalFormModal
        isOpen={isAddProfessionalModalOpen}
        onClose={() => {
          setIsAddProfessionalModalOpen(false);
        }}
        mode={modalMode}
        professional={selectedProfessional}
        onSaved={handleSavedProfessional}
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
              Manage, vet, and oversee your elite fleet of home service
              specialists across all regions.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              className="flex items-center bg-secondary hover:bg-gray-800 text-white rounded-2xl px-5 py-2.5 h-auto text-sm font-semibold gap-2 shadow-sm transition-colors"
              onClick={openCreateModal}
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span>Add New Professional</span>
            </Button>
          </div>
        </div>
        <ProfessionalsGridList
          professionals={visibleProfessionals}
          isLoading={loading}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={deleteProfessional}
        />
        {!loading && professionalsList.length > PROFESSIONALS_PER_PAGE && (
          <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-gray-500">
              Showing {(page - 1) * PROFESSIONALS_PER_PAGE + 1}-
              {Math.min(
                page * PROFESSIONALS_PER_PAGE,
                professionalsList.length,
              )}{" "}
              of {professionalsList.length} professionals
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-lg"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                aria-label="Previous professionals page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="min-w-20 text-center text-sm font-semibold text-gray-700">
                Page {page} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-lg"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages}
                aria-label="Next professionals page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
