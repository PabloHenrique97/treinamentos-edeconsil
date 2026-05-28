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

export interface AulaProgresso {
  id: string
  titulo: string
  progresso: number
  concluida: boolean
  cor: string
  icone: string
  cursoTitulo: string
  cursoSlug: string
  moduloId: number
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
  aulasEmAndamento: AulaProgresso[]
}

export function useDadosReaisAluno(): DadosAluno {
  const [cursos, setCursos] = useState<CursoReal[]>([])
  const [carregando, setCarregando] = useState(true)
  const [aulasEmAndamento, setAulasEmAndamento] = useState<AulaProgresso[]>([])

  useEffect(() => {
    async function carregarDados() {
      try {
        const data = await cursosAPI.meusCursos()
        const cursosData = data as CursoReal[]
        setCursos(cursosData)

        const cursosFiltrados = cursosData.filter(c => c.progresso_usuario < 100).slice(0, 2)
        const aulasColetadas: AulaProgresso[] = []

        for (const curso of cursosFiltrados) {
          if (aulasColetadas.length >= 3) break
          try {
            const modulos = await cursosAPI.aulas(curso.slug) as any[]
            if (!Array.isArray(modulos)) continue
            for (const modulo of modulos) {
              if (aulasColetadas.length >= 3) break
              for (const aula of (modulo.aulas ?? [])) {
                if (aulasColetadas.length >= 3) break
                aulasColetadas.push({
                  id:          String(aula.id),
                  titulo:      aula.titulo,
                  progresso:   aula.progresso?.percentual ?? 0,
                  concluida:   aula.progresso?.concluida  ?? false,
                  cor:         curso.cor ?? '#1a56ff',
                  icone:       curso.icone ?? '📚',
                  cursoTitulo: curso.titulo,
                  cursoSlug:   curso.slug,
                  moduloId:    modulo.id,
                })
              }
            }
          } catch { /* continua para o próximo curso */ }
        }

        if (aulasColetadas.length === 0) {
          cursosData.filter(c => c.progresso_usuario < 100).slice(0, 3).forEach(curso => {
            aulasColetadas.push({
              id:          curso.id,
              titulo:      `${curso.titulo} — Aula 1`,
              progresso:   0,
              concluida:   false,
              cor:         curso.cor ?? '#1a56ff',
              icone:       curso.icone ?? '📚',
              cursoTitulo: curso.titulo,
              cursoSlug:   curso.slug,
              moduloId:    0,
            })
          })
        }

        setAulasEmAndamento(aulasColetadas)
      } catch {
        setCursos([])
      } finally {
        setCarregando(false)
      }
    }
    carregarDados()
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
