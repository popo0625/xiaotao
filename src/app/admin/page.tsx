import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AdminDashboardContent } from "./AdminDashboardContent";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
