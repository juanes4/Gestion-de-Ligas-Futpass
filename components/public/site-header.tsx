import Link from "next/link"
import { Trophy, LogIn } from "lucide-react"

const NAV = [
  { href: "#destacados", label: "Destacados" },
  { href: "#calendario", label: "Calendario" },
  { href: "#clasificacion", label: "Clasificación" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060b1d]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-[#060b1d] shadow-lg shadow-amber-500/20">
            <Trophy className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-bold tracking-wider text-white">FOOTPASS</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300/80">Copa oficial</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-amber-300/60 hover:text-amber-200"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">Organizadores</span>
        </Link>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
