import type {
  Product,
  ProductsApiResponse,
  ProductFilters,
  PaginationParams,
  Category,
} from "@/types/product";

const BASE_URL = "https://dummyjson.com";

interface FetchProductsParams extends PaginationParams {
  filters?: ProductFilters;
}

class ProductsApi {
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number>
  ): string {
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async fetchProducts({
    page = 1,
    limit = 10,
    filters = {},
  }: FetchProductsParams): Promise<ProductsApiResponse> {
    try {
      let allProducts: Product[] = [];

      // Get localStorage products first
      const localProducts: Product[] = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );

      // If categories are selected, fetch from each category endpoint
      if (filters.categories && filters.categories.length > 0) {
        const categoryPromises = filters.categories.map(async (category) => {
          const url = this.buildUrl(`/products/category/${category}`);
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch category ${category}: ${response.statusText}`
            );
          }
          const data: ProductsApiResponse = await response.json();
          return data.products;
        });

        const categoryResults = await Promise.all(categoryPromises);
        allProducts = categoryResults.flat();

        // Remove duplicates by id (in case a product appears in multiple categories)
        const uniqueProducts = allProducts.filter(
          (product, index, self) =>
            self.findIndex((p) => p.id === product.id) === index
        );
        allProducts = uniqueProducts;

        // Also filter localStorage products by selected categories
        const filteredLocalProducts = localProducts.filter((product) =>
          filters.categories!.includes(product.category)
        );
        allProducts = [...filteredLocalProducts, ...allProducts];

        // Apply product edits from localStorage
        const productEdits = JSON.parse(
          localStorage.getItem("productEdits") || "{}"
        );
        if (Object.keys(productEdits).length > 0) {
          allProducts = allProducts.map((product) => {
            const edits = productEdits[product.id];
            if (edits) {
              return {
                ...product,
                ...(edits.name !== undefined && { title: edits.name }),
                ...(edits.price !== undefined && { price: edits.price }),
                ...(edits.stock !== undefined && { stock: edits.stock }),
              };
            }
            return product;
          });
        }

        // Apply search filter client-side if we have categories (since we can't combine category + search in API)
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          allProducts = allProducts.filter(
            (product) =>
              product.title.toLowerCase().includes(searchTerm) ||
              product.description.toLowerCase().includes(searchTerm) ||
              product.category.toLowerCase().includes(searchTerm)
          );
        }
      } else {
        // No category filter - fetch all products first, then apply search client-side
        const endpoint = "/products";
        const params: Record<string, string | number> = {
          limit: 0, // Get all products for proper filtering
        };

        const url = this.buildUrl(endpoint, params);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data: ProductsApiResponse = await response.json();
        allProducts = data.products;

        // Combine with localStorage products before filtering/sorting
        allProducts = [...localProducts, ...allProducts];

        // Apply product edits from localStorage BEFORE searching
        const productEdits = JSON.parse(
          localStorage.getItem("productEdits") || "{}"
        );
        if (Object.keys(productEdits).length > 0) {
          allProducts = allProducts.map((product) => {
            const edits = productEdits[product.id];
            if (edits) {
              return {
                ...product,
                ...(edits.name !== undefined && { title: edits.name }),
                ...(edits.price !== undefined && { price: edits.price }),
                ...(edits.stock !== undefined && { stock: edits.stock }),
              };
            }
            return product;
          });
        }

        // Apply search filter client-side to all products (including edited titles)
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          allProducts = allProducts.filter(
            (product) =>
              product.title.toLowerCase().includes(searchTerm) ||
              product.description.toLowerCase().includes(searchTerm) ||
              product.category.toLowerCase().includes(searchTerm)
          );
        }
      }

      // Apply sorting
      if (filters.sortBy) {
        allProducts = [...allProducts].sort((a, b) => {
          const { sortBy, sortOrder = "asc" } = filters;
          let aValue: number | string;
          let bValue: number | string;

          switch (sortBy) {
            case "price":
              aValue = a.price;
              bValue = b.price;
              break;
            case "stock":
              aValue = a.stock;
              bValue = b.stock;
              break;
            case "title":
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
          if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      // Apply client-side pagination
      const total = allProducts.length;
      const skip = (page - 1) * limit;
      const paginatedProducts = allProducts.slice(skip, skip + limit);

      return {
        products: paginatedProducts,
        total,
        skip,
        limit,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async fetchProductById(id: number): Promise<Product> {
    try {
      const url = this.buildUrl(`/products/${id}`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async fetchCategories(): Promise<Category[]> {
    try {
      const url = this.buildUrl("/products/categories");
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}

export const productsApi = new ProductsApi();
