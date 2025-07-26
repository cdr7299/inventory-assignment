import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/use-products";
import { ProductTable } from "@/components/products/product-table";
import { ProductPagination } from "@/components/products/product-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import type { ProductFilters } from "@/types/product";

interface ProductsSearch {
  search?: string;
  page?: number;
}

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    return {
      search: (search.search as string) || "",
      page: Number(search.page) || 1,
    };
  },
});

function ProductsPage() {
  const { search: searchParam, page } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [searchInput, setSearchInput] = useState(searchParam || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  const filters: ProductFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
    }),
    [debouncedSearch]
  );

  const { data, isLoading, error, isFetching } = useProducts({
    page: page || 1,
    limit: 12,
    filters,
  });

  // Preserve previous totalPages during navigation - don't reset to 0
  const [previousTotalPages, setPreviousTotalPages] = useState(0);

  const currentTotalPages = data ? Math.ceil(data.total / 12) : 0;

  // Update previousTotalPages when we get new data
  useEffect(() => {
    if (currentTotalPages > 0) {
      setPreviousTotalPages(currentTotalPages);
    }
  }, [currentTotalPages]);

  // Use current data if available, otherwise fall back to previous
  const totalPages =
    currentTotalPages > 0 ? currentTotalPages : previousTotalPages;

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Reset to page 1 when searching
    navigate({
      search: { search: value || undefined, page: 1 },
      replace: true,
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { search: searchInput || undefined, page: newPage },
      replace: true,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-shrink-0 space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Product Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage and view your product inventory with real-time data
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
            {isFetching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Table Container with consistent height */}
      <div className="flex-1 flex flex-col min-h-0">
        <ProductTable
          products={data?.products || []}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Pagination - Show when we have multiple pages */}
      <div className="flex-shrink-0 min-h-[72px] flex items-center">
        {totalPages > 1 && (
          <ProductPagination
            currentPage={page || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isFetching}
          />
        )}
      </div>
    </div>
  );
}
