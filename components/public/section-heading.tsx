import type { ReactNode } from "react"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  action?: ReactNode
}

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          <span className="h-px w-8 bg-amber-300/60" />
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}
