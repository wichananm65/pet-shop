"use client"

import React, { createContext, useContext, useState } from "react"
import { getAuthToken, setAuthToken, clearAuthToken } from "@/utils/authUtil"

type User = {
  userId: number
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  gender?: string
  avatarPic?: string
  mainAddressId?: number | null
}

type AuthContextType = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user?: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // start with null on both server and client; read from storage after
  // mounting to avoid hydration mismatches when localStorage contains a
  // previously saved auth state.
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  React.useEffect(() => {
    setToken(getAuthToken())
    try {
      const raw = localStorage.getItem("authUser")
      if (raw) setUser(JSON.parse(raw))
    } catch {}
  }, [])

  const login = (t: string, u: User | null = null) => {
    try {
      setAuthToken(t)
      if (u) localStorage.setItem("authUser", JSON.stringify(u))
    } catch {}
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    try {
      clearAuthToken()
      localStorage.removeItem("authUser")
    } catch {}
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export default AuthProvider
