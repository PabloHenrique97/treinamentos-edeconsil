import { useMemo } from 'react'
import { cursosMockColaborador } from '../data/cursosMock'

export interface ProgressoColaborador {
  totalCursos: number
  cursosAtivos: number
  cursosConcluidos: number
  totalAulas: number
  aulasConcluidas: number
  percentualProgresso: number
  horasEstudadas: number
}

export function useProgressoColaborador(): ProgressoColaborador {
  return useMemo(() => {
    const totalCursos      = cursosMockColaborador.length
    const cursosAtivos     = cursosMockColaborador.filter(c => c.status === 'Em andamento').length
    const cursosConcluidos = cursosMockColaborador.filter(c => c.status === 'Concluído').length

    const totalAulas      = cursosMockColaborador.reduce((s, c) => s + c.totalAulas, 0)
    const aulasConcluidas = cursosMockColaborador.reduce((s, c) => s + c.aulasConcluidas, 0)

    const percentualProgresso = totalAulas > 0
      ? Math.round((aulasConcluidas / totalAulas) * 100)
      : 0

    // Estimativa: média de 30 min por aula concluída
    const horasEstudadas = Math.round((aulasConcluidas * 30) / 60)

    return {
      totalCursos,
      cursosAtivos,
      cursosConcluidos,
      totalAulas,
      aulasConcluidas,
      percentualProgresso,
      horasEstudadas,
    }
  }, [])
}
