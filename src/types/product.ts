export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export type ProductSortField = "price" | "stock" | "title";
export type SortOrder = "asc" | "desc";
export type ProductEditField = "title" | "price" | "stock";

export interface ProductsSearch {
  search?: string;
  category?: string;
  page?: number;
  sortBy?: ProductSortField;
  sortOrder?: SortOrder;
}

export interface ProductFilters {
  search?: string;
  selectedCategories: string[];
  sortBy?: ProductSortField;
  sortOrder?: SortOrder;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
