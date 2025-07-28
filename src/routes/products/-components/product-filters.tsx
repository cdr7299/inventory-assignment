import { motion } from "motion/react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CategoryMultiselect,
  SelectedCategoriesDisplay,
} from "./category-multiselect";

interface ProductFiltersProps {
  searchInput: string;
  selectedCategories: string[];
  isFetching: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categories: string[]) => void;
  onRemoveCategory: (slug: string) => void;
}

export function ProductFilters({
  searchInput,
  selectedCategories,
  isFetching,
  onSearchChange,
  onCategoryChange,
  onRemoveCategory,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products, descriptions.."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
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

        <CategoryMultiselect
          selectedCategories={selectedCategories}
          onSelectionChange={onCategoryChange}
          placeholder="Filter by category..."
        />
      </div>
      <SelectedCategoriesDisplay
        selectedCategories={selectedCategories}
        onRemoveCategory={onRemoveCategory}
      />
    </div>
  );
}
