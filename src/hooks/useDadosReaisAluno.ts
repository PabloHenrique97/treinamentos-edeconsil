import { useState, useEffect } from 'react'
import { cursosAPI } from '../services/api'

export interface CursoReal {
  id: string
  slug: string
  titulo: string
  cor: string | null
  icone: string | null
  total_aulas: number
  progresso_usuario: number
}

export interface DadosAluno {
  cursos: CursoReal[]
  totalCursos: number
  cursosAtivos: number
  cursosConcluidos: number
  totalAulas: number
  aulasConcluidas: number
  percentual: number
  percentualProgresso: number
  horasEstudadas: number
  carregando: boolean
  aulasEmAndamento: Array<{
    id: string
    titulo: string
    progresso: number
    cor: string
    icone: string
  }>
}

export function useDadosReaisAluno(): DadosAluno {
  const [cursos, setCursos] = useState<CursoReal[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    cursosAPI.meusCursos()
      .then(data => setCursos(data as CursoReal[]))
      .catch(() => setCursos([]))
      .finally(() => setCarregando(false))
  }, [])

  const totalCursos      = cursos.length
  const cursosConcluidos = cursos.filter(c => c.progresso_usuario >= 100).length
  const cursosAtivos     = totalCursos - cursosConcluidos

  const totalAulas      = cursos.reduce((s, c) => s + (c.total_aulas || 0), 0)
  const aulasConcluidas = cursos.reduce((s, c) =>
    s + Math.round((c.total_aulas || 0) * c.progresso_usuario / 100), 0)

  const percentual = totalCursos > 0
    ? Math.round(cursos.reduce((s, c) => s + c.progresso_usuario, 0) / totalCursos)
    : 0

  const horasEstudadas = Math.round((aulasConcluidas * 30) / 60)

  const aulasEmAndamento = cursos
    .filter(c => c.progresso_usuario < 100)
    .slice(0, 3)
    .map(c => ({
      id:        c.id,
      titulo:    c.titulo,
      progresso: c.progresso_usuario,
      cor:       c.cor ?? '#1a56ff',
      icone:     c.icone ?? '📚',
    }))

  return {
    cursos,
    totalCursos,
    cursosAtivos,
    cursosConcluidos,
    totalAulas,
    aulasConcluidas,
    percentual,
    percentualProgresso: percentual,
    horasEstudadas,
    carregando,
    aulasEmAndamento,
  }
}
