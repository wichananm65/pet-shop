"use client"

import { useState, useEffect, useCallback } from "react"
import * as ProfileService from "@/server/service/user/profile-service"

export type Profile = ProfileService.ProfileDto

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ProfileService.getProfile()
      setProfile(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "failed to load profile")
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const reload = useCallback(() => {
    load()
  }, [load])

  return { profile, loading, error, reload }
}
