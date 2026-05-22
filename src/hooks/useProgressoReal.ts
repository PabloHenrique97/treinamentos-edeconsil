import { useMemo } from 'react'
import { getUsuario } from '../services/authStorage'
import { cursosMockColaborador } from '../data/cursosMock'

interface UsuarioLogado {
  perfil: string
  cargo: string
  setor: string
}

const CARGO_PARA_SLUG: Record<string, string> = {
  'Coordenação de Suprimentos': 'coord-suprimentos',
  'Recursos Humanos':           'rh-gestao-pessoas',
  'Segurança do Trabalho':      'nr35-trabalho-altura',
  'Serviços Gerais':            'seguranca-canteiro',
  'Comunicação':                'comunicacao-corporativa',
  'Engenharia':                 'leitura-projetos',
  'Manutenções - Oficina':      'manutencao-mecanica',
  'Tecnologia da Informação':   'seguranca-informacao',
}

export function useProgressoReal() {
  const usuario = getUsuario<UsuarioLogado>()

  return useMemo(() => {
    const slugCursoTurma = usuario?.cargo
      ? CARGO_PARA_SLUG[usuario.cargo]
      : null

    const cursosDaTurma = slugCursoTurma
      ? cursosMockColaborador.filter(c =>
          c.id === slugCursoTurma ||
          (c as any).slug === slugCursoTurma
        )
      : cursosMockColaborador

    const fonteDados = cursosDaTurma.length > 0
      ? cursosDaTurma
      : cursosMockColaborador

    const totalCursos      = fonteDados.length
    const cursosAtivos     = fonteDados.filter(c => c.status === 'Em andamento').length
    const cursosConcluidos = fonteDados.filter(c => c.status === 'Concluído').length

    const totalAulas      = fonteDados.reduce((s, c) => s + c.totalAulas, 0)
    const aulasConcluidas = fonteDados.reduce((s, c) => s + c.aulasConcluidas, 0)

    const percentual = totalAulas > 0
      ? Math.round((aulasConcluidas / totalAulas) * 100)
      : 0

    const horasEstudadas = Math.round((aulasConcluidas * 30) / 60)

    // Extrair as 3 primeiras aulas do curso da turma para exibir no card "Em andamento"
    const aulasEmAndamento = fonteDados
      .flatMap(curso =>
        curso.modulos.flatMap(modulo =>
          modulo.aulas.map(aula => ({
            id:        `${curso.id}-${aula.id}`,
            cursoId:   curso.id,
            cursoSlug: (curso as any).slug ?? curso.id,
            moduloId:  modulo.id,
            aulaId:    aula.id,
            titulo:    aula.titulo,
            progresso: aula.progresso,
            status:    aula.status,
            cor:       curso.cor,
            icone:     curso.icone,
          }))
        )
      )
      .slice(0, 3)

    // Manter cursosEmAndamento para compatibilidade
    const cursosEmAndamento = fonteDados
      .filter(c => c.status === 'Em andamento' || c.aulasConcluidas > 0)
      .slice(0, 3)
      .map(c => ({
        id:              c.id,
        slug:            (c as any).slug ?? c.id,
        titulo:          c.titulo,
        progresso:       c.progresso,
        aulasConcluidas: c.aulasConcluidas,
        totalAulas:      c.totalAulas,
        cor:             c.cor,
        icone:           c.icone,
      }))

    return {
      totalCursos,
      cursosAtivos,
      cursosConcluidos,
      totalAulas,
      aulasConcluidas,
      percentual,
      horasEstudadas,
      cursosEmAndamento,
      aulasEmAndamento,
      slugCursoTurma,
    }
  }, [usuario?.cargo])
}
