import { useState, useCallback } from "react";
import { useUpdateProductMutation } from "./use-product-mutations";
import { toast } from "sonner";
import type { Product, ProductEditField } from "@/types/product";

interface UseProductEditOptions {
  onSuccess?: () => void;
}

export function useProductEdit(options: UseProductEditOptions = {}) {
  const [editingProduct, setEditingProduct] = useState<{
    id: number;
    field: ProductEditField;
  } | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  const updateMutation = useUpdateProductMutation({
    onSuccess: (result) => {
      const field = result.field as ProductEditField;
      const { value } = result;

      const fieldLabels = {
        title: "Product title",
        price: "Price",
        stock: "Stock quantity",
      } as const;

      toast.success(`${fieldLabels[field]} updated successfully!`, {
        description: `${fieldLabels[field]} updated to ${
          field === "price" ? "$" : ""
        }${value}`,
      });

      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to update product", {
        description: error.message || "Please try again.",
      });
    },
  });

  const startEditing = useCallback(
    (product: Product, field: ProductEditField) => {
      setEditingProduct({ id: product.id, field });

      switch (field) {
        case "title":
          setTempValue(product.title);
          break;
        case "price":
          setTempValue(product.price.toString());
          break;
        case "stock":
          setTempValue(product.stock.toString());
          break;
      }
    },
    []
  );

  const cancelEditing = useCallback(() => {
    setEditingProduct(null);
    setTempValue("");
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingProduct) return;

    const { id, field } = editingProduct;
    let processedValue: string | number;

    // Basic type conversion - service layer handles validation
    switch (field) {
      case "title":
        processedValue = tempValue.trim();
        break;
      case "price":
        processedValue = parseFloat(tempValue);
        break;
      case "stock":
        processedValue = parseInt(tempValue, 10);
        break;
      default:
        return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        field,
        value: processedValue,
      });

      cancelEditing();
    } catch {
      // Error handling is done in mutation onError and service layer
    }
  }, [editingProduct, tempValue, updateMutation, cancelEditing]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveEdit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEditing();
      }
    },
    [saveEdit, cancelEditing]
  );

  const isEditing = useCallback(
    (productId: number, field: ProductEditField) => {
      return (
        editingProduct?.id === productId && editingProduct?.field === field
      );
    },
    [editingProduct]
  );

  return {
    editingProduct,
    tempValue,
    setTempValue,
    startEditing,
    cancelEditing,
    saveEdit,
    handleKeyPress,
    isEditing,
    isUpdating: updateMutation.isPending,
  };
}
