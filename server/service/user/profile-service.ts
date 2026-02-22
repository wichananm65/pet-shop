import { API_BASE_URL } from "../api"

export type ProfileDto = {
  userId: number
  email: string
  firstName: string
  lastName: string
  phone: string
  gender: string
  avatarPic?: string | null
  favoriteProductId?: number | null
  favoriteProductIDs?: number[] | null
}

function authHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem("authToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export async function getProfile(): Promise<ProfileDto> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/profile` : "/api/v1/profile"
  const res = await fetch(url, { method: "GET", headers: { ...authHeaders() } })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }

  return (await res.json()) as ProfileDto
}
