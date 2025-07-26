import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type {
  ProductsApiResponse,
  Product,
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
  filters = {},
}: UseProductsParams): UseQueryResult<ProductsApiResponse, Error> {
  return useQuery({
    queryKey: ["products", { page, limit, filters }],
    queryFn: () => productsApi.fetchProducts({ page, limit, filters }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useProduct(id: number): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.fetchProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

export function useCategories(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productsApi.fetchCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
    retry: 2,
  });
}
