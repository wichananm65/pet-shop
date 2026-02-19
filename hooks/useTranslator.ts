"use client"

import { useContext } from "react"
import { TranslatorContext } from "@/components/common/TranslatorProvider"

// Primary hook used across client components. It consumes the app-wide
// TranslatorContext (provided by TranslatorProvider). If the provider is not
// present, fall back to a minimal no-op implementation so components still work
// during tests or isolated usage.
export default function useTranslator() {
  const ctx = useContext(TranslatorContext)
  if (ctx) return ctx

  // Fallback (should be rare): return a simple passthrough implementation.
  return {
    t: (k: string) => k,
    lang: "en" as const,
    setLang: (() => {}) as (l: string) => void,
  }
}

