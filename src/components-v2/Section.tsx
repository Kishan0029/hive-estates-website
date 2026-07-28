import * as React from "react"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { Button } from "./Button"

export function Section({
  children,
  title,
  subtitle,
  viewAll,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
  viewAll?: string
  className?: string
  containerClassName?: string
}) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className={cn("container-p mx-auto max-w-7xl", containerClassName)}>
        {(title || viewAll) && (
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {title && (
                <h2 className="font-display text-3xl md:text-4xl font-extrabold text-v2-ink tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && <p className="mt-2 text-lg text-v2-ink/60">{subtitle}</p>}
            </div>
            {viewAll && (
              <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full font-bold">
                <Link to={viewAll}>View All &rarr;</Link>
              </Button>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
