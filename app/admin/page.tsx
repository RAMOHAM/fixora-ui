import BookingsPage from "./BookingsPage";
import AdminPageLayout from "./AdminPageLayout";

export default function AdminPage() {
  return (
    <AdminPageLayout>
      <BookingsPage />
    </AdminPageLayout>
  );
}