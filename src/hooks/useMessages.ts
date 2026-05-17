import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useConversations() {
  const { data, error, isLoading } = useSWR("/api/messages/conversations", fetcher, {
    refreshInterval: 5000,
  });

  return {
    conversations: data ?? [],
    isLoading,
    isError: error,
  };
}

export function useMessages(withUserId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    withUserId ? `/api/messages?withUserId=${withUserId}` : null,
    fetcher,
    { refreshInterval: 3000 }
  );

  return {
    messages: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
