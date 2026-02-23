"use client"

import Image from "next/image"
import Link from "next/link"

export type ProductCardProps = {
  id: number
  name?: string | null
  nameTH?: string | null
  price?: number | null
  img?: string | null
  href?: string
}

export default function ProductCard({
  id,
  name,
  nameTH,
  price,
  img,
  href = "#",
}: ProductCardProps) {
  const display = name || nameTH || `#${id}`

  return (
    <Link
      href={href}
      className="rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="relative w-full aspect-4/3 bg-white">
        <Image
          src={img ?? "/shopping/placeholder.svg"}
          alt={display}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="p-2 text-sm">
        <div className="truncate">{display}</div>
        {price != null && (
          <div className="text-orange-600 font-semibold">฿{price}</div>
        )}
      </div>
    </Link>
  )
}