import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import MessagesPageContent from "./MessagesPageContent";

export const dynamic = "force-dynamic";

export default function MessagesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MessagesPageContent />
    </Suspense>
  );
}
