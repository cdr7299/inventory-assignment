import type { Product } from "@/types/product";
import type {
  ProductEditField,
  ProductSortField,
  SortOrder,
} from "@/types/product";
import { storageService } from "@/lib/storage";

// ======= UTILITY FUNCTIONS FOR PRODUCT PROCESSING =======

export function applyProductEdits(products: Product[]): Product[] {
  const productEdits = storageService.getProductEdits();
  if (Object.keys(productEdits).length === 0) {
    return products;
  }
  return products.map((product) => {
    const edits = productEdits[product.id];
    if (!edits) {
      return product;
    }

    return {
      ...product,
      ...(edits.title !== undefined && { title: edits.title }),
      ...(edits.price !== undefined && { price: edits.price }),
      ...(edits.stock !== undefined && {
        stock: edits.stock,
        availabilityStatus: edits.stock > 0 ? "In Stock" : "Out of Stock",
      }),
    };
  });
}

export function sortProducts(
  products: Product[],
  sortBy?: ProductSortField,
  sortOrder?: SortOrder
): Product[] {
  if (!sortBy || !sortOrder) {
    return products;
  }

  return [...products].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "title":
        aValue = (a.title || "").toLowerCase();
        bValue = (b.title || "").toLowerCase();
        break;
      case "price":
        aValue =
          typeof a.price === "number"
            ? a.price
            : parseFloat(String(a.price)) || 0;
        bValue =
          typeof b.price === "number"
            ? b.price
            : parseFloat(String(b.price)) || 0;
        break;
      case "stock":
        aValue =
          typeof a.stock === "number"
            ? a.stock
            : parseInt(String(a.stock)) || 0;
        bValue =
          typeof b.stock === "number"
            ? b.stock
            : parseInt(String(b.stock)) || 0;
        break;
      default:
        return 0;
    }

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortOrder === "asc" ? -1 : 1;
    if (bValue == null) return sortOrder === "asc" ? 1 : -1;

    // Perform comparison
    let comparison = 0;
    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else {
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
}

export function combineProductSources(
  apiProducts: Product[],
  sortBy?: ProductSortField,
  sortOrder?: SortOrder
): Product[] {
  const localProducts = storageService.getLocalProducts();
  const allProducts = [...localProducts, ...apiProducts];
  const productsWithEdits = applyProductEdits(allProducts);

  // Re-sort products after applying local edits to ensure correct order
  return sortProducts(productsWithEdits, sortBy, sortOrder);
}

// New client-side data processing function
export function processProductsClientSide(
  apiProducts: Product[],
  filters: {
    search?: string;
    selectedCategories: string[];
    sortBy?: ProductSortField;
    sortOrder?: SortOrder;
  },
  pagination: {
    page: number;
    limit: number;
  }
): {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
} {
  const localProducts = storageService.getLocalProducts();
  const apiProductIds = new Set(apiProducts.map((p) => p.id));
  const uniqueLocalProducts = localProducts.filter(
    (p) => !apiProductIds.has(p.id)
  );
  const allProducts = [...apiProducts, ...uniqueLocalProducts];

  const productsWithEdits = applyProductEdits(allProducts);

  let filteredProducts = productsWithEdits;

  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.selectedCategories.length) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.selectedCategories.includes(product.category)
    );
  }

  if (
    !filters.search &&
    !filters.selectedCategories.length &&
    !filters.sortBy
  ) {
    const localProductsWithEdits = filteredProducts.filter((p) =>
      uniqueLocalProducts.some((lp) => lp.id === p.id)
    );
    const apiProductsWithEdits = filteredProducts.filter(
      (p) => !uniqueLocalProducts.some((lp) => lp.id === p.id)
    );
    filteredProducts = [...localProductsWithEdits, ...apiProductsWithEdits];
  } else {
    filteredProducts = sortProducts(
      filteredProducts,
      filters.sortBy,
      filters.sortOrder
    );
  }

  const total = filteredProducts.length;
  const skip = (pagination.page - 1) * pagination.limit;
  const paginatedProducts = filteredProducts.slice(
    skip,
    skip + pagination.limit
  );

  return {
    products: paginatedProducts,
    total,
    skip,
    limit: pagination.limit,
  };
}

export function createNewProduct(
  productData: Omit<Product, "id" | "meta">
): Product {
  const now = new Date().toISOString();
  const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

  return {
    ...productData,
    id: uniqueId,
    discountPercentage: productData.discountPercentage ?? 0,
    rating: productData.rating ?? 0,
    tags: productData.tags ?? [],
    brand: productData.brand ?? "Custom",
    sku: productData.sku ?? `CUSTOM-${uniqueId}`,
    weight: productData.weight ?? 1,
    dimensions: productData.dimensions ?? {
      width: 10,
      height: 10,
      depth: 10,
    },
    warrantyInformation: productData.warrantyInformation ?? "No warranty",
    shippingInformation: productData.shippingInformation ?? "Standard shipping",
    availabilityStatus: productData.stock > 0 ? "In Stock" : "Out of Stock",
    reviews: productData.reviews ?? [],
    returnPolicy: productData.returnPolicy ?? "No returns",
    minimumOrderQuantity: productData.minimumOrderQuantity ?? 1,
    images:
      productData.images?.length > 0
        ? productData.images
        : [
            `https://via.placeholder.com/300x300/e5e7eb/6b7280?text=${encodeURIComponent(
              productData.title.charAt(0)
            )}`,
          ],
    thumbnail: productData.thumbnail || "",
    meta: {
      createdAt: now,
      updatedAt: now,
      barcode: `${uniqueId}`,
      qrCode: `qr-${uniqueId}`,
    },
  };
}

export async function createProduct(
  productData: Omit<Product, "id" | "meta">
): Promise<{ success: boolean; product?: Product; errors?: string[] }> {
  try {
    const newProduct = createNewProduct(productData);
    const success = storageService.addLocalProduct(newProduct);

    if (!success) {
      return {
        success: false,
        errors: ["Failed to save product to storage"],
      };
    }

    return {
      success: true,
      product: newProduct,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        `Failed to create product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ],
    };
  }
}

export async function updateProduct(
  id: number,
  field: ProductEditField,
  value: string | number
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    const success = storageService.updateProductEdit(id, field, value);
    if (!success) {
      return {
        success: false,
        errors: ["Failed to update product in storage"],
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: [
        `Failed to update product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ],
    };
  }
}
