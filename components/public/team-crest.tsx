import { cn } from "@/lib/utils"

const PALETTE = [
  "from-sky-500 to-indigo-700",
  "from-rose-500 to-red-800",
  "from-emerald-500 to-teal-800",
  "from-amber-400 to-orange-700",
  "from-violet-500 to-purple-800",
  "from-cyan-400 to-blue-700",
]

function paletteFor(name: string) {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

const SIZES = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-11 w-11 text-xs",
  lg: "h-16 w-16 text-sm sm:h-20 sm:w-20 sm:text-base",
}

interface TeamCrestProps {
  name: string
  abbr: string
  logo?: string | null
  size?: keyof typeof SIZES
  className?: string
}

export function TeamCrest({ name, abbr, logo, size = "md", className }: TeamCrestProps) {
  if (logo) {
    return (
      <span className={cn("shrink-0 rounded-full bg-white/95 p-1.5 ring-1 ring-white/20 grid place-items-center", SIZES[size], className)}>
        <img src={logo} alt={name} className="h-full w-full object-contain" />
      </span>
    )
  }
  return (
    <span
      aria-label={name}
      className={cn(
        "shrink-0 rounded-full bg-gradient-to-br grid place-items-center font-black text-white ring-1 ring-white/25 shadow-lg shadow-black/30",
        paletteFor(name),
        SIZES[size],
        className,
      )}
    >
      {abbr.slice(0, 3).toUpperCase()}
    </span>
  )
}
