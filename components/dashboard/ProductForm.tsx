"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductDto } from "@/server/service/product/product-service"

interface Props {
  initial?: Partial<ProductDto>
  onSave: (data: Partial<ProductDto>) => void
}

export default function ProductForm({ initial, onSave }: Props) {
  const [name, setName] = useState(initial?.productName || "")
  const [price, setPrice] = useState(initial?.productPrice || 0)
  const [description, setDescription] = useState(initial?.productDesc || "")
  const [category, setCategory] = useState(initial?.category || "")
  const [pic, setPic] = useState(initial?.productPic || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      productName: name,
      productPrice: price,
      productDesc: description,
      category,
      productPic: pic,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1">Image URL</label>
        <input
          value={pic}
          onChange={(e) => setPic(e.target.value)}
          className="w-full border px-2 py-1"
        />
      </div>
      <div>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}