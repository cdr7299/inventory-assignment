import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import { useProducts, useProductFilters } from "@/hooks";
import { ProductTable } from "@/routes/products/-components/product-table";
import { ProductPagination } from "@/routes/products/-components/product-pagination";
import { ProductFilters } from "@/routes/products/-components/product-filters";
import { ProductPageHeader } from "@/routes/products/-components/product-page-header";
import type { ProductsSearch } from "@/types/product";

const searchParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  sortBy: z.enum(["price", "stock", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    const result = searchParamsSchema.safeParse(search);
    return result.success ? result.data : {};
  },
});

function ProductsPage() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const { searchInput, selectedCategories, filters, handlers } =
    useProductFilters({
      searchParams,
      navigate,
    });
  const { data, isLoading, error, isFetching } = useProducts({
    page: searchParams.page || 1,
    limit: 12,
    filters,
  });
  const [previousTotalPages, setPreviousTotalPages] = useState(0);
  const currentTotalPages = data ? Math.ceil(data.total / 12) : 0;
  useEffect(() => {
    if (currentTotalPages > 0) {
      setPreviousTotalPages(currentTotalPages);
    }
  }, [currentTotalPages]);

  const totalPages =
    currentTotalPages > 0 ? currentTotalPages : previousTotalPages;
  console.log(totalPages);
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-shrink-0 space-y-4"
      >
        <ProductPageHeader />
        <ProductFilters
          searchInput={searchInput}
          selectedCategories={selectedCategories}
          isFetching={isFetching}
          onSearchChange={handlers.handleSearchChange}
          onCategoryChange={handlers.handleCategoriesChange}
          onRemoveCategory={handlers.onRemoveCategorySlug}
        />
      </motion.div>
      <div className="flex-1 flex flex-col min-h-0">
        <ProductTable
          products={data?.products || []}
          isLoading={isLoading}
          error={error}
          sortBy={searchParams.sortBy}
          sortOrder={searchParams.sortOrder}
          onSortChange={handlers.handleSortChange}
        />
      </div>
      <div className="flex-shrink-0 min-h-[72px] flex items-center">
        {totalPages > 1 && (
          <ProductPagination
            currentPage={searchParams.page || 1}
            totalPages={totalPages}
            onPageChange={handlers.handlePageChange}
            isLoading={isFetching}
          />
        )}
      </div>
    </div>
  );
}
