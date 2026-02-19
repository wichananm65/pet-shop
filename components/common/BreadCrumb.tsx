import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type Crumb = {
  label: React.ReactNode
  href?: string
  current?: boolean
  asChild?: boolean
}

export function BreadCrumb({
  items,
  separator,
  className,
  size = "md",
}: {
  items: Crumb[]
  separator?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  if (!items || items.length === 0) return null

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList size={size}>
        {items.map((it, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              {!it.current && it.href ? (
                <BreadcrumbLink href={it.href} asChild={it.asChild}>
                  {it.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-orange-600 font-semibold">{it.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < items.length - 1 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Backwards-compatible example usage
import useTranslator from "@/hooks/useTranslator"
export function BreadcrumbBasic() {
  const { t } = useTranslator()
  return (
    <BreadCrumb
      items={[
        { label: t("home"), href: "/" },
        { label: t("breadcrumb.components"), href: "#" },
        { label: t("breadcrumb.page"), current: true },
      ]}
    />
  )
}
