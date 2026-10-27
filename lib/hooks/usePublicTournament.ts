import { useCallback, useEffect, useState } from "react"
import { leaguesApi, teamsApi } from "@/lib/api"
import type { League, Round, Standing, Team } from "@/lib/api"

// Datos de solo lectura para el portal público: ligas, jornadas, tabla y escudos.
export function usePublicTournament() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rounds, setRounds] = useState<Round[]>([])
  const [standings, setStandings] = useState<Standing[]>([])
  const [loadingLeagues, setLoadingLeagues] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadLeagues = useCallback(async () => {
    setLoadingLeagues(true)
    setError(null)
    try {
      const [leagueList, teamList] = await Promise.all([leaguesApi.getAll(), teamsApi.getAll()])
      setLeagues(leagueList)
      setTeams(teamList)
      // Prioriza el torneo en curso; si no hay, el primero disponible.
      const featured = leagueList.find((l) => l.state === "active") ?? leagueList[0]
      setSelectedId((prev) => prev ?? (featured ? String(featured.id) : null))
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el torneo")
    } finally {
      setLoadingLeagues(false)
    }
  }, [])

  useEffect(() => { loadLeagues() }, [loadLeagues])

  useEffect(() => {
    if (!selectedId) return
    let cancelled = false
    setLoadingDetail(true)
    Promise.all([leaguesApi.getRounds(selectedId), leaguesApi.getStandings(selectedId)])
      .then(([roundsRes, standingsRes]) => {
        if (cancelled) return
        setRounds(roundsRes.rounds)
        setStandings(standingsRes)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "No se pudo cargar el torneo")
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false)
      })
    return () => { cancelled = true }
  }, [selectedId])

  const league = leagues.find((l) => String(l.id) === selectedId) ?? null

  return {
    leagues,
    teams,
    league,
    rounds,
    standings,
    selectLeague: setSelectedId,
    loading: loadingLeagues || loadingDetail,
    error,
    retry: loadLeagues,
  }
}
