"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { getAuthToken, setAuthToken, clearAuthToken } from "@/utils/authUtil"

type AuthContextType = {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = getAuthToken()
    setToken(t)
  }, [])

  const login = (t: string) => {
    try {
      setAuthToken(t)
    } catch {}
    setToken(t)
  }

  const logout = () => {
    try {
      clearAuthToken()
    } catch {}
    setToken(null)
  }

  const value: AuthContextType = {
    token,
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
