import { useState, useMemo } from "react";
import { useDebounce } from "./use-debounce";
import type { ProductFilters, ProductsSearch } from "@/types/product";

interface UseProductFiltersProps {
  searchParams: ProductsSearch;
  navigate: (options: { search: ProductsSearch; replace?: boolean }) => void;
}

export function useProductFilters({
  searchParams,
  navigate,
}: UseProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(searchParams.search || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchInput, 500);

  const filters: ProductFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      selectedCategories,
      sortBy: searchParams.sortBy,
      sortOrder: searchParams.sortOrder,
    }),
    [
      selectedCategories,
      debouncedSearch,
      searchParams.sortBy,
      searchParams.sortOrder,
    ]
  );

  const navigateWithFilters = (updates: Partial<ProductsSearch>) => {
    navigate({
      search: {
        search: searchInput || undefined,
        category: searchParams.category || undefined,
        page: searchParams.page || undefined,
        sortBy: searchParams.sortBy || undefined,
        sortOrder: searchParams.sortOrder || undefined,
        ...updates,
      },
      replace: true,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    navigateWithFilters({
      search: value || undefined,
      page: 1,
    });
  };

  const handleCategoriesChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
  };

  const onRemoveCategorySlug = (slug: string) => {
    const updatedSelectedCategories = selectedCategories.filter(
      (item) => item !== slug
    );
    setSelectedCategories(updatedSelectedCategories);
  };

  const handleSortChange = (sortBy: "price" | "stock" | "title") => {
    const currentSortBy = searchParams.sortBy;
    const currentSortOrder = searchParams.sortOrder;

    let newSortOrder: "asc" | "desc" = "asc";
    if (currentSortBy === sortBy && currentSortOrder === "asc") {
      newSortOrder = "desc";
    }

    navigateWithFilters({
      sortBy,
      sortOrder: newSortOrder,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    navigateWithFilters({
      page: newPage,
    });
  };

  return {
    searchInput,
    selectedCategories,
    filters,
    handlers: {
      handleSearchChange,
      handleCategoriesChange,
      handleSortChange,
      handlePageChange,
      onRemoveCategorySlug,
    },
  };
}
