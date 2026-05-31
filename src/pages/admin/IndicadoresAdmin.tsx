import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'
import { indicadoresAPI } from '../../services/api'
import { useBreakpoint } from '../../hooks/useMobile'

interface IndicadoresAdminProps {
  onNavigate: (page: string) => void
  onLogout:   () => void
}

const CORES_GRAFICOS = [
  '#1a56ff','#10b981','#f59e0b','#ef4444',
  '#7c3aed','#ec4899','#0891b2','#14b8a6',
  '#f97316','#6366f1','#84cc16','#a855f7',
]

const TooltipCustom = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1e293b', border: '1px solid #334155',
      borderRadius: '8px', padding: '10px 14px',
    }}>
      {label && (
        <p style={{ fontSize:'12px', color:'#94a3b8', margin:'0 0 4px' }}>
          {label}
        </p>
      )}
      {payload.map((p: any) => (
        <p key={p.name} style={{
          fontSize:'13px', fontWeight:700,
          color: p.color ?? '#fff', margin:'2px 0',
        }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export function IndicadoresAdmin({ onNavigate, onLogout }: IndicadoresAdminProps) {
  const { C } = useTheme()
  const { isMobile, cols } = useBreakpoint()

  const [dados,      setDados]      = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro,       setErro]       = useState('')

  useEffect(() => {
    indicadoresAPI.buscar()
      .then((data: any) => { setDados(data); setCarregando(false) })
      .catch((err: any) => {
        setErro(err.message ?? 'Erro ao carregar')
        setCarregando(false)
      })
  }, [])

  const KPI = ({
    icone, titulo, valor, subtitulo, cor, onClick,
  }: {
    icone:string; titulo:string; valor:string|number
    subtitulo?:string; cor:string; onClick?:()=>void
  }) => (
    <div
      onClick={onClick}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${cor}`,
        borderRadius: '12px', padding: '18px 20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 150ms, box-shadow 150ms',
      }}
      onMouseEnter={e => {
        if (!onClick) return
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{
          width:'44px', height:'44px', borderRadius:'10px',
          background:`${cor}18`,
          display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:'22px', flexShrink:0,
        }}>
          {icone}
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:'11px', fontWeight:700, color:C.muted, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
            {titulo}
          </p>
          <p style={{ fontSize:'28px', fontWeight:800, color:cor, margin:0, lineHeight:1 }}>
            {carregando ? '...' : valor}
          </p>
          {subtitulo && (
            <p style={{ fontSize:'11px', color:C.muted, margin:'4px 0 0' }}>
              {subtitulo}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const Secao = ({ titulo, children }: { titulo:string; children:React.ReactNode }) => (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '14px', overflow: 'hidden',
      marginBottom: '20px',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{ width:'3px', height:'18px', background:C.blue, borderRadius:'2px' }} />
        <h2 style={{ fontSize:'14px', fontWeight:700, color:C.text, margin:0 }}>
          {titulo}
        </h2>
      </div>
      <div style={{ padding:'20px' }}>
        {children}
      </div>
    </div>
  )

  if (carregando) return (
    <LayoutAdmin paginaAtiva="indicadores" onNavigate={onNavigate} onLogout={onLogout}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', gap:'12px', color:C.muted }}>
        <div style={{ width:'28px', height:'28px', border:`3px solid ${C.border}`, borderTopColor:C.blue, borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        Carregando indicadores...
      </div>
    </LayoutAdmin>
  )

  if (erro) return (
    <LayoutAdmin paginaAtiva="indicadores" onNavigate={onNavigate} onLogout={onLogout}>
      <div style={{ padding:'40px', textAlign:'center' }}>
        <p style={{ color:'#ef4444', fontSize:'14px' }}>⚠️ {erro}</p>
      </div>
    </LayoutAdmin>
  )

  const dataTurmas = (dados?.colaboradoresPorTurma ?? [])
    .filter((t: any) => t.total > 0)

  const dataAdmissoes = dados?.admissoesPorMes ?? []

  const dataPie = [
    { name:'Matrículas ativas', value: dados?.matriculas?.total ?? 0 },
    { name:'Turmas com curso',  value: dados?.turmas?.comCurso ?? 0 },
    { name:'Certificados',      value: dados?.certificados?.total ?? 0 },
    { name:'Instrutores',       value: dados?.instrutores?.total ?? 0 },
  ].filter(d => d.value > 0)

  const dataStatus = [
    { name:'Ativos',   value: dados?.colaboradores?.ativos   ?? 0, cor:'#10b981' },
    { name:'Inativos', value: dados?.colaboradores?.inativos ?? 0, cor:'#ef4444' },
  ].filter(d => d.value > 0)

  return (
    <LayoutAdmin paginaAtiva="indicadores" onNavigate={onNavigate} onLogout={onLogout}>
      <div style={{ padding: isMobile ? '12px' : '28px 24px' }}>

        <div style={{ marginBottom:'24px' }}>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:C.text, margin:'0 0 4px' }}>
            Indicadores
          </h1>
          <p style={{ fontSize:'13px', color:C.muted, margin:0 }}>
            Dados reais do sistema — atualizado em tempo real
          </p>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:`repeat(${cols(2,3,4)}, 1fr)`,
          gap:'14px', marginBottom:'24px',
        }}>
          <KPI icone="👥" titulo="Colaboradores"
            valor={dados?.colaboradores?.total ?? 0}
            subtitulo={`${dados?.colaboradores?.ativos ?? 0} ativos`}
            cor="#1a56ff"
            onClick={() => onNavigate('alunosAdmin')} />

          <KPI icone="🏫" titulo="Turmas"
            valor={dados?.turmas?.total ?? 0}
            subtitulo={`${dados?.turmas?.comCurso ?? 0} com curso`}
            cor="#10b981"
            onClick={() => onNavigate('turmasAdmin')} />

          <KPI icone="📚" titulo="Matrículas ativas"
            valor={dados?.matriculas?.total ?? 0}
            subtitulo="em cursos ativos"
            cor="#f59e0b"
            onClick={() => onNavigate('cursosAdmin')} />

          <KPI icone="👨‍🏫" titulo="Instrutores"
            valor={dados?.instrutores?.total ?? 0}
            subtitulo={`${dados?.instrutores?.comLogin ?? 0} com acesso`}
            cor="#7c3aed"
            onClick={() => onNavigate('instrutoresAdmin')} />

          <KPI icone="🏆" titulo="Certificados"
            valor={dados?.certificados?.total ?? 0}
            subtitulo={dados?.certificados?.total > 0
              ? `${dados.certificados.validos} válidos`
              : 'Nenhum emitido ainda'}
            cor="#ec4899"
            onClick={() => onNavigate('certificadosAdmin')} />

          <KPI icone="📝" titulo="Provas realizadas"
            valor={dados?.provas?.total ?? 0}
            subtitulo={dados?.provas?.total > 0
              ? `${dados.provas.taxaAprovacao}% de aprovação`
              : 'Nenhuma realizada ainda'}
            cor="#0891b2" />

          <KPI icone="💬" titulo="Conversas"
            valor={dados?.mensagens?.conversas ?? 0}
            subtitulo={`${dados?.mensagens?.naoLidas ?? 0} não lidas`}
            cor="#f97316"
            onClick={() => onNavigate('mensagensAdmin')} />

          <KPI icone="🔔" titulo="Notificações"
            valor={dados?.notificacoes?.total ?? 0}
            subtitulo={`${dados?.notificacoes?.naoLidas ?? 0} não lidas`}
            cor="#6366f1" />
        </div>

        {dataTurmas.length > 0 && (
          <Secao titulo="Colaboradores por Turma">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={dataTurmas}
                margin={{ top:5, right:20, left:0, bottom:isMobile ? 60 : 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis
                  dataKey="turma"
                  tick={{ fontSize:10, fill:C.muted }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize:11, fill:C.muted }} />
                <Tooltip content={<TooltipCustom />} />
                <Bar dataKey="total" name="Colaboradores" radius={[6,6,0,0]}>
                  {dataTurmas.map((_: any, idx: number) => (
                    <Cell
                      key={idx}
                      fill={CORES_GRAFICOS[idx % CORES_GRAFICOS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Secao>
        )}

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap:'20px', marginBottom:'20px',
        }}>

          <Secao titulo="Visão Geral do Sistema">
            {dataPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ value }) => `${value}`}
                    labelLine={false}
                  >
                    {dataPie.map((_: any, idx: number) => (
                      <Cell
                        key={idx}
                        fill={CORES_GRAFICOS[idx % CORES_GRAFICOS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipCustom />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize:'11px', color:C.text }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign:'center', padding:'40px 20px', color:C.muted }}>
                <span style={{ fontSize:'32px', display:'block', marginBottom:'8px' }}>📊</span>
                <p style={{ fontSize:'13px', margin:0 }}>
                  Dados insuficientes para o gráfico
                </p>
              </div>
            )}
          </Secao>

          <Secao titulo="Admissões por Mês">
            {dataAdmissoes.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={dataAdmissoes}
                  margin={{ top:5, right:20, left:0, bottom:5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize:10, fill:C.muted }}
                  />
                  <YAxis tick={{ fontSize:11, fill:C.muted }} />
                  <Tooltip content={<TooltipCustom />} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Admissões"
                    stroke="#1a56ff"
                    strokeWidth={2.5}
                    dot={{ fill:'#1a56ff', r:4 }}
                    activeDot={{ r:6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign:'center', padding:'40px 20px', color:C.muted }}>
                <span style={{ fontSize:'32px', display:'block', marginBottom:'8px' }}>📈</span>
                <p style={{ fontSize:'13px', margin:0 }}>
                  Sem dados de admissão no período
                </p>
              </div>
            )}
          </Secao>
        </div>

        {dataStatus.some(d => d.value > 0) && (
          <Secao titulo="Status dos Colaboradores">
            <div style={{
              display:'grid',
              gridTemplateColumns:`repeat(${cols(1,2,2)}, 1fr)`,
              gap:'12px',
            }}>
              {[
                { label:'Ativos',   valor: dados?.colaboradores?.ativos   ?? 0, cor:'#10b981', icone:'✅' },
                { label:'Inativos', valor: dados?.colaboradores?.inativos ?? 0, cor:'#ef4444', icone:'❌' },
                { label:'Com matrícula',  valor: dados?.matriculas?.total ?? 0, cor:'#1a56ff', icone:'📋' },
                { label:'Sem curso',
                  valor: (dados?.colaboradores?.total ?? 0) - (dados?.matriculas?.total ?? 0),
                  cor:'#f59e0b', icone:'⏳' },
              ].map(item => (
                <div key={item.label} style={{
                  background:C.surface2,
                  border:`1px solid ${C.border}`,
                  borderRadius:'10px', padding:'14px',
                  display:'flex', alignItems:'center', gap:'12px',
                }}>
                  <span style={{ fontSize:'24px' }}>{item.icone}</span>
                  <div>
                    <p style={{ fontSize:'22px', fontWeight:800, color:item.cor, margin:0, lineHeight:1 }}>
                      {item.valor}
                    </p>
                    <p style={{ fontSize:'12px', color:C.muted, margin:'3px 0 0' }}>
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Secao>
        )}

        <Secao titulo="Saúde do Sistema">
          <div style={{
            display:'grid',
            gridTemplateColumns:`repeat(${cols(1,2,3)}, 1fr)`,
            gap:'12px',
          }}>
            {[
              {
                titulo: 'Cursos configurados',
                ok:     dados?.turmas?.comCurso > 0,
                valor:  `${dados?.turmas?.comCurso ?? 0}/${dados?.turmas?.total ?? 0} turmas`,
                desc:   'Turmas com conteúdo vinculado',
              },
              {
                titulo: 'Instrutores com acesso',
                ok:     dados?.instrutores?.semLogin === 0,
                valor:  `${dados?.instrutores?.comLogin ?? 0}/${dados?.instrutores?.total ?? 0}`,
                desc:   dados?.instrutores?.semLogin > 0
                  ? `${dados.instrutores.semLogin} sem CPF cadastrado`
                  : 'Todos com login configurado',
              },
              {
                titulo: 'Matrículas ativas',
                ok:     dados?.matriculas?.total > 0,
                valor:  `${dados?.matriculas?.total ?? 0} matrículas`,
                desc:   'Alunos com acesso a cursos',
              },
              {
                titulo: 'Certificados emitidos',
                ok:     dados?.certificados?.total >= 0,
                valor:  `${dados?.certificados?.total ?? 0} certificados`,
                desc:   dados?.certificados?.total === 0
                  ? 'Nenhuma prova concluída ainda'
                  : `${dados?.certificados?.validos} válidos`,
              },
              {
                titulo: 'Mensagens respondidas',
                ok:     dados?.mensagens?.naoLidas === 0,
                valor:  `${dados?.mensagens?.naoLidas ?? 0} pendentes`,
                desc:   dados?.mensagens?.naoLidas > 0
                  ? 'Há mensagens aguardando resposta'
                  : 'Todas as mensagens respondidas',
              },
              {
                titulo: 'Provas realizadas',
                ok:     dados?.provas?.total >= 0,
                valor:  `${dados?.provas?.total ?? 0} realizadas`,
                desc:   dados?.provas?.total === 0
                  ? 'Aguardando primeiras avaliações'
                  : `Média: ${dados?.provas?.mediaNota ?? 0}%`,
              },
            ].map(item => (
              <div key={item.titulo} style={{
                background: item.ok ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
                border: `1px solid ${item.ok ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                borderRadius:'10px', padding:'14px',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                  <span style={{ fontSize:'16px' }}>
                    {item.ok ? '✅' : '⚠️'}
                  </span>
                  <p style={{ fontSize:'12px', fontWeight:700, color:C.text, margin:0 }}>
                    {item.titulo}
                  </p>
                </div>
                <p style={{
                  fontSize:'15px', fontWeight:800,
                  color: item.ok ? '#10b981' : '#f59e0b',
                  margin:'0 0 3px',
                }}>
                  {item.valor}
                </p>
                <p style={{ fontSize:'11px', color:C.muted, margin:0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Secao>

        {(dados?.admissoesRecentes ?? []).length > 0 && (
          <Secao titulo="Admissões Recentes (últimos 30 dias)">
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:C.surface2 }}>
                    {['Colaborador','Cargo','Turma','Data Admissão'].map(h => (
                      <th key={h} style={{
                        padding:'9px 14px', fontSize:'10px',
                        fontWeight:700, color:C.muted, textAlign:'left',
                        textTransform:'uppercase', letterSpacing:'0.5px',
                        borderBottom:`1px solid ${C.border}`,
                        whiteSpace:'nowrap',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dados.admissoesRecentes.map((u: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom:`1px solid ${C.border}` }}>
                      <td style={{ padding:'10px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                          <div style={{
                            width:'28px', height:'28px', borderRadius:'50%',
                            background:'rgba(26,86,255,0.12)',
                            display:'flex', alignItems:'center',
                            justifyContent:'center',
                            fontSize:'11px', fontWeight:700, color:C.blue,
                            flexShrink:0,
                          }}>
                            {u.nome.split(' ').slice(0,2)
                              .map((n: string) => n[0]).join('')}
                          </div>
                          <span style={{ fontSize:'13px', fontWeight:600, color:C.text }}>
                            {u.nome}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding:'10px 14px', fontSize:'12px', color:C.muted }}>
                        {u.cargo ?? '—'}
                      </td>
                      <td style={{ padding:'10px 14px', fontSize:'12px', color:C.muted }}>
                        {u.turma ?? '—'}
                      </td>
                      <td style={{ padding:'10px 14px', fontSize:'12px', color:C.muted, whiteSpace:'nowrap' }}>
                        {new Date(u.data_admissao).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Secao>
        )}

        <div style={{
          padding:'12px 16px', background:C.surface2,
          border:`1px solid ${C.border}`, borderRadius:'8px',
          display:'flex', alignItems:'center', gap:'8px',
        }}>
          <span style={{ fontSize:'14px' }}>ℹ️</span>
          <p style={{ fontSize:'12px', color:C.muted, margin:0 }}>
            Indicadores atualizados em tempo real com dados reais do banco.
            Métricas de progresso e aprovação crescerão conforme os colaboradores
            utilizarem a plataforma.
          </p>
        </div>

      </div>
    </LayoutAdmin>
  )
}
