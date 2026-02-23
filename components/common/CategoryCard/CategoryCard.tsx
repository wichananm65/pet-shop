"use client"
import Image from "next/image"
import Link from "next/link"

type CategoryCardProps = {
  name: string
  imageSrc?: string | null
  href?: string
}

export default function CategoryCard({ name, imageSrc, href = "#" }: CategoryCardProps) {
  const displayName = name

  return (
    <Link
      href={href}
      className="block rounded-lg transform transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 w-30"
      aria-label={displayName}
    >
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-linear-to-t from-orange-600 via-orange-500 to-orange-300 text-white flex flex-col items-center justify-center px-4 py-10 shadow-sm h-45">
        <div className="relative w-20 h-20">
          {imageSrc ? (
            <Image src={imageSrc} alt={displayName} fill className="object-contain" sizes="70px" />
          ) : (
            <div className="flex items-center justify-center w-full h-full rounded-md bg-gray-200 text-gray-700 font-bold">{displayName.charAt(0)}</div>
          )}
        </div>
        <div className="mt-4 text-center text-sm font-semibold leading-none">{displayName}</div>
      </div>
    </Link>
  )
} 