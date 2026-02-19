import { API_BASE_URL } from "../api"

export type ShoppingMallDto = {
  productID: number
  productImg?: string | null
  price?: number | null
  score?: number | null
  productName?: string | null
  productNameTH?: string | null
}

export async function listShoppingMall(limit = 100): Promise<ShoppingMallDto[]> {
  const base = API_BASE_URL ? `${API_BASE_URL}/api/v1/shopping-mall` : "/api/v1/shopping-mall"
  const qp = new URLSearchParams()
  if (limit) qp.set("limit", String(limit))
  const url = qp.toString() ? `${base}?${qp.toString()}` : base

  const res = await fetch(url)
  if (!res.ok) throw new Error("failed to fetch shopping mall items")
  return (await res.json()) as ShoppingMallDto[]
}
