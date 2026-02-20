"use client"

import React from "react"
import { Star } from "lucide-react"

type RatingProps = {
  score?: number | null
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
  srLabel?: boolean
}

const sizeClass: Record<NonNullable<RatingProps["size"]>, string> = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
}

export default function Rating({ score = 0, max = 5, size = "sm", className = "", srLabel = true }: RatingProps) {
  const s = Math.max(0, Math.min(max, Math.round(Number(score ?? 0))))
  return (
    <div className={`flex items-center gap-1 text-sm text-muted-foreground ${className}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass[size]} ${i < s ? "text-orange-500 fill-orange-500" : "text-gray-200"}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
      {srLabel && <span className="sr-only">{`${s} out of ${max} stars`}</span>}
    </div>
  )
}
