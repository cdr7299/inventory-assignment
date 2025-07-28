import type {
  Product,
  ProductsApiResponse,
  Category,
  ProductEditField,
} from "@/types/product";
import { createProduct, updateProduct } from "@/lib/services/product-data";

const BASE_URL = "https://dummyjson.com";

async function fetchJson<T>(url: string, context: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`${context}:`, error);
    throw error;
  }
}

async function postJson<T>(
  url: string,
  data: Record<string, unknown>,
  context: string,
  method: string = "POST"
): Promise<T> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`${context}:`, error);
    throw error;
  }
}

function buildUrl(
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

export async function fetchAllProducts(): Promise<Product[]> {
  const url = buildUrl("/products", { limit: 0 });
  const data = await fetchJson<ProductsApiResponse>(
    url,
    "Error fetching all products"
  );
  return data.products;
}

export async function fetchCategories(): Promise<Category[]> {
  const url = buildUrl("/products/categories");
  return fetchJson<Category[]>(url, "Error fetching categories");
}

export async function createProductApi(
  productData: Omit<Product, "id" | "meta">
): Promise<Product> {
  try {
    const dummyApiUrl = buildUrl("/products/add");
    const dummyApiResponse = await postJson<Product>(
      dummyApiUrl,
      productData,
      "DummyJSON create product simulation"
    );
    console.log("DummyJSON create simulation response:", dummyApiResponse);
  } catch (dummyError) {
    console.warn("DummyJSON API simulation failed:", dummyError);
  }

  const result = await createProduct(productData);

  if (!result.success) {
    throw new Error(result.errors?.join(", ") || "Failed to create product");
  }

  return result.product!;
}

export async function updateProductApi(
  id: number,
  field: ProductEditField,
  value: string | number
): Promise<{
  id: number;
  field: ProductEditField;
  value: string | number;
}> {
  try {
    const dummyApiUrl = buildUrl(`/products/${id}`);
    const updateData = { [field]: value };
    const dummyApiResponse = await postJson<Product>(
      dummyApiUrl,
      updateData,
      "DummyJSON update product simulation",
      "PUT"
    );
    console.log("DummyJSON update simulation response:", dummyApiResponse);
  } catch (dummyError) {
    console.warn("DummyJSON API simulation failed:", dummyError);
  }

  const result = await updateProduct(id, field, value);

  if (!result.success) {
    throw new Error(result.errors?.join(", ") || "Failed to update product");
  }
  return { id, field, value };
}
