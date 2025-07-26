import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { motion } from "motion/react";
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
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
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

export function ProductTable({
  products,
  isLoading,
  error,
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
      header: "Product Name",
      minSize: 250,
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.original.title}</div>
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
      header: "Price",
      size: 96,
      cell: ({ row }) => (
        <div className="font-semibold text-foreground text-right">
          ${row.original.price.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      size: 80,
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.original.stock}</div>
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
