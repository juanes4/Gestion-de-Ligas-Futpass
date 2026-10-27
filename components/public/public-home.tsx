"use client"

import { useCallback, useMemo } from "react"
import { RefreshCw, Trophy, WifiOff } from "lucide-react"
import { usePublicTournament } from "@/lib/hooks/usePublicTournament"
import { SiteHeader } from "./site-header"
import { TournamentHero } from "./tournament-hero"
import { HighlightsSection } from "./highlights-section"
import { CalendarSection } from "./calendar-section"
import { StandingsSection } from "./standings-section"

export function PublicHome() {
  const { leagues, teams, league, rounds, standings, selectLeague, loading, error, retry } = usePublicTournament()

  const logos = useMemo(() => new Map(teams.map((t) => [String(t.id), t.logo])), [teams])
  const logoOf = useCallback((id: string | number) => logos.get(String(id)) || undefined, [logos])

  return (
    <div className="min-h-screen bg-[#060b1d] text-slate-100 selection:bg-amber-300 selection:text-[#060b1d]">
      <SiteHeader />

      <main>
        {error && !league ? (
          <StateMessage
            icon={<WifiOff className="h-8 w-8 text-rose-300" />}
            title="No pudimos cargar la copa"
            description={error}
            action={
              <button
                onClick={retry}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-[#060b1d] hover:bg-amber-200"
              >
                <RefreshCw className="h-4 w-4" /> Reintentar
              </button>
            }
          />
        ) : !league && loading ? (
          <HeroSkeleton />
        ) : !league ? (
          <StateMessage
            icon={<Trophy className="h-8 w-8 text-amber-300" />}
            title="Muy pronto"
            description="La próxima edición de la copa se anunciará en breve."
          />
        ) : (
          <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <TournamentHero
              leagues={leagues}
              league={league}
              rounds={rounds}
              standings={standings}
              onSelectLeague={selectLeague}
              logoOf={logoOf}
            />
            <HighlightsSection rounds={rounds} logoOf={logoOf} />
            <CalendarSection league={league} rounds={rounds} logoOf={logoOf} />
            <StandingsSection standings={standings} logoOf={logoOf} />
          </div>
        )}
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span className="font-display text-sm font-bold tracking-widest text-slate-300">FOOTPASS · COPA OFICIAL</span>
          <span>Resultados y calendario actualizados por la organización del torneo.</span>
        </div>
      </footer>
    </div>
  )
}

function StateMessage({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">{icon}</span>
      <h1 className="mt-5 font-display text-3xl font-bold uppercase text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      {action}
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-14 sm:px-6">
      <div className="h-6 w-40 rounded-full bg-white/10" />
      <div className="mt-6 h-20 w-3/4 max-w-xl rounded-xl bg-white/10" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="mt-16 h-64 rounded-3xl bg-white/5" />
    </div>
  )
}
