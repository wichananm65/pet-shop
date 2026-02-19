import { API_BASE_URL } from "../api"

export type CategoryDto = {
  categoryID: number
  categoryName: string
  categoryImg?: string | null
}

export async function listCategories(limit = 100): Promise<CategoryDto[]> {
  const base = API_BASE_URL ? `${API_BASE_URL}/api/v1/product/category` : "/api/v1/product/category"
  const qp = new URLSearchParams()
  if (limit) qp.set("limit", String(limit))
  const url = qp.toString() ? `${base}?${qp.toString()}` : base

  const res = await fetch(url)
  if (!res.ok) throw new Error("failed to fetch categories")
  return (await res.json()) as CategoryDto[]
}
