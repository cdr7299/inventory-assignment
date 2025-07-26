import type { Product } from "@/types/product";

interface ProductEdits {
  [productId: number]: {
    name?: string;
    price?: number;
    stock?: number;
  };
}

class StorageService {
  private isStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private safeGetItem(key: string): string | null {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage is not available");
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  private safeSetItem(key: string, value: string): boolean {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage is not available");
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  private safeParse<T>(jsonString: string | null, fallback: T): T {
    if (!jsonString) return fallback;

    try {
      const parsed = JSON.parse(jsonString);
      return parsed;
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      return fallback;
    }
  }

  // Product-specific methods
  getLocalProducts(): Product[] {
    const data = this.safeGetItem("localProducts");
    const products = this.safeParse(data, []);

    // Basic validation that it's an array
    if (!Array.isArray(products)) {
      console.warn(
        "Invalid localProducts data structure, returning empty array"
      );
      return [];
    }

    return products;
  }

  setLocalProducts(products: Product[]): boolean {
    if (!Array.isArray(products)) {
      console.error("Invalid products array provided to setLocalProducts");
      return false;
    }

    try {
      const jsonString = JSON.stringify(products);
      return this.safeSetItem("localProducts", jsonString);
    } catch (error) {
      console.error("Error serializing products:", error);
      return false;
    }
  }

  addLocalProduct(product: Product): boolean {
    const existingProducts = this.getLocalProducts();
    const updatedProducts = [...existingProducts, product];
    return this.setLocalProducts(updatedProducts);
  }

  getProductEdits(): ProductEdits {
    const data = this.safeGetItem("productEdits");
    const edits = this.safeParse(data, {} as ProductEdits);

    // Basic validation that it's an object
    if (typeof edits !== "object" || Array.isArray(edits) || edits === null) {
      console.warn(
        "Invalid productEdits data structure, returning empty object"
      );
      return {} as ProductEdits;
    }

    return edits;
  }

  setProductEdits(edits: ProductEdits): boolean {
    if (typeof edits !== "object" || Array.isArray(edits) || edits === null) {
      console.error("Invalid edits object provided to setProductEdits");
      return false;
    }

    try {
      const jsonString = JSON.stringify(edits);
      return this.safeSetItem("productEdits", jsonString);
    } catch (error) {
      console.error("Error serializing product edits:", error);
      return false;
    }
  }

  updateProductEdit(
    productId: number,
    field: "name" | "price" | "stock",
    value: string | number
  ): boolean {
    const existingEdits = this.getProductEdits();

    if (!existingEdits[productId]) {
      existingEdits[productId] = {};
    }

    // Type-safe assignment based on field
    if (field === "name" && typeof value === "string") {
      existingEdits[productId][field] = value;
    } else if (
      (field === "price" || field === "stock") &&
      typeof value === "number"
    ) {
      existingEdits[productId][field] = value;
    } else {
      console.error(`Invalid value type for field ${field}:`, typeof value);
      return false;
    }

    return this.setProductEdits(existingEdits);
  }

  // Utility method to clear all storage (useful for testing/debugging)
  clearAllStorage(): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem("localProducts");
      localStorage.removeItem("productEdits");
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
