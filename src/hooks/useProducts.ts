import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ProductFilters {
  search?: string;
  category?: string;
  grade?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

export function useProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/products${query ? `?${query}` : ""}`,
    fetcher
  );

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.page ?? 1,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProduct(id: string) {
  const { data, error, isLoading } = useSWR(id ? `/api/products/${id}` : null, fetcher);

  return {
    product: data,
    isLoading,
    isError: error,
  };
}
