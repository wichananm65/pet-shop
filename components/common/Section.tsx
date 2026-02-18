import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronRightIcon } from "lucide-react"

export type SectionProps = {
  name: React.ReactNode
  /** show small "see more" in the header (uses `href` or `onSeeMore`) */
  seeMore?: boolean
  /** show large centered "See more" button below content */
  showMore?: boolean
  /** grid columns (1-6) or raw className string for custom grid */
  grid?: number | string
  href?: string
  onSeeMore?: () => void
  children?: React.ReactNode
  className?: string
  id?: string
}

const defaultGrid =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"

function getGridClass(grid?: number | string) {
  if (!grid) return defaultGrid
  if (typeof grid === "string") return `grid ${grid}`

  switch (grid) {
    case 1:
      return "grid grid-cols-1 gap-4"
    case 2:
      return "grid grid-cols-2 gap-4"
    case 3:
      return "grid grid-cols-2 sm:grid-cols-3 gap-4"
    case 4:
      return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    case 5:
      return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    case 6:
      return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
    default:
      return defaultGrid
  }
}

/**
 * Generic Section wrapper used across pages (title + optional see-more + grid content + optional footer button)
 */
export default function Section({
  name,
  seeMore = false,
  showMore = false,
  grid,
  href,
  onSeeMore,
  children,
  className,
  id,
}: SectionProps) {
  const gridCls = getGridClass(grid)

  return (
    <section id={id} className={cn("mb-6 rounded-md shadow-sm overflow-hidden", className)}>
      <div className="flex items-center justify-between bg-orange-50 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-800">{name}</h3>

        {seeMore && (
          <div>
            {href ? (
              <Link
                href={href}
                className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
                aria-label={`See more ${typeof name === "string" ? name : "section"}`}>
                <span>see more</span>
                <ChevronRightIcon className="w-5 h-5 text-black" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onSeeMore}
                className="inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
                aria-label={`See more ${typeof name === "string" ? name : "section"}`}>
                <span>see more</span>
                <ChevronRightIcon className="w-5 h-5 text-black"/>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-4">
        <div className={cn(gridCls)}>{children}</div>

        {showMore && (
          <div className="mt-6 flex justify-center">
            <Button variant="default" size="lg" className="w-44">
              See more
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
