import { useMemo } from "react";
import { ProductTableCore } from "./product-table-core";
import { createProductTableColumns } from "./table-columns";
import type { Product, ProductSortField, SortOrder } from "@/types/product";

interface ProductTableContainerProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  sortBy?: ProductSortField;
  sortOrder?: SortOrder;
  onSortChange?: (sortBy: ProductSortField) => void;
}

export function ProductTableContainer({
  products,
  isLoading,
  error,
  sortBy,
  sortOrder,
  onSortChange,
}: ProductTableContainerProps) {
  const columns = useMemo(
    () =>
      createProductTableColumns({
        sortBy,
        sortOrder,
        onSortChange,
      }),
    [sortBy, sortOrder, onSortChange]
  );

  return (
    <ProductTableCore
      data={products}
      columns={columns}
      isLoading={isLoading}
      error={error}
    />
  );
}
