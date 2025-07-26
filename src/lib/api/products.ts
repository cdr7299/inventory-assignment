import type {
  Product,
  ProductsApiResponse,
  ProductFilters,
  PaginationParams,
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
      const skip = (page - 1) * limit;
      const params: Record<string, string | number> = {
        limit,
        skip,
      };

      // Handle search
      let endpoint = "/products";
      if (filters.search) {
        endpoint = "/products/search";
        params.q = filters.search;
      }

      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data: ProductsApiResponse = await response.json();

      // Apply client-side filtering and sorting if needed
      let products = data.products;

      // Filter by category if specified
      if (filters.category && filters.category !== "all") {
        products = products.filter(
          (product) =>
            product.category.toLowerCase() === filters.category!.toLowerCase()
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        products = [...products].sort((a, b) => {
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

      return {
        ...data,
        products,
        total:
          filters.category && filters.category !== "all"
            ? products.length
            : data.total,
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

  async fetchCategories(): Promise<string[]> {
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
