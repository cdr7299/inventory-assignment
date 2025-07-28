import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProductMutation } from "@/hooks";
import type { Product } from "@/types/product";
import { toast } from "sonner";

const addProductSchema = z.object({
  title: z
    .string()
    .min(1, "Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.string().refine((val) => {
    if (!val) return false;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Price must be greater than 0"),
  stock: z.string().refine((val) => {
    if (!val) return false;
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 0;
  }, "Stock must be a non-negative integer"),
});

type AddProductForm = z.infer<typeof addProductSchema>;

interface UseNewProductFormProps {
  onSuccess: () => void;
}

export function useNewProductForm({ onSuccess }: UseNewProductFormProps) {
  const { mutateAsync, isPending } = useCreateProductMutation({
    onSuccess: (newProduct) => {
      toast.success("Product created successfully!", {
        description: `${newProduct.title} has been added to your inventory.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create product", {
        description: error.message || "Please try again.",
      });
    },
  });

  const form = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "",
      stock: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: AddProductForm) => {
    try {
      const productData: Omit<Product, "id" | "meta"> = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        discountPercentage: 0,
        rating: 0,
        tags: [],
        brand: "Custom",
        sku: "",
        weight: 1,
        dimensions: { width: 10, height: 10, depth: 10 },
        warrantyInformation: "",
        shippingInformation: "",
        availabilityStatus: "",
        reviews: [],
        returnPolicy: "",
        minimumOrderQuantity: 1,
        images: [],
        thumbnail: "",
      };
      await mutateAsync(productData);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

export type { AddProductForm };
