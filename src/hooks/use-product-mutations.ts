import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductApi, updateProductApi } from "@/lib/api/products";
import type { Product, ProductEditField } from "@/types/product";

export interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export function useCreateProductMutation(
  options: MutationOptions<Product> = {}
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Omit<Product, "id" | "meta">) =>
      createProductApi(productData),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products-client-side"] });
      options.onSuccess?.(newProduct);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}

interface UpdateProductResult {
  id: number;
  field: ProductEditField;
  value: string | number;
}

export function useUpdateProductMutation(
  options: MutationOptions<UpdateProductResult> = {}
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      field,
      value,
    }: {
      id: number;
      field: ProductEditField;
      value: string | number;
    }) => updateProductApi(id, field, value),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["products-client-side"] });
      options.onSuccess?.(result);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
