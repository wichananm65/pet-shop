import { API_BASE_URL, postJson } from "../api"

export type ProductDto = {
  productId: number
  productName: string
  productNameEn?: string | null
  productPrice?: number
  score?: number
  productDesc?: string | null
  category?: string | null
  productPic?: string | null
  productPicSecond?: string | null
}

export async function listProducts(): Promise<ProductDto[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/products` : "/products"
  const res = await fetch(url)
  if (!res.ok) throw new Error("failed to fetch products")
  return (await res.json()) as ProductDto[]
}


export type ShoppingMallItem = {
  productId: number
  productPic?: string | null
}

export async function listShoppingMall(): Promise<ShoppingMallItem[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/product/shopping-mall` : "/api/v1/product/shopping-mall"
  const res = await fetch(url)
  if (!res.ok) throw new Error("failed to fetch shopping mall items")
  return (await res.json()) as ShoppingMallItem[]
}

// --- API v1 product detail (backend returns `productID`, `productName`, `productNameTH`, `productPrice`, `productImg`, `productDesc`, `productDescTH`, `score`, `category`) ---
export type ProductV1Dto = {
  productID: number
  productName?: string | null
  productNameTH?: string | null
  productPrice?: number | null
  productImg?: string | null
  productDesc?: string | null
  productDescTH?: string | null
  score?: number | null
  category?: string | null
}

export async function getProductV1(id: number): Promise<ProductV1Dto> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/product/${id}` : `/api/v1/product/${id}`
  const res = await fetch(url)
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText)
    throw new Error(txt || "failed to fetch product")
  }
  return (await res.json()) as ProductV1Dto
}


/**
 * Dev-only: reset product table on the backend. The backend only allows this when
 * ALLOW_RESET_PRODUCTS=1 is set (server-side check).
 */
export async function resetProducts(payload?: Partial<ProductDto>[]) {
  return postJson<ProductDto[]>((API_BASE_URL ? `${API_BASE_URL}` : "") + "/dev/reset-products", payload || [])
}
