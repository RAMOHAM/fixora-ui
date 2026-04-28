import { ProfessionalCard } from "./ProfessionalCard";
import { Professional } from "@/app/admin/BookingsPage";

export function ProfessionalsGridList({ professionals } : { professionals: Professional[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionals.map((pro: Professional) => (
                <ProfessionalCard
                    key={pro.id}
                    professional={pro}
                />
            ))}
        </div>
    );
}