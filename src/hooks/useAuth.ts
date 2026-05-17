import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user ?? null,
    isLoggedIn: status === "authenticated",
    isLoading: status === "loading",
  };
}
