import { ProfessionalCard } from "./ProfessionalCard";
import { Professional } from "@/app/admin/professional/ProfessionalsPage";

export function ProfessionalsGridList({ professionals } : { professionals: Professional[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionals.map((pro: Professional, index: number) => (
                <ProfessionalCard
                    key={index}
                    professional={pro}
                />
            ))}
        </div>
    );
}