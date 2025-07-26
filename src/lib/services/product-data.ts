import type { Product, ProductFilters } from "@/types/product";
import { storageService } from "@/lib/storage";

export class ProductDataService {
  /**
   * Applies product edits from localStorage to a list of products
   */
  applyProductEdits(products: Product[]): Product[] {
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
        ...(edits.name !== undefined && { title: edits.name }),
        ...(edits.price !== undefined && { price: edits.price }),
        ...(edits.stock !== undefined && { stock: edits.stock }),
      };
    });
  }

  /**
   * Combines API products with local products and applies edits
   */
  combineProductSources(apiProducts: Product[]): Product[] {
    const localProducts = storageService.getLocalProducts();
    const allProducts = [...localProducts, ...apiProducts];

    return this.applyProductEdits(allProducts);
  }

  /**
   * Filters products by selected categories
   */
  filterByCategories(products: Product[], categories: string[]): Product[] {
    if (!categories || categories.length === 0) {
      return products;
    }

    return products.filter((product) => categories.includes(product.category));
  }

  /**
   * Applies search filter to products (searches title, description, category)
   */
  applySearchFilter(products: Product[], searchTerm: string): Product[] {
    if (!searchTerm || searchTerm.trim() === "") {
      return products;
    }

    const search = searchTerm.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
    );
  }

  /**
   * Removes duplicate products by ID (useful when combining multiple sources)
   */
  removeDuplicates(products: Product[]): Product[] {
    return products.filter(
      (product, index, self) =>
        self.findIndex((p) => p.id === product.id) === index
    );
  }

  /**
   * Sorts products based on the provided criteria
   */
  sortProducts(
    products: Product[],
    sortBy?: "price" | "stock" | "title",
    sortOrder: "asc" | "desc" = "asc"
  ): Product[] {
    if (!sortBy) {
      return products;
    }

    return [...products].sort((a, b) => {
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

  /**
   * Applies pagination to products
   */
  paginateProducts(
    products: Product[],
    page: number,
    limit: number
  ): {
    products: Product[];
    total: number;
    skip: number;
  } {
    const total = products.length;
    const skip = (page - 1) * limit;
    const paginatedProducts = products.slice(skip, skip + limit);

    return {
      products: paginatedProducts,
      total,
      skip,
    };
  }

  /**
   * Processes products with all filters, sorting, and pagination
   */
  processProducts(
    apiProducts: Product[],
    filters: ProductFilters,
    page: number,
    limit: number
  ) {
    let products = this.combineProductSources(apiProducts);

    // Apply category filter (affects local products too)
    if (filters.categories && filters.categories.length > 0) {
      products = this.filterByCategories(products, filters.categories);
    }

    // Remove duplicates after combining sources
    products = this.removeDuplicates(products);

    // Apply search filter
    if (filters.search) {
      products = this.applySearchFilter(products, filters.search);
    }

    // Apply sorting
    if (filters.sortBy) {
      products = this.sortProducts(products, filters.sortBy, filters.sortOrder);
    }

    // Apply pagination
    return this.paginateProducts(products, page, limit);
  }
}

// Export singleton instance
export const productDataService = new ProductDataService();
