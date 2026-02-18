import { API_BASE_URL } from "../api"

export type RecommendedDto = {
  productID: number
  productImg?: string | null
  productName?: string | null
  productNameTH?: string | null
  productPrice?: number | null
  score?: number | null
}

export async function listRecommended(limit = 12, offset = 0): Promise<RecommendedDto[]> {
  const base = API_BASE_URL ? `${API_BASE_URL}/api/v1/product/recommended` : "/api/v1/product/recommended"
  const qp = new URLSearchParams()
  if (limit) qp.set("limit", String(limit))
  if (offset) qp.set("offset", String(offset))
  const url = qp.toString() ? `${base}?${qp.toString()}` : base

  const res = await fetch(url)
  if (!res.ok) throw new Error("failed to fetch recommended products")
  return (await res.json()) as RecommendedDto[]
}
