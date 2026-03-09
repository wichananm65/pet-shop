import { API_BASE_URL } from "../api"
import type { ProductV1Dto } from "../product/product-service"

export type CartItem = {
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

// Raw shape returned by the Go backend
type RawOrderDto = {
  orderID: number
  userID: number
  cart?: Record<string, number> | null
  cartProducts?: Record<string, ProductV1Dto> | null
  quantity: number
  totalPrice: number
  shippingPrice: number
  grandPrice: number
  status?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type OrderDto = Omit<RawOrderDto, "cart" | "cartProducts"> & {
  cart?: Record<string, number> | null
  cartProducts?: Record<string, ProductV1Dto> | null
  cartItems?: CartItem[]
}

function buildCartItems(raw: RawOrderDto): CartItem[] {
  const cart = raw.cart ?? {}
  const products = raw.cartProducts ?? {}
  return Object.entries(cart).map(([pidStr, qty]) => {
    const p = products[pidStr]
    return {
      productID: Number(pidStr),
      productName: p?.productName ?? null,
      productNameTH: p?.productNameTH ?? null,
      productDesc: p?.productDesc ?? null,
      productDescTH: p?.productDescTH ?? null,
      productPrice: p?.productPrice ?? null,
      productImg: p?.productImg ?? null,
      score: p?.score ?? null,
      quantity: qty,
    }
  })
}

function normalizeOrder(raw: RawOrderDto): OrderDto {
  return {
    ...raw,
    cartItems: buildCartItems(raw),
  }
}

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      try {
        const data = await res.json()
        const msg =
          data && typeof data === "object" && "message" in data
            ? ((): string => {
                const maybe = data as { message?: unknown }
                return typeof maybe.message === "string"
                  ? maybe.message
                  : String(maybe.message ?? JSON.stringify(data))
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

export async function createOrder(
  cart: Record<string, number>,
  quantity: number,
  totalPrice: number,
  shippingPrice: number,
  grandPrice: number
): Promise<OrderDto> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/orders` : "/api/v1/orders"
  const headers = {
      "Content-Type": "application/json",
      ...authHeaders(),
    }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ cart, quantity, totalPrice, shippingPrice, grandPrice }),
  })
  const raw = await handleJsonResponse<RawOrderDto>(res)
  return normalizeOrder(raw)
}

export async function getOrders(): Promise<OrderDto[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/orders` : "/api/v1/orders"
  const res = await fetch(url, {
    headers: {
      ...authHeaders(),
    },
  })
  const raws = await handleJsonResponse<RawOrderDto[]>(res)
  return raws.map(normalizeOrder)
}
