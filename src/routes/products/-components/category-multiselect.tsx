import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "motion/react";
import { useCategories } from "@/hooks";

interface CategoryMultiselectProps {
  selectedCategories: string[];
  onSelectionChange: (categories: string[]) => void;
  placeholder?: string;
}

export function CategoryMultiselect({
  selectedCategories,
  onSelectionChange,
  placeholder = "Filter by category...",
}: CategoryMultiselectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories = [], isLoading } = useCategories();

  const handleCategoryToggle = (categorySlug: string) => {
    const isSelected = selectedCategories.includes(categorySlug);

    if (isSelected) {
      onSelectionChange(
        selectedCategories.filter((cat) => cat !== categorySlug)
      );
    } else {
      onSelectionChange([...selectedCategories, categorySlug]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter((cat) => selectedCategories.includes(cat.slug))
      .map((cat) => cat.name);
  };

  const selectedCategoryNames = getSelectedCategoryNames();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[300px] max-w-sm justify-between font-normal"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedCategories.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : selectedCategories.length === 1 ? (
              <span className="truncate">{selectedCategoryNames[0]}</span>
            ) : (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <Badge variant="secondary" className="text-xs">
                  {selectedCategories.length} categories
                </Badge>
              </div>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-w-sm p-0" align="start">
        <div className="flex flex-col max-h-80">
          {selectedCategories.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <span className="text-sm text-muted-foreground">
                {selectedCategories.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-auto p-1 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No categories found
              </div>
            ) : (
              <div className="p-1">
                {categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.slug);
                  return (
                    <motion.div
                      key={category.slug}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.1 }}
                      className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleCategoryToggle(category.slug)}
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                        <AnimatePresence mode="wait">
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Check className="h-3 w-3" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <span className="flex-1 font-medium">
                        {category.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface SelectedCategoriesDisplayProps {
  selectedCategories: string[];
  onRemoveCategory: (categorySlug: string) => void;
}

export function SelectedCategoriesDisplay({
  selectedCategories,
  onRemoveCategory,
}: SelectedCategoriesDisplayProps) {
  const { data: categories = [] } = useCategories();
  if (selectedCategories.length === 0) return null;
  const selectedCategoryNames = categories
    .filter((cat) => selectedCategories.includes(cat.slug))
    .map((cat) => ({ slug: cat.slug, name: cat.name }));

  return (
    <motion.div
      layout
      layoutId="selected-categories"
      className="flex flex-wrap gap-2"
    >
      {selectedCategoryNames.map(({ slug, name }) => (
        <motion.div
          layout="position"
          key={slug}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Badge
            variant="secondary"
            className="flex items-center gap-1 pl-2 pr-1 py-1"
          >
            <span className="text-xs font-medium">{name}</span>
            <Button
              variant="secondary"
              size="icon"
              className="h-auto w-auto p-0.5 rounded-full"
              onClick={() => onRemoveCategory(slug)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </motion.div>
      ))}
    </motion.div>
  );
}
