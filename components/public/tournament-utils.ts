import { format, isValid, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import type { Round, RoundMatch, Standing } from "@/lib/api"

// ── Fechas ─────────────────────────────────────────────────────────────────────

function toDate(value: string | null): Date | null {
  if (!value) return null
  const date = parseISO(value)
  return isValid(date) ? date : null
}

export function formatMatchDay(value: string | null): string {
  const date = toDate(value)
  if (!date) return "Fecha por definir"
  const text = format(date, "EEE d 'de' MMM", { locale: es })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatMatchTime(value: string | null): string | null {
  const date = toDate(value)
  return date ? format(date, "HH:mm") : null
}

export function formatRange(start: string | null, end: string | null): string | null {
  const s = toDate(start)
  const e = toDate(end)
  if (!s && !e) return null
  if (s && e) return `${format(s, "d MMM", { locale: es })} — ${format(e, "d MMM yyyy", { locale: es })}`
  return format((s ?? e)!, "d MMM yyyy", { locale: es })
}

// ── Partidos ───────────────────────────────────────────────────────────────────

export const isPlayed = (m: RoundMatch) =>
  m.played === 1 && m.score_team1 !== null && m.score_team2 !== null

export const totalGoals = (m: RoundMatch) => (m.score_team1 ?? 0) + (m.score_team2 ?? 0)

export function playedMatches(rounds: Round[]): RoundMatch[] {
  return rounds
    .flatMap((r) => r.matches)
    .filter(isPlayed)
    .sort((a, b) => b.round - a.round || totalGoals(b) - totalGoals(a))
}

export function nextMatch(rounds: Round[]): RoundMatch | null {
  return rounds.flatMap((r) => r.matches).find((m) => !isPlayed(m)) ?? null
}

export interface HighlightTag {
  label: string
  tone: "gold" | "rose" | "sky" | "slate"
}

// Etiqueta editorial derivada del marcador final y del medio tiempo.
export function highlightTag(m: RoundMatch): HighlightTag {
  const s1 = m.score_team1 ?? 0
  const s2 = m.score_team2 ?? 0
  const ht1 = m.halftime_score_team1
  const ht2 = m.halftime_score_team2

  if (ht1 !== null && ht2 !== null) {
    const htLeader = Math.sign(ht1 - ht2)
    const ftLeader = Math.sign(s1 - s2)
    if (htLeader !== 0 && ftLeader !== 0 && htLeader !== ftLeader) return { label: "Remontada", tone: "rose" }
  }
  if (Math.abs(s1 - s2) >= 3) return { label: "Goleada", tone: "gold" }
  if (s1 + s2 >= 5) return { label: "Festival de goles", tone: "gold" }
  if (s1 === s2) return { label: "Reparto de puntos", tone: "slate" }
  if (s2 > s1) return { label: "Triunfo visitante", tone: "sky" }
  return { label: "Victoria local", tone: "sky" }
}

// ── Resumen del torneo ─────────────────────────────────────────────────────────

export interface TournamentStats {
  totalMatches: number
  played: number
  goals: number
  avgGoals: string
  progress: number
}

export function tournamentStats(rounds: Round[]): TournamentStats {
  const all = rounds.flatMap((r) => r.matches)
  const done = all.filter(isPlayed)
  const goals = done.reduce((acc, m) => acc + totalGoals(m), 0)
  return {
    totalMatches: all.length,
    played: done.length,
    goals,
    avgGoals: done.length ? (goals / done.length).toFixed(1) : "0.0",
    progress: all.length ? Math.round((done.length / all.length) * 100) : 0,
  }
}

export interface StandingLeaders {
  leader: Standing | null
  bestAttack: Standing | null
  bestDefense: Standing | null
}

export function standingLeaders(standings: Standing[]): StandingLeaders {
  const active = standings.filter((s) => s.played > 0)
  if (!active.length) return { leader: null, bestAttack: null, bestDefense: null }
  return {
    leader: active.reduce((a, b) => (b.position < a.position ? b : a)),
    bestAttack: active.reduce((a, b) => (b.goals_for > a.goals_for ? b : a)),
    bestDefense: active.reduce((a, b) => (b.goals_against < a.goals_against ? b : a)),
  }
}

export const LEAGUE_STATUS: Record<string, { label: string; live: boolean }> = {
  active: { label: "En juego", live: true },
  completed: { label: "Finalizada", live: false },
  inactive: { label: "Próximamente", live: false },
  suspended: { label: "Suspendida", live: false },
}
