import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SortableHeader } from "./sortable-header";
import { EditableCell } from "./editable-cell";
import type { Product, ProductSortField, SortOrder } from "@/types/product";

interface CreateColumnsOptions {
  sortBy?: ProductSortField;
  sortOrder?: SortOrder;
  onSortChange?: (sortBy: ProductSortField) => void;
}

export function createProductTableColumns({
  sortBy,
  sortOrder,
  onSortChange,
}: CreateColumnsOptions): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "thumbnail",
      header: "",
      size: 64,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.thumbnail ? (
            <img
              src={row.original.thumbnail}
              className="h-12 w-12 rounded-lg object-cover border bg-muted"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/48x48/e5e7eb/6b7280?text=${row.original.title.charAt(
                  0
                )}`;
              }}
            />
          ) : (
            <div className="h-12 w-12 rounded-lg object-cover border bg-muted flex items-center justify-center">
              <span className="text-lg text-muted-foreground">
                {row.original.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: () => (
        <SortableHeader
          sortKey="title"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={onSortChange}
        >
          Product Name
        </SortableHeader>
      ),
      minSize: 300,
      cell: ({ row }) => (
        <div className="space-y-1">
          <EditableCell
            product={row.original}
            field="title"
            className="font-medium text-foreground w-fit"
          >
            <span>{row.original.title}</span>
          </EditableCell>
          <Popover>
            <PopoverTrigger asChild>
              <div className="text-sm text-muted-foreground truncate cursor-pointer hover:bg-muted/30 rounded py-1 transition-colors">
                {row.original.description}
              </div>
            </PopoverTrigger>
            <PopoverContent side="bottom" className="max-w-sm p-3">
              <div className="text-sm">{row.original.description}</div>
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      size: 128,
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: () => (
        <SortableHeader
          sortKey="price"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={onSortChange}
        >
          Price
        </SortableHeader>
      ),
      size: 96,
      cell: ({ row }) => (
        <div className="text-right">
          <EditableCell
            product={row.original}
            field="price"
            className="font-semibold text-foreground justify-end"
          >
            <span>${row.original.price.toFixed(2)}</span>
          </EditableCell>
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: () => (
        <SortableHeader
          sortKey="stock"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={onSortChange}
        >
          Stock
        </SortableHeader>
      ),
      size: 80,
      cell: ({ row }) => (
        <div className="text-center">
          <EditableCell
            product={row.original}
            field="stock"
            className="font-medium justify-center"
          >
            <span>{row.original.stock}</span>
          </EditableCell>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 112,
      cell: ({ row }) => {
        const isInStock = row.original.stock > 0;
        return (
          <Badge
            variant={isInStock ? "default" : "destructive"}
            className="text-xs"
          >
            {row.original.availabilityStatus}
          </Badge>
        );
      },
    },
  ];
}
