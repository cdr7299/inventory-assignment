import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-products";
import type { Product } from "@/types/product";

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

export const Route = createFileRoute("/products/new")({
  component: AddProductPage,
});

function AddProductPage() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductForm>({
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

  const selectedCategory = watch("category");

  const onSubmit = async (data: AddProductForm) => {
    try {
      // Get existing products from localStorage
      const existingProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      ) as Product[];

      // Create new product with a unique ID (using timestamp + random number)
      const newProduct: Product = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: data.title,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
        // Default values for required fields
        discountPercentage: 0,
        rating: 0,
        tags: [],
        brand: "Custom",
        sku: `CUSTOM-${Date.now()}`,
        weight: 1,
        dimensions: {
          width: 10,
          height: 10,
          depth: 10,
        },
        warrantyInformation: "No warranty",
        shippingInformation: "Standard shipping",
        availabilityStatus: "In Stock",
        reviews: [],
        returnPolicy: "No returns",
        minimumOrderQuantity: 1,
        meta: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          barcode: `${Date.now()}`,
          qrCode: `qr-${Date.now()}`,
        },
        images: [
          "https://via.placeholder.com/300x300/e5e7eb/6b7280?text=" +
            encodeURIComponent(data.title.charAt(0)),
        ],
        thumbnail: "",
      };

      // Add to localStorage
      const updatedProducts = [...existingProducts, newProduct];
      localStorage.setItem("localProducts", JSON.stringify(updatedProducts));

      // Show success toast
      toast.success("Product added successfully!", {
        description: `${data.title} has been added to your inventory.`,
      });

      // Redirect back to products page
      navigate({ to: "/products" });
    } catch {
      toast.error("Failed to add product", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/products" })}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Add New Product
        </h1>
        <p className="text-muted-foreground">
          Create a new product entry for your inventory
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-foreground"
                >
                  Product Name *
                </label>
                <Input
                  id="title"
                  placeholder="Enter product name"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Enter product description"
                  rows={4}
                  {...register("description")}
                  className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.description ? "border-destructive" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-foreground"
                >
                  Category *
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setValue("category", value)}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger
                    className={errors.category ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-foreground"
                  >
                    Price ($) *
                  </label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register("price")}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-foreground"
                  >
                    Stock Quantity *
                  </label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("stock")}
                    className={errors.stock ? "border-destructive" : ""}
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate({ to: "/products" })}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
