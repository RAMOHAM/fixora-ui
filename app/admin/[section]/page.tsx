import { Card } from "@/components/ui/card";

import AdminPageLayout from "../AdminPageLayout";
import BookingsPage from "../BookingsPage";
import ProfessionalsPage from "@/app/admin/professional/ProfessionalsPage";

const SECTION_TITLES: Record<string, string> = {
  bookings: "Bookings",
  professionals: "Professionals",
  revenue: "Revenue",
  analytics: "Analytics",
  settings: "Settings",
};

export default async function AdminSectionPage({params,}: { params: Promise<{ section: string }>; }) {
    const { section } = await params;
    console.log("section is now", section);

    console.log("section is now " + params);
    const renderSection = () => {
        switch (section) {
            case "bookings":
            case "":
                return <BookingsPage />;
            case "professionals":
                return <ProfessionalsPage />;
            default:
                return (
                    <Card className="bg-white ring-1 ring-black/5">
                        <div className="px-6 py-10">
                            <div className="text-lg font-semibold text-slate-900">
                                {SECTION_TITLES[section] ?? "Admin"}
                            </div>
                            <div className="mt-2 text-sm text-slate-500">
                                UI placeholder for this section.
                            </div>
                        </div>
                    </Card>
                );
        }
    };
    return <AdminPageLayout>{renderSection()}</AdminPageLayout>;
}