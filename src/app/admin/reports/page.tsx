import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReportsPageContent } from "./ReportsPageContent";

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <ReportsPageContent />
    </Suspense>
  );
}
