import { CalendarDays, Crown, MapPin, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { League, Round, Standing } from "@/lib/api"
import { TeamCrest } from "./team-crest"
import {
  LEAGUE_STATUS,
  formatMatchDay,
  formatMatchTime,
  formatRange,
  nextMatch,
  standingLeaders,
  tournamentStats,
} from "./tournament-utils"

interface TournamentHeroProps {
  leagues: League[]
  league: League
  rounds: Round[]
  standings: Standing[]
  onSelectLeague: (id: string) => void
  logoOf: (teamId: string | number) => string | undefined
}

export function TournamentHero({ leagues, league, rounds, standings, onSelectLeague, logoOf }: TournamentHeroProps) {
  const stats = tournamentStats(rounds)
  const status = LEAGUE_STATUS[league.state] ?? { label: league.state, live: false }
  const range = formatRange(league.start_date, league.end_date)
  const totalRounds = rounds.length
  const shownRound = Math.min(Math.max(league.current_round, 1), Math.max(totalRounds, 1))

  return (
    <section id="inicio" className="relative overflow-hidden border-b border-white/10">
      {/* Fondo: halo dorado + campo estrellado */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[400px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <Trophy className="absolute -right-10 top-10 h-[340px] w-[340px] text-white/[0.03]" strokeWidth={1} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pt-14">
        {leagues.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {leagues.map((l) => {
              const selected = l.id === league.id
              return (
                <button
                  key={l.id}
                  onClick={() => onSelectLeague(String(l.id))}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                    selected
                      ? "border-amber-300 bg-amber-300 text-[#060b1d] shadow-lg shadow-amber-500/20"
                      : "border-white/15 text-slate-300 hover:border-white/40 hover:text-white",
                  )}
                >
                  {l.name}
                </button>
              )
            })}
          </div>
        )}

        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em]">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1",
                  status.live ? "bg-emerald-400/10 text-emerald-300" : "bg-white/10 text-slate-300",
                )}
              >
                {status.live && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                )}
                {status.label}
              </span>
              <span className="text-amber-300/90">Copa de Campeones</span>
            </div>

            <h1 className="mt-5 font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 sm:text-8xl">
              {league.name}
            </h1>

            {range && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300">
                <CalendarDays className="h-4 w-4 text-amber-300" />
                {range}
              </p>
            )}

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              <Stat label="Equipos" value={league.teams?.length ?? standings.length} />
              <Stat label="Partidos" value={`${stats.played}/${stats.totalMatches}`} />
              <Stat label="Goles" value={stats.goals} />
              <Stat label="Goles / partido" value={stats.avgGoals} />
            </dl>

            {totalRounds > 0 && (
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs font-medium text-slate-400">
                  <span>{league.state === "completed" ? "Torneo finalizado" : `Jornada ${shownRound} de ${totalRounds}`}</span>
                  <span>{stats.progress}% disputado</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-200 transition-all duration-700"
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <SpotlightCard league={league} rounds={rounds} standings={standings} logoOf={logoOf} />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#0a1230] px-5 py-4">
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-bold text-white">{value}</dd>
    </div>
  )
}

// Tarjeta lateral: el campeón si el torneo terminó, si no el próximo partido.
function SpotlightCard({ league, rounds, standings, logoOf }: Omit<TournamentHeroProps, "leagues" | "onSelectLeague">) {
  const { leader } = standingLeaders(standings)
  const upcoming = nextMatch(rounds)

  if (league.state === "completed" && leader) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/15 via-[#0c1430] to-[#0c1430] p-7 text-center">
        <Crown className="mx-auto h-8 w-8 text-amber-300" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">Campeón</p>
        <TeamCrest name={leader.name} abbr={leader.abbreviation} logo={logoOf(leader.id)} size="lg" className="mx-auto mt-5" />
        <p className="mt-4 font-display text-4xl font-bold uppercase text-white">{leader.name}</p>
        <p className="mt-1 text-sm text-slate-300">
          {leader.points} pts · {leader.won}G {leader.drawn}E {leader.lost}P
        </p>
      </div>
    )
  }

  if (!upcoming) return null

  const time = formatMatchTime(upcoming.scheduled_at)
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
        <span className="text-amber-300">Próximo partido</span>
        <span className="text-slate-400">Jornada {upcoming.round}</span>
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <TeamBlock id={upcoming.team1_id} name={upcoming.team1_name} abbr={upcoming.team1_abbr} logoOf={logoOf} />
        <span className="font-display text-2xl font-bold text-slate-500">VS</span>
        <TeamBlock id={upcoming.team2_id} name={upcoming.team2_name} abbr={upcoming.team2_abbr} logoOf={logoOf} />
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-white/10 pt-4 text-sm text-slate-300">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {formatMatchDay(upcoming.scheduled_at)}
          {time && ` · ${time}`}
        </span>
        {upcoming.venue && (
          <span className="inline-flex items-center gap-1.5 capitalize">
            <MapPin className="h-4 w-4 text-slate-400" />
            {upcoming.venue}
          </span>
        )}
      </div>
    </div>
  )
}

function TeamBlock({ id, name, abbr, logoOf }: { id: string; name: string; abbr: string; logoOf: TournamentHeroProps["logoOf"] }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <TeamCrest name={name} abbr={abbr} logo={logoOf(id)} size="lg" />
      <span className="truncate text-sm font-semibold text-white">{name}</span>
    </div>
  )
}
