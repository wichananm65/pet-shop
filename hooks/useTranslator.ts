"use client"

import { useCallback, useEffect, useState } from "react"
import en from "@/locales/en.json"
import th from "@/locales/th.json"

type LocaleKey = "en" | "th"

const DICT: Record<LocaleKey, Record<string, any>> = {
  en,
  th,
}

export default function useTranslator() {
  const [lang, setLang] = useState<LocaleKey>(() => {
    try {
      const v = typeof window !== "undefined" ? localStorage.getItem("lang") : null
      return (v as LocaleKey) || "en"
    } catch {
      return "en"
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang)
    } catch {}
  }, [lang])

  const t = useCallback(
    (key: string) => {
      const parts = key.split(".")
      let cur: any = DICT[lang] || {}
      for (const p of parts) {
        cur = cur?.[p]
        if (cur === undefined) return key
      }
      return typeof cur === "string" ? cur : key
    },
    [lang]
  )

  return { t, lang, setLang }
}
