import { API_BASE_URL } from "../api"

export type CartItemDto = {
  productID: number
  productName?: string | null
  productNameTH?: string | null
  productDesc?: string | null
  productDescTH?: string | null
  productPrice?: number | null
  productImg?: string | null
  score?: number | null
  quantity: number
}

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

// simple pub/sub so that multiple components using useCart can be notified
// when the cart changes and trigger their own reloads.
// listeners receive no arguments.
const cartListeners = new Set<() => void>()

export function onCartChange(cb: () => void) {
  cartListeners.add(cb)
  return () => cartListeners.delete(cb)
}

function notifyCartChange() {
  cartListeners.forEach((cb) => cb())
}

export async function addToCart(productID: number, quantity: number = 1): Promise<CartItemDto[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/product/cart` : "/api/v1/product/cart"
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ productID, quantity }),
  })

  const items = await handleJsonResponse<CartItemDto[]>(res)
  // notify listeners after a successful update
  notifyCartChange()
  return items
}

// reused by cart since CartItemDto already contains all product fields plus quantity
export type CartProductDto = CartItemDto

export async function getCart(): Promise<CartItemDto[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/cart` : "/api/v1/cart"
  const res = await fetch(url, { method: "GET", headers: { ...authHeaders() } })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }
  return (await res.json()) as CartItemDto[]
}
