import { Crown, Shield, Swords } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Standing } from "@/lib/api"
import { TeamCrest } from "./team-crest"
import { SectionHeading } from "./section-heading"
import { standingLeaders } from "./tournament-utils"

interface StandingsSectionProps {
  standings: Standing[]
  logoOf: (teamId: string | number) => string | undefined
}

const COLUMNS = [
  { key: "played", label: "PJ" },
  { key: "won", label: "G" },
  { key: "drawn", label: "E" },
  { key: "lost", label: "P" },
  { key: "goals_for", label: "GF", hideMobile: true },
  { key: "goals_against", label: "GC", hideMobile: true },
  { key: "goal_diff", label: "DG" },
] as const

export function StandingsSection({ standings, logoOf }: StandingsSectionProps) {
  const { leader, bestAttack, bestDefense } = standingLeaders(standings)

  return (
    <section id="clasificacion" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Tabla general" title="Clasificación" />

      {leader && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <LeaderCard icon={Crown} label="Líder" team={leader} value={`${leader.points} pts`} logoOf={logoOf} />
          {bestAttack && <LeaderCard icon={Swords} label="Mejor ataque" team={bestAttack} value={`${bestAttack.goals_for} goles`} logoOf={logoOf} />}
          {bestDefense && <LeaderCard icon={Shield} label="Mejor defensa" team={bestDefense} value={`${bestDefense.goals_against} recibidos`} logoOf={logoOf} />}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04] text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <th className="w-14 px-4 py-3 text-center">#</th>
              <th className="px-2 py-3 text-left">Equipo</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className={cn("w-12 px-2 py-3 text-center", "hideMobile" in c && "hidden sm:table-cell")}>{c.label}</th>
              ))}
              <th className="w-16 px-4 py-3 text-center text-amber-300">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((s) => (
              <tr key={s.id} className={cn("transition-colors hover:bg-white/[0.03]", s.position === 1 && "bg-amber-300/[0.06]")}>
                <td className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "inline-grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                      s.position === 1 ? "bg-amber-300 text-[#060b1d]" : s.position <= 3 ? "bg-white/15 text-white" : "text-slate-400",
                    )}
                  >
                    {s.position}
                  </span>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-3">
                    <TeamCrest name={s.name} abbr={s.abbreviation} logo={logoOf(s.id)} size="sm" />
                    <span className="font-semibold text-white">{s.name}</span>
                  </div>
                </td>
                {COLUMNS.map((c) => (
                  <td
                    key={c.key}
                    className={cn("px-2 py-3 text-center tabular-nums text-slate-300", "hideMobile" in c && "hidden sm:table-cell")}
                  >
                    {c.key === "goal_diff" && s.goal_diff > 0 ? `+${s.goal_diff}` : s[c.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-center font-display text-xl font-bold tabular-nums text-white">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">Victoria 3 pts · Empate 1 pt · Desempate por diferencia de goles, goles a favor y resultado directo.</p>
    </section>
  )
}

interface LeaderCardProps {
  icon: LucideIcon
  label: string
  team: Standing
  value: string
  logoOf: StandingsSectionProps["logoOf"]
}

function LeaderCard({ icon: Icon, label, team, value, logoOf }: LeaderCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <TeamCrest name={team.name} abbr={team.abbreviation} logo={logoOf(team.id)} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </p>
        <p className="truncate font-semibold text-white">{team.name}</p>
      </div>
      <span className="shrink-0 text-sm font-medium text-slate-300">{value}</span>
    </div>
  )
}
