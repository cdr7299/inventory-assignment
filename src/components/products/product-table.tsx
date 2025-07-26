import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { motion } from "motion/react";
import { ArrowUpDown, ArrowUp, ArrowDown, Edit3, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useProductEdit } from "@/hooks/use-product-edit";
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  sortBy?: "price" | "stock" | "title";
  sortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: "price" | "stock" | "title") => void;
}

function TableRowSkeleton() {
  return (
    <TableRow className="h-16 border-b">
      <TableCell className="w-16 py-3">
        <div className="flex items-center justify-center">
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </TableCell>
      <TableCell className="min-w-[250px] py-3">
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>
      <TableCell className="w-32 py-3">
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell className="w-24 text-right py-3">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="w-20 text-center py-3">
        <Skeleton className="h-4 w-12 mx-auto" />
      </TableCell>
      <TableCell className="w-28 py-3">
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
    </TableRow>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-32 text-center">
        <div className="text-muted-foreground">No products found</div>
      </TableCell>
    </TableRow>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-32 text-center">
        <div className="text-destructive">
          {error.message || "Failed to load products"}
        </div>
      </TableCell>
    </TableRow>
  );
}

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: "price" | "stock" | "title";
  currentSortBy?: "price" | "stock" | "title";
  currentSortOrder?: "asc" | "desc";
  onSort?: (sortBy: "price" | "stock" | "title") => void;
}

function SortableHeader({
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

interface EditableFieldProps {
  product: Product;
  field: "name" | "price" | "stock";
  className?: string;
  children: React.ReactNode;
}

function EditableField({
  product,
  field,
  className,
  children,
}: EditableFieldProps) {
  const productEdit = useProductEdit();
  const isEditing = productEdit.isEditing(product.id, field);
  const isUpdating = productEdit.isUpdating && isEditing;

  const handleOpenChange = (open: boolean) => {
    if (open) {
      productEdit.startEditing(product, field);
    } else if (!isUpdating) {
      productEdit.cancelEditing();
    }
  };

  const getInputType = () => {
    switch (field) {
      case "price":
        return "number";
      case "stock":
        return "number";
      default:
        return "text";
    }
  };

  const getPlaceholder = () => {
    switch (field) {
      case "name":
        return "Enter product name";
      case "price":
        return "Enter price";
      case "stock":
        return "Enter stock quantity";
      default:
        return "";
    }
  };

  return (
    <Popover open={isEditing} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors group inline-flex items-center gap-1",
            className
          )}
        >
          {children}
          <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center" sideOffset={5}>
        <div className="space-y-3">
          <div className="text-sm font-medium text-center">
            Edit{" "}
            {field === "name"
              ? "Product Name"
              : field === "price"
              ? "Price"
              : "Stock"}
          </div>
          <div className="space-y-4">
            <Input
              type={getInputType()}
              value={productEdit.tempValue}
              onChange={(e) => productEdit.setTempValue(e.target.value)}
              onKeyDown={productEdit.handleKeyPress}
              className="text-center"
              disabled={isUpdating}
              autoFocus
              min={field !== "name" ? "0" : undefined}
              step={field === "price" ? "0.01" : undefined}
              placeholder={getPlaceholder()}
            />
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                onClick={productEdit.saveEdit}
                disabled={isUpdating}
                className="flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={productEdit.cancelEditing}
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ProductTable({
  products,
  isLoading,
  error,
  sortBy,
  sortOrder,
  onSortChange,
}: ProductTableProps) {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "thumbnail",
      header: "",
      size: 64,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <img
            src={row.original.thumbnail}
            alt={row.original.title}
            className="h-12 w-12 rounded-lg object-cover border bg-muted"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/48x48/e5e7eb/6b7280?text=${row.original.title.charAt(
                0
              )}`;
            }}
          />
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
          <EditableField
            product={row.original}
            field="name"
            className="font-medium text-foreground w-fit"
          >
            <span>{row.original.title}</span>
          </EditableField>
          <Popover>
            <PopoverTrigger asChild>
              <div className="text-sm text-muted-foreground line-clamp-2 cursor-pointer hover:bg-muted/30 rounded p-1 transition-colors">
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
          <EditableField
            product={row.original}
            field="price"
            className="font-semibold text-foreground justify-end"
          >
            <span>${row.original.price.toFixed(2)}</span>
          </EditableField>
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
          <EditableField
            product={row.original}
            field="stock"
            className="font-medium justify-center"
          >
            <span>{row.original.stock}</span>
          </EditableField>
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
            {isInStock ? "In Stock" : "Out of Stock"}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-lg border bg-card flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 z-10 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-12"
                      style={{
                        width:
                          header.getSize() === 150
                            ? header.column.columnDef.minSize ||
                              header.getSize()
                            : header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth:
                          header.getSize() === 150
                            ? undefined
                            : header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {error ? (
                <ErrorState error={error} />
              ) : isLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <TableRowSkeleton key={`skeleton-${i}`} />
                ))
              ) : products.length === 0 ? (
                <EmptyState />
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.02,
                    }}
                    className="group hover:bg-muted/30 transition-colors border-b h-16"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3"
                        style={{
                          width:
                            cell.column.getSize() === 150
                              ? cell.column.columnDef.minSize ||
                                cell.column.getSize()
                              : cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth:
                            cell.column.getSize() === 150
                              ? undefined
                              : cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
