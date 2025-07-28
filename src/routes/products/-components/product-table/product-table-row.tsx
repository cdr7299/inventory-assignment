import { motion } from "motion/react";
import { flexRender, type Row } from "@tanstack/react-table";
import { TableCell } from "@/components/ui/table";
import type { Product } from "@/types/product";

interface ProductTableRowProps {
  row: Row<Product>;
  index: number;
}

export function ProductTableRow({ row, index }: ProductTableRowProps) {
  return (
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
                ? cell.column.columnDef.minSize || cell.column.getSize()
                : cell.column.getSize(),
            minWidth: cell.column.columnDef.minSize,
            maxWidth:
              cell.column.getSize() === 150 ? undefined : cell.column.getSize(),
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </motion.tr>
  );
}
