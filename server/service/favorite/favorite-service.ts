import { API_BASE_URL } from "../api"

// Response from POST/DELETE /api/v1/favorites
export type FavoriteToggleResponse = {
  productId: number
  favoriteProductId: number[]
}

export type FavoriteResponse = FavoriteProductDto[]

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      try {
        const data = await res.json()
        const msg = (data && typeof data === "object" && "message" in data)
          ? ((): string => {
              const maybe = data as { message?: unknown }
              return typeof maybe.message === "string" ? maybe.message : String(maybe.message ?? JSON.stringify(data))
            })()
          : JSON.stringify(data)
        throw { status: res.status, message: msg || res.statusText }
      } catch {
        const text = await res.text().catch(() => res.statusText)
        throw { status: res.status, message: text || res.statusText }
      }
    }
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }
  return (await res.json()) as T
}

function authHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem("authToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export async function addFavorite(productId: number): Promise<FavoriteToggleResponse> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/favorites` : "/api/v1/favorites"
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ productId }),
  })

  return handleJsonResponse<FavoriteToggleResponse>(res)
}

export async function removeFavorite(productId: number): Promise<FavoriteToggleResponse> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/favorites` : "/api/v1/favorites"
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ productId }),
  })

  return handleJsonResponse<FavoriteToggleResponse>(res)
}

export type FavoriteProductDto = {
  productID: number
  productName?: string | null
  productNameTH?: string | null
  productDesc?: string | null
  productDescTH?: string | null
  productPrice?: number | null
  productImg?: string | null
  score?: number | null
}

export async function getFavorites(): Promise<FavoriteProductDto[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/favorites` : "/api/v1/favorites"
  const res = await fetch(url, { method: "GET", headers: { ...authHeaders() } })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }
  return (await res.json()) as FavoriteProductDto[]
}
