import { ProfessionalCard } from "./ProfessionalCard";
import { Professional } from "@/app/admin/types";

export function ProfessionalsGridList({
  professionals,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: {
  professionals: Professional[];
  isLoading?: boolean;
  onView: (professional: Professional) => void;
  onEdit: (professional: Professional) => void;
  onDelete: (professional: Professional) => void;
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm font-medium text-gray-500">
        Loading professionals...
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-8 text-center">
        <p className="font-semibold text-gray-900">No professionals yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Add your first professional to start assigning bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {professionals.map((pro: Professional, index: number) => (
        <ProfessionalCard
          key={pro.id ?? pro._id ?? index}
          professional={pro}
          onView={() => onView(pro)}
          onEdit={() => onEdit(pro)}
          onDelete={() => onDelete(pro)}
        />
      ))}
    </div>
  );
}
