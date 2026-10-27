"use client"

import { useEffect, useState } from "react"
import { CalendarDays, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { League, Round, RoundMatch } from "@/lib/api"
import { TeamCrest } from "./team-crest"
import { SectionHeading } from "./section-heading"
import { formatMatchDay, formatMatchTime, isPlayed } from "./tournament-utils"

interface CalendarSectionProps {
  league: League
  rounds: Round[]
  logoOf: (teamId: string | number) => string | undefined
}

// Jornada a mostrar por defecto: la primera con partidos pendientes, o la última.
function defaultRound(rounds: Round[]): number | null {
  const pending = rounds.find((r) => r.matches.some((m) => !isPlayed(m)))
  return (pending ?? rounds[rounds.length - 1])?.round ?? null
}

export function CalendarSection({ league, rounds, logoOf }: CalendarSectionProps) {
  const [selected, setSelected] = useState<number | null>(() => defaultRound(rounds))

  useEffect(() => { setSelected(defaultRound(rounds)) }, [rounds])

  const round = rounds.find((r) => r.round === selected)

  return (
    <section id="calendario" className="scroll-mt-28 border-y border-white/10 bg-[#081028]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Fixture oficial" title="Calendario" />

        {rounds.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center text-sm text-slate-400">
            El calendario de {league.name} aún no ha sido publicado.
          </p>
        ) : (
          <>
            <div role="tablist" aria-label="Jornadas" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {rounds.map((r) => {
                const done = r.matches.every(isPlayed)
                const active = r.round === selected
                return (
                  <button
                    key={r.round}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelected(r.round)}
                    className={cn(
                      "shrink-0 rounded-xl border px-4 py-2.5 text-left transition-all",
                      active
                        ? "border-amber-300/70 bg-amber-300/10"
                        : "border-white/10 hover:border-white/30",
                    )}
                  >
                    <span className={cn("block text-[10px] font-semibold uppercase tracking-widest", active ? "text-amber-300" : "text-slate-500")}>
                      {done ? "Disputada" : "Por jugar"}
                    </span>
                    <span className={cn("font-display text-lg font-bold uppercase", active ? "text-white" : "text-slate-300")}>
                      Jornada {r.round}
                    </span>
                  </button>
                )
              })}
            </div>

            {round && (
              <ul className="space-y-3">
                {round.matches.map((m) => (
                  <FixtureRow key={m.id} match={m} logoOf={logoOf} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function FixtureRow({ match, logoOf }: { match: RoundMatch; logoOf: CalendarSectionProps["logoOf"] }) {
  const played = isPlayed(match)
  const time = formatMatchTime(match.scheduled_at)

  return (
    <li className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[150px_1fr_160px] sm:p-5">
      <div className="flex items-center gap-2 text-sm text-slate-300 sm:block">
        <CalendarDays className="h-4 w-4 text-slate-500 sm:hidden" />
        <span className="font-medium text-white">{formatMatchDay(match.scheduled_at)}</span>
        {time && <span className="text-slate-400 sm:mt-0.5 sm:block">{time} h</span>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center justify-end gap-3">
          <span className="truncate text-right font-semibold text-white">{match.team1_name}</span>
          <TeamCrest name={match.team1_name} abbr={match.team1_abbr} logo={logoOf(match.team1_id)} />
        </div>
        {played ? (
          <span className="min-w-[84px] rounded-lg bg-white px-3 py-1.5 text-center font-display text-2xl font-bold tabular-nums text-[#060b1d]">
            {match.score_team1} – {match.score_team2}
          </span>
        ) : (
          <span className="min-w-[84px] rounded-lg border border-white/15 px-3 py-1.5 text-center font-display text-xl font-bold text-slate-400">
            VS
          </span>
        )}
        <div className="flex min-w-0 items-center gap-3">
          <TeamCrest name={match.team2_name} abbr={match.team2_abbr} logo={logoOf(match.team2_id)} />
          <span className="truncate font-semibold text-white">{match.team2_name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
            played ? "bg-emerald-400/10 text-emerald-300" : "bg-white/10 text-slate-300",
          )}
        >
          {played ? "Final" : "Programado"}
        </span>
        {match.venue && (
          <span className="inline-flex items-center gap-1 truncate text-xs capitalize text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {match.venue}
          </span>
        )}
      </div>
    </li>
  )
}
