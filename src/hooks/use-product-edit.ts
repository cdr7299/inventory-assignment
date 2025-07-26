import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Product } from "@/types/product";
import { storageService } from "@/lib/storage";

interface ProductEdit {
  id: number;
  field: "name" | "price" | "stock";
  value: string | number;
}

interface UseProductEditOptions {
  onSuccess?: () => void;
}

export function useProductEdit(options: UseProductEditOptions = {}) {
  const [editingProduct, setEditingProduct] = useState<{
    id: number;
    field: "name" | "price" | "stock";
  } | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const queryClient = useQueryClient();

  const productEditMutation = useMutation({
    mutationFn: async ({ id, field, value }: ProductEdit) => {
      // Use the safe storage service to update product edits
      const success = storageService.updateProductEdit(id, field, value);

      if (!success) {
        throw new Error("Failed to save product edit to storage");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return { id, field, value };
    },
    onSuccess: ({ field, value }) => {
      // Invalidate the products query to refetch data
      queryClient.invalidateQueries({ queryKey: ["products"] });

      const fieldLabels = {
        name: "Product name",
        price: "Price",
        stock: "Stock quantity",
      };

      toast.success(`${fieldLabels[field]} updated successfully!`, {
        description: `${fieldLabels[field]} updated to ${
          field === "price" ? "$" : ""
        }${value}`,
      });

      options.onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update product", {
        description: "Please try again.",
      });
    },
  });

  const startEditing = useCallback(
    (product: Product, field: "name" | "price" | "stock") => {
      setEditingProduct({ id: product.id, field });

      // Set initial value based on field
      switch (field) {
        case "name":
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

    // Validate and process value based on field
    switch (field) {
      case "name":
        if (!tempValue.trim()) {
          toast.error("Invalid product name", {
            description: "Product name cannot be empty.",
          });
          return;
        }
        processedValue = tempValue.trim();
        break;

      case "price": {
        const price = parseFloat(tempValue);
        if (isNaN(price) || price < 0) {
          toast.error("Invalid price", {
            description: "Price must be a non-negative number.",
          });
          return;
        }
        processedValue = price;
        break;
      }

      case "stock": {
        const stock = parseInt(tempValue, 10);
        if (isNaN(stock) || stock < 0) {
          toast.error("Invalid stock value", {
            description: "Stock must be a non-negative number.",
          });
          return;
        }
        processedValue = stock;
        break;
      }

      default:
        return;
    }

    try {
      await productEditMutation.mutateAsync({
        id,
        field,
        value: processedValue,
      });

      cancelEditing();
    } catch {
      // Error handling is done in mutation onError
    }
  }, [editingProduct, tempValue, productEditMutation, cancelEditing]);

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
    (productId: number, field: "name" | "price" | "stock") => {
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
    isUpdating: productEditMutation.isPending,
  };
}
