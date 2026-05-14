import { cn } from "@/lib/utils";
import { Professional } from "@/app/admin/professional/ProfessionalsPage";

export function ProfessionalAvatar({ professional, size = "md" }:  {professional: Professional, size?: "md" | "lg"}) {
    const sizes = {
        md: "w-16 h-16 text-lg",
        lg: "w-20 h-20 text-xl",
    };
    return (
        <div className="relative inline-block">
            <div
                className={cn(
                    "rounded-xl flex items-center justify-center font-bold text-white select-none",
                    sizes[size]
                )}
                style={{ backgroundColor: "#1b2d2d" }}
            >
                {"NA"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
                <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
    );
}