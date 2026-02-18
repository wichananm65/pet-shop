import { API_BASE_URL } from "../api"

export type BannerDto = {
  bannerID: number
  bannerImg?: string | null
  link?: string | null
  alt?: string | null
}

export async function listBanners(limit = 10): Promise<BannerDto[]> {
  const base = API_BASE_URL ? `${API_BASE_URL}/api/v1/product/banner` : "/api/v1/product/banner"
  const qp = new URLSearchParams()
  if (limit) qp.set("limit", String(limit))
  const url = qp.toString() ? `${base}?${qp.toString()}` : base

  const res = await fetch(url)
  if (!res.ok) throw new Error("failed to fetch banners")
  return (await res.json()) as BannerDto[]
}
