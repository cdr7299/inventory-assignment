import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductSortField, SortOrder } from "@/types/product";

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: ProductSortField;
  currentSortBy?: ProductSortField;
  currentSortOrder?: SortOrder;
  onSort?: (sortBy: ProductSortField) => void;
}

export function SortableHeader({
  children,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSortBy === sortKey;

  const getSortIcon = () => {
    const iconClass = sortKey === "price" ? "mr-2 order-first" : "ml-2";

    if (!isActive) {
      return (
        <ArrowUpDown
          className={`h-4 w-4 opacity-50 group-hover:opacity-75 transition-opacity ${iconClass}`}
        />
      );
    }
    return currentSortOrder === "asc" ? (
      <ArrowUp className={`h-4 w-4 text-primary ${iconClass}`} />
    ) : (
      <ArrowDown className={`h-4 w-4 text-primary ${iconClass}`} />
    );
  };

  return (
    <button
      className={cn(
        "flex items-center space-x-1 hover:bg-muted/50 rounded-md px-2 py-1 transition-colors group w-full font-medium",
        "text-left justify-start",
        sortKey === "price" && "justify-end text-right",
        sortKey === "stock" && "justify-center text-center",
        isActive && "text-primary"
      )}
      onClick={() => onSort?.(sortKey)}
      disabled={!onSort}
    >
      <span>{children}</span>
      {onSort && getSortIcon()}
    </button>
  );
}
