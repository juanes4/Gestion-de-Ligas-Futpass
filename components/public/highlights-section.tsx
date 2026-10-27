import { Flag, MapPin, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Round, RoundMatch } from "@/lib/api"
import { TeamCrest } from "./team-crest"
import { SectionHeading } from "./section-heading"
import { formatMatchDay, highlightTag, playedMatches, type HighlightTag } from "./tournament-utils"

const TAG_TONES: Record<HighlightTag["tone"], string> = {
  gold: "bg-amber-300/15 text-amber-200 ring-amber-300/30",
  rose: "bg-rose-400/15 text-rose-200 ring-rose-300/30",
  sky: "bg-sky-400/15 text-sky-200 ring-sky-300/30",
  slate: "bg-white/10 text-slate-200 ring-white/20",
}

interface HighlightsSectionProps {
  rounds: Round[]
  logoOf: (teamId: string | number) => string | undefined
}

export function HighlightsSection({ rounds, logoOf }: HighlightsSectionProps) {
  const [featured, ...rest] = playedMatches(rounds).slice(0, 7)

  return (
    <section id="destacados" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Lo mejor de la copa" title="Destacados" />

      {!featured ? (
        <div className="rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-amber-300/70" />
          <p className="mt-3 font-semibold text-white">El balón aún no ha rodado</p>
          <p className="mt-1 text-sm text-slate-400">Los resúmenes aparecerán aquí en cuanto se dispute el primer partido.</p>
        </div>
      ) : (
        <div className="space-y-5">
          <FeaturedCard match={featured} logoOf={logoOf} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((m) => (
              <HighlightCard key={m.id} match={m} logoOf={logoOf} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function Tag({ tag }: { tag: HighlightTag }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1", TAG_TONES[tag.tone])}>
      {tag.label}
    </span>
  )
}

function FeaturedCard({ match, logoOf }: { match: RoundMatch; logoOf: HighlightsSectionProps["logoOf"] }) {
  const tag = highlightTag(match)
  const winner = match.winner_id ? String(match.winner_id) : null
  const hasHalftime = match.halftime_score_team1 !== null && match.halftime_score_team2 !== null

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#13205a] via-[#0c1430] to-[#0a0f24] p-6 sm:p-10">
      <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Partido destacado</span>
          <Tag tag={tag} />
        </div>
        <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
          Jornada {match.round} · {formatMatchDay(match.scheduled_at)}
        </span>
      </div>

      <div className="relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10">
        <FeaturedTeam id={match.team1_id} name={match.team1_name} abbr={match.team1_abbr} logoOf={logoOf} dimmed={!!winner && winner !== String(match.team1_id)} />
        <div className="text-center">
          <p className="font-display text-6xl font-extrabold tabular-nums text-white sm:text-8xl">
            {match.score_team1}
            <span className="mx-2 text-slate-600 sm:mx-4">–</span>
            {match.score_team2}
          </p>
          {hasHalftime && (
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
              Descanso {match.halftime_score_team1}–{match.halftime_score_team2}
            </p>
          )}
        </div>
        <FeaturedTeam id={match.team2_id} name={match.team2_name} abbr={match.team2_abbr} logoOf={logoOf} dimmed={!!winner && winner !== String(match.team2_id)} />
      </div>

      <MatchMeta match={match} className="relative mt-8 justify-center border-t border-white/10 pt-5" />
    </article>
  )
}

function FeaturedTeam({ id, name, abbr, logoOf, dimmed }: { id: string; name: string; abbr: string; logoOf: HighlightsSectionProps["logoOf"]; dimmed: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-3 text-center transition-opacity", dimmed && "opacity-60")}>
      <TeamCrest name={name} abbr={abbr} logo={logoOf(id)} size="lg" />
      <span className="font-display text-lg font-bold uppercase leading-tight text-white sm:text-2xl">{name}</span>
    </div>
  )
}

function HighlightCard({ match, logoOf }: { match: RoundMatch; logoOf: HighlightsSectionProps["logoOf"] }) {
  const tag = highlightTag(match)
  const winner = match.winner_id ? String(match.winner_id) : null
  const rows = [
    { id: match.team1_id, name: match.team1_name, abbr: match.team1_abbr, score: match.score_team1 },
    { id: match.team2_id, name: match.team2_name, abbr: match.team2_abbr, score: match.score_team2 },
  ]

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-amber-300/30 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between gap-2">
        <Tag tag={tag} />
        <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">J{match.round}</span>
      </div>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => {
          const lost = !!winner && winner !== String(r.id)
          return (
            <li key={r.id} className={cn("flex items-center gap-3", lost && "opacity-60")}>
              <TeamCrest name={r.name} abbr={r.abbr} logo={logoOf(r.id)} size="sm" />
              <span className="flex-1 truncate font-medium text-white">{r.name}</span>
              <span className="font-display text-2xl font-bold tabular-nums text-white">{r.score}</span>
            </li>
          )
        })}
      </ul>
      <MatchMeta match={match} className="mt-4 border-t border-white/10 pt-3" compact />
    </article>
  )
}

function MatchMeta({ match, className, compact }: { match: RoundMatch; className?: string; compact?: boolean }) {
  if (!compact && !match.venue && !match.referee) return null
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400", className)}>
      {compact && <span>{formatMatchDay(match.scheduled_at)}</span>}
      {match.venue && (
        <span className="inline-flex items-center gap-1 capitalize">
          <MapPin className="h-3.5 w-3.5" />
          {match.venue}
        </span>
      )}
      {match.referee && (
        <span className="inline-flex items-center gap-1 capitalize">
          <Flag className="h-3.5 w-3.5" />
          {match.referee}
        </span>
      )}
    </div>
  )
}
