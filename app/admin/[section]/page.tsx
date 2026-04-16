import { Card } from "@/components/ui/card";

import AdminPageLayout from "../AdminPageLayout";
import BookingsPage from "../BookingsPage";

const SECTION_TITLES: Record<string, string> = {
  bookings: "Bookings",
  professionals: "Professionals",
  revenue: "Revenue",
  analytics: "Analytics",
  settings: "Settings",
};

export default function AdminSectionPage({
  params,
}: {
  params: { section: string };
}) {
  const { section } = params;

  return (
    <AdminPageLayout>
      {section === "bookings" || section === "analytics" ? (
        <BookingsPage />
      ) : (
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
      )}
    </AdminPageLayout>
  );
}

