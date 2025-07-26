import type {
  Product,
  ProductsApiResponse,
  ProductFilters,
  PaginationParams,
  Category,
} from "@/types/product";
import { productDataService } from "@/lib/services/product-data";

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
      let apiProducts: Product[] = [];

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
        apiProducts = categoryResults.flat();
      } else {
        // No category filter - fetch all products
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
        apiProducts = data.products;
      }

      // Use the data service to process products with all business logic
      const result = productDataService.processProducts(
        apiProducts,
        filters,
        page,
        limit
      );

      return {
        products: result.products,
        total: result.total,
        skip: result.skip,
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
