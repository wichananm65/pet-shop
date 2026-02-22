import { API_BASE_URL } from "../api"

// helper copied from other services
async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }
  return (await res.json()) as T
}

export type AddressDto = {
  addressId: number
  userId: number
  addressDesc?: string | null
  phone?: string | null
  addressName?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

function authHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem("authToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export async function getAddresses(): Promise<AddressDto[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/address` : "/api/v1/address"
  const res = await fetch(url, { method: "GET", headers: { ...authHeaders() } })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }
  return (await res.json()) as AddressDto[]
}

export async function addAddress(desc: string, phone: string, name: string): Promise<AddressDto> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/address` : "/api/v1/address"
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ addressDesc: desc, phone, addressName: name }),
  })
  return handleJsonResponse<AddressDto>(res)
}

export async function updateAddress(addressId: number, desc: string, phone: string, name: string): Promise<AddressDto> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/address` : "/api/v1/address"
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ addressId, addressDesc: desc, phone, addressName: name }),
  })
  return handleJsonResponse<AddressDto>(res)
}

export async function deleteAddress(addressId: number): Promise<void> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/address` : "/api/v1/address"
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ addressId }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }
}
