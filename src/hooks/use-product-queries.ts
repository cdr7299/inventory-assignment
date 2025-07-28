import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchAllProducts, fetchCategories } from "@/lib/api/products";
import { processProductsClientSide } from "@/lib/services/product-data";
import type {
  ProductsApiResponse,
  ProductFilters,
  PaginationParams,
  Category,
} from "@/types/product";

interface UseProductsParams extends PaginationParams {
  filters?: ProductFilters;
}

export function useProducts({
  page = 1,
  limit = 10,
  filters = { selectedCategories: [] },
}: UseProductsParams): UseQueryResult<ProductsApiResponse, Error> {
  const apiProductsQuery = useQuery({
    queryKey: ["all-api-products"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const processedQuery = useQuery({
    queryKey: ["products-client-side", { page, limit, filters }],
    queryFn: () => {
      return processProductsClientSide(apiProductsQuery.data!, filters, {
        page,
        limit,
      });
    },
    enabled: apiProductsQuery.isSuccess,
    staleTime: 0,
  });

  return {
    ...processedQuery,
    isLoading:
      apiProductsQuery.isLoading ||
      (apiProductsQuery.isSuccess && processedQuery.isLoading),
    isFetching: apiProductsQuery.isFetching || processedQuery.isFetching,
    error: apiProductsQuery.error || processedQuery.error,
    isError: apiProductsQuery.isError || processedQuery.isError,
  } as UseQueryResult<ProductsApiResponse, Error>;
}

export function useCategories(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
}
