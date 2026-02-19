"use client"

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react"
import en from "@/locales/en.json"
import th from "@/locales/th.json"

export type LocaleKey = "en" | "th"

type TranslationDict = { [key: string]: string | TranslationDict }

const DICT: Record<LocaleKey, TranslationDict> = { en, th }

export type TranslatorContextValue = {
  t: (key: string, vars?: Record<string, string | number>) => string
  lang: LocaleKey
  setLang: (l: LocaleKey) => void
}

export const TranslatorContext = createContext<TranslatorContextValue | undefined>(undefined)

export function TranslatorProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LocaleKey>("en")

  // read persisted preference on mount
  useEffect(() => {
    try {
      const v = typeof window !== "undefined" ? (localStorage.getItem("lang") as LocaleKey | null) : null
      if (v) setTimeout(() => setLang(v), 0)
    } catch {
      /* ignore */
    }
  }, [])

  // persist preference
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang)
    } catch {}
  }, [lang])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const parts = key.split(".")
      let cur: TranslationDict | string = DICT[lang] || {}
      for (const p of parts) {
        if (typeof cur === "string") return key
        cur = (cur as TranslationDict)[p]
        if (cur === undefined) return key
      }
      if (typeof cur !== "string") return key
      if (!vars) return cur
      let out = cur
      for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v))
      return out
    },
    [lang]
  )

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang])

  return <TranslatorContext.Provider value={value}>{children}</TranslatorContext.Provider>
}

export default TranslatorProvider
