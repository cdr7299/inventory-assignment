import { Edit3, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useProductEdit } from "@/hooks";
import type { Product, ProductEditField } from "@/types/product";

interface EditableCellProps {
  product: Product;
  field: ProductEditField;
  className?: string;
  children: React.ReactNode;
}

export function EditableCell({
  product,
  field,
  className,
  children,
}: EditableCellProps) {
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
      case "title":
        return "Enter product title";
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
            "cursor-pointer hover:bg-muted/50 rounded py-1 transition-colors group inline-flex items-center gap-1",
            className
          )}
        >
          {children}
          <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center" sideOffset={5}>
        <div className="space-y-3">
          <div className="text-sm font-medium">
            Edit{" "}
            {field === "title"
              ? "Product Title"
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
              disabled={isUpdating}
              autoFocus
              min={field !== "title" ? "0" : undefined}
              step={field === "price" ? "0.01" : undefined}
              placeholder={getPlaceholder()}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={productEdit.saveEdit}
                disabled={isUpdating}
                className="flex items-center gap-1 min-w-28"
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
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
