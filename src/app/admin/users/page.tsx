import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UsersPageContent } from "./UsersPageContent";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <UsersPageContent />
    </Suspense>
  );
}
