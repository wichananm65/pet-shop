import ProductDetail from "@/components/(main)/ProductDetail"
import { getProductV1, type ProductV1Dto } from "@/server/service/product/product-service"

type Props = { params: { id: string } | Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  // `params` can be a Promise in Next internals — unwrap it before accessing properties
  const { id } = await params
  const numericId = Number(id)

  let initial: ProductV1Dto | null = null
  try {
    if (!Number.isNaN(numericId)) {
      initial = await getProductV1(numericId)
    }
  } catch {
    // ignore — client will handle not-found / errors
  }

  return (
    <div className="py-8">
      <ProductDetail id={numericId} initial={initial} />
    </div>
  )
}