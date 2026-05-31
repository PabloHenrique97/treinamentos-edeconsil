import { useState, useEffect, useCallback } from 'react'
import { Shield, Users, GraduationCap,
         UserCheck, ChevronDown, ChevronUp,
         Search, RefreshCw } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'
import { apiRequest } from '../../services/api'
import { useBreakpoint } from '../../hooks/useMobile'

interface PermissoesAdminProps {
  onNavigate: (page: string) => void
  onLogout:   () => void
}

const PERFIS = {
  admin: {
    label:  'Administrador',
    cor:    '#ef4444',
    icone:  <Shield size={20} />,
    emoji:  '🔴',
    descricao: 'Acesso total ao sistema — gerencia usuários, cursos, turmas, instrutores e configurações.',
    permissoes: [
      '✅ Dashboard com métricas reais',
      '✅ Gerenciar Cursos (criar/editar/publicar)',
      '✅ Gerenciar Turmas',
      '✅ Gerenciar Alunos (CRUD + importação)',
      '✅ Gerenciar Instrutores',
      '✅ Ver e emitir Certificados',
      '✅ Sistema de Mensagens (responder todos)',
      '✅ Configurações do sistema',
      '✅ Permissões e perfis',
      '✅ Exportar dados (CSV)',
    ],
  },
  instrutor: {
    label:  'Instrutor',
    cor:    '#7c3aed',
    icone:  <GraduationCap size={20} />,
    emoji:  '🟣',
    descricao: 'Acesso total ao painel administrativo — mesmo nível do Administrador. Login com CPF + data de nascimento.',
    permissoes: [
      '✅ Dashboard com métricas reais',
      '✅ Gerenciar Cursos',
      '✅ Gerenciar Turmas',
      '✅ Gerenciar Alunos',
      '✅ Ver Certificados',
      '✅ Sistema de Mensagens',
      '✅ Configurações do sistema',
    ],
  },
  colaborador: {
    label:  'Colaborador',
    cor:    '#10b981',
    icone:  <UserCheck size={20} />,
    emoji:  '🟢',
    descricao: 'Acesso à área do aluno — visualiza seus cursos, trilhas, certificados e pode enviar mensagens ao suporte.',
    permissoes: [
      '✅ Dashboard pessoal',
      '✅ Meus Cursos (da sua turma)',
      '✅ Assistir aulas e fazer provas',
      '✅ Ver seus Certificados',
      '✅ Trilhas de Aprendizado',
      '✅ Enviar Mensagens ao suporte',
      '✅ EdeconQuiz e Apostilas',
      '❌ Painel administrativo',
      '❌ Gerenciar outros usuários',
    ],
  },
}

export function PermissoesAdmin({ onNavigate, onLogout }: PermissoesAdminProps) {
  const { C } = useTheme()
  const { isMobile, cols } = useBreakpoint()

  const [dados,           setDados]           = useState<any>(null)
  const [carregando,      setCarregando]      = useState(true)
  const [busca,           setBusca]           = useState('')
  const [perfilExpandido, setPerfilExpandido] = useState<string|null>(null)
  const [alterando,       setAlterando]       = useState<string|null>(null)
  const [mensagem,        setMensagem]        = useState('')
  const [tipoMsg,         setTipoMsg]         = useState<'sucesso'|'erro'>('sucesso')

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const data = await apiRequest('/admin/permissoes') as any
      setDados(data)
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const alterarPerfil = async (usuarioId: string, novoPerfil: string, nomeUsuario: string) => {
    setAlterando(usuarioId)
    try {
      await apiRequest(`/admin/permissoes/${usuarioId}/perfil`, {
        method: 'PATCH',
        body:   JSON.stringify({ perfil: novoPerfil }),
      })
      setMensagem(`✅ Perfil de ${nomeUsuario} alterado para ${PERFIS[novoPerfil as keyof typeof PERFIS]?.label}`)
      setTipoMsg('sucesso')
      setTimeout(() => setMensagem(''), 4000)
      carregar()
    } catch (err: any) {
      setMensagem(`❌ ${err.message ?? 'Erro ao alterar perfil'}`)
      setTipoMsg('erro')
      setTimeout(() => setMensagem(''), 4000)
    } finally {
      setAlterando(null)
    }
  }

  const formatarData = (iso: string | null) => {
    if (!iso) return 'Nunca'
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  const usuariosFiltrados = (lista: any[]) => {
    if (!busca) return lista
    return lista.filter(u =>
      u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      u.email?.toLowerCase().includes(busca.toLowerCase()) ||
      u.cpf?.includes(busca)
    )
  }

  return (
    <LayoutAdmin paginaAtiva="permissoesAdmin" onNavigate={onNavigate} onLogout={onLogout}>
      <div style={{ padding: isMobile ? '12px' : '28px 24px' }}>

        {/* Cabeçalho */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '24px',
          flexWrap: 'wrap', gap: '10px',
        }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>
              Permissões e Perfis
            </h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              Gerencie os níveis de acesso dos usuários ao sistema
            </p>
          </div>
          <button onClick={carregar} disabled={carregando}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px', color: C.muted, cursor: 'pointer' }}>
            <RefreshCw size={13} style={{ animation: carregando ? 'spin 0.8s linear infinite' : 'none' }} />
            Atualizar
          </button>
        </div>

        {/* Toast mensagem */}
        {mensagem && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
            fontSize: '13px', fontWeight: 600,
            background: tipoMsg === 'sucesso' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${tipoMsg === 'sucesso' ? 'rgba(16,185,129,0.30)' : 'rgba(239,68,68,0.30)'}`,
            color: tipoMsg === 'sucesso' ? '#10b981' : '#ef4444',
          }}>
            {mensagem}
          </div>
        )}

        {/* Cards de resumo dos perfis */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols(1, 3, 3)}, 1fr)`,
          gap: '14px', marginBottom: '28px',
        }}>
          {Object.entries(PERFIS).map(([key, perfil]) => {
            const total    = dados?.totais?.[key] ?? 0
            const expandido = perfilExpandido === key

            return (
              <div key={key} style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderTop: `4px solid ${perfil.cor}`,
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <div style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: `${perfil.cor}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: perfil.cor,
                    }}>
                      {perfil.icone}
                    </div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>
                        {perfil.label}
                      </p>
                      <p style={{ fontSize: '24px', fontWeight: 800, color: perfil.cor, margin: 0, lineHeight: 1 }}>
                        {carregando ? '...' : total}
                        <span style={{ fontSize: '13px', fontWeight: 400, color: C.muted, marginLeft: '4px' }}>
                          usuário{total !== 1 ? 's' : ''}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 14px', lineHeight: 1.5 }}>
                    {perfil.descricao}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {perfil.permissoes.map((p, i) => (
                      <p key={i} style={{ fontSize: '11px', color: p.startsWith('✅') ? C.text : C.muted, margin: 0 }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setPerfilExpandido(expandido ? null : key)}
                  style={{
                    width: '100%', padding: '10px 20px',
                    background: C.surface2,
                    border: 'none', borderTop: `1px solid ${C.border}`,
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    fontSize: '12px', fontWeight: 600,
                    color: C.muted,
                  }}
                >
                  <span>Ver usuários com este perfil</span>
                  {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandido && (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {(dados?.grupos?.[key] ?? []).length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: C.muted }}>
                        Nenhum usuário com este perfil
                      </div>
                    ) : (
                      (dados?.grupos?.[key] ?? []).map((u: any) => (
                        <div key={u.id} style={{
                          padding: '10px 20px',
                          borderTop: `1px solid ${C.border}`,
                          display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                          <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: `${perfil.cor}18`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 700, color: perfil.cor, flexShrink: 0,
                          }}>
                            {u.nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: C.text, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {u.nome}
                            </p>
                            <p style={{ fontSize: '10px', color: C.muted, margin: 0 }}>
                              {u.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                            </p>
                          </div>
                          {u.cpf !== '00000000000' ? (
                            <select
                              value={u.perfil}
                              onChange={e => alterarPerfil(u.id, e.target.value, u.nome)}
                              disabled={alterando === u.id}
                              style={{
                                fontSize: '11px', padding: '3px 6px',
                                background: C.surface,
                                border: `1px solid ${C.border}`,
                                borderRadius: '6px', color: C.text,
                                cursor: 'pointer', outline: 'none',
                                opacity: alterando === u.id ? 0.5 : 1,
                              }}
                            >
                              <option value="admin">Admin</option>
                              <option value="instrutor">Instrutor</option>
                              <option value="colaborador">Colaborador</option>
                            </select>
                          ) : (
                            <span style={{ fontSize: '10px', color: C.muted, fontStyle: 'italic' }}>
                              Principal
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Seção de busca e listagem geral */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color={C.muted} />
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: 0 }}>
                Todos os Usuários
              </h2>
              <span style={{ fontSize: '12px', color: C.muted }}>
                ({dados?.totais?.total ?? 0} total)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '7px 12px', minWidth: '220px' }}>
              <Search size={13} color={C.muted} />
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
                placeholder="Buscar por nome, e-mail ou CPF..."
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: '12px', color: C.text, flex: 1 }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.surface2 }}>
                  {['Usuário', 'CPF', 'Perfil Atual', 'Turma/Setor', 'Último Acesso', 'Alterar Perfil'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', fontSize: '10px',
                      fontWeight: 700, color: C.muted, textAlign: 'left',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      borderBottom: `1px solid ${C.border}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
                      Carregando...
                    </td>
                  </tr>
                ) : usuariosFiltrados(dados?.usuarios ?? []).map((u: any, idx: number) => {
                  const perfilInfo = PERFIS[u.perfil as keyof typeof PERFIS]
                  const isAdmin    = u.cpf === '00000000000'
                  const total      = usuariosFiltrados(dados?.usuarios ?? []).length

                  return (
                    <tr key={u.id} style={{
                      borderBottom: idx < total - 1 ? `1px solid ${C.border}` : 'none',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)',
                    }}>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: `${perfilInfo?.cor ?? C.blue}18`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 700,
                            color: perfilInfo?.cor ?? C.blue, flexShrink: 0,
                          }}>
                            {u.nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: C.text, margin: '0 0 1px', whiteSpace: 'nowrap' }}>
                              {u.nome}
                            </p>
                            <p style={{ fontSize: '10px', color: C.muted, margin: 0 }}>
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '10px 16px', fontSize: '11px', color: C.muted, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {u.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') ?? '—'}
                      </td>

                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '20px',
                          background: `${perfilInfo?.cor ?? C.blue}18`,
                          color: perfilInfo?.cor ?? C.blue,
                          border: `1px solid ${perfilInfo?.cor ?? C.blue}40`,
                          whiteSpace: 'nowrap',
                        }}>
                          {perfilInfo?.emoji} {perfilInfo?.label ?? u.perfil}
                        </span>
                      </td>

                      <td style={{ padding: '10px 16px', fontSize: '12px', color: C.muted, whiteSpace: 'nowrap' }}>
                        {u.turma_nome ?? u.instrutor_nome ?? '—'}
                      </td>

                      <td style={{ padding: '10px 16px', fontSize: '11px', color: C.muted, whiteSpace: 'nowrap' }}>
                        {formatarData(u.ultimo_acesso)}
                      </td>

                      <td style={{ padding: '10px 16px' }}>
                        {isAdmin ? (
                          <span style={{ fontSize: '11px', color: C.muted, fontStyle: 'italic' }}>
                            🔒 Protegido
                          </span>
                        ) : (
                          <select
                            value={u.perfil}
                            onChange={e => alterarPerfil(u.id, e.target.value, u.nome)}
                            disabled={alterando === u.id}
                            style={{
                              fontSize: '12px', padding: '5px 10px',
                              background: C.surface2,
                              border: `1px solid ${C.border}`,
                              borderRadius: '6px', color: C.text,
                              cursor: 'pointer', outline: 'none',
                              opacity: alterando === u.id ? 0.5 : 1,
                            }}
                          >
                            <option value="admin">🔴 Admin</option>
                            <option value="instrutor">🟣 Instrutor</option>
                            <option value="colaborador">🟢 Colaborador</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  )
}
