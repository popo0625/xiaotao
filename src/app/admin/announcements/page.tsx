import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AnnouncementsPageContent } from "./AnnouncementsPageContent";

export default function AdminAnnouncementsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <AnnouncementsPageContent />
    </Suspense>
  );
}
