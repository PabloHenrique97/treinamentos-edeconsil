import { useState, useCallback } from 'react'

const STORAGE_KEY = 'edeconsil_configuracoes'

export interface ConfiguracoesSistema {
  nomeEmpresa:          string
  nomePortal:           string
  cnpj:                 string
  site:                 string
  telefone:             string
  emailSuporte:         string
  endereco:             string
  descricao:            string
  idioma:               string
  fusoHorario:          string
  formatoData:          string
  itensPorPagina:       number
  modoManutencao:       boolean
  registroPublico:      boolean
  loginGoogle:          boolean
  loginMicrosoft:       boolean
  corPrimaria:          string
  corDestaque:          string
  notifEmail:           boolean
  notifSistema:         boolean
  notifWhatsapp:        boolean
  notifNovoCurso:       boolean
  notifCertificado:     boolean
  notifMensagem:        boolean
  notifAvaliacao:       boolean
  notifVencimento:      boolean
  diasAntecedencia:     number
  senhaMinChars:        number
  senhaMaiuscula:       boolean
  senhaNumero:          boolean
  senhaEspecial:        boolean
  senhaExpiracao:       boolean
  diasExpiracao:        number
  autenticacao2fa:      boolean
  logAcessos:           boolean
  timeoutSessao:        number
  tentativasMax:        number
  notaMinima:           number
  tentativasProva:      number
  progressoObrig:       boolean
  ordemObrig:           boolean
  comentarios:          boolean
  avaliacaoObrig:       boolean
  pausarVideo:          boolean
  velocidadeVideo:      boolean
  qualidadeVideo:       string
  validadeCert:         number
  emissaoAuto:          boolean
  assinaturaDigital:    boolean
  codigoVerif:          boolean
  gerarPdf:             boolean
  compartilharLinkedin: boolean
  nomeAssinante:        string
  rodapeCert:           string
  aprovacaoManual:      boolean
  crAutomatico:         boolean
  emailBoasVindas:      boolean
  limitePorturma:       number
}

export const DEFAULTS: ConfiguracoesSistema = {
  nomeEmpresa:          'Edeconsil Construções e Locações LTDA',
  nomePortal:           'Universidade Corporativa Edeconsil',
  cnpj:                 '',
  site:                 '',
  telefone:             '',
  emailSuporte:         'suporte@edeconsil.com.br',
  endereco:             'São Luís, MA',
  descricao:            '',
  idioma:               'pt-BR',
  fusoHorario:          'America/Fortaleza',
  formatoData:          'DD/MM/AAAA',
  itensPorPagina:       20,
  modoManutencao:       false,
  registroPublico:      false,
  loginGoogle:          false,
  loginMicrosoft:       false,
  corPrimaria:          '#1a56ff',
  corDestaque:          '#F5C400',
  notifEmail:           true,
  notifSistema:         true,
  notifWhatsapp:        false,
  notifNovoCurso:       true,
  notifCertificado:     true,
  notifMensagem:        true,
  notifAvaliacao:       false,
  notifVencimento:      true,
  diasAntecedencia:     7,
  senhaMinChars:        8,
  senhaMaiuscula:       true,
  senhaNumero:          true,
  senhaEspecial:        false,
  senhaExpiracao:       false,
  diasExpiracao:        90,
  autenticacao2fa:      false,
  logAcessos:           true,
  timeoutSessao:        480,
  tentativasMax:        5,
  notaMinima:           70,
  tentativasProva:      3,
  progressoObrig:       true,
  ordemObrig:           false,
  comentarios:          false,
  avaliacaoObrig:       true,
  pausarVideo:          true,
  velocidadeVideo:      true,
  qualidadeVideo:       '720p',
  validadeCert:         24,
  emissaoAuto:          true,
  assinaturaDigital:    false,
  codigoVerif:          true,
  gerarPdf:             true,
  compartilharLinkedin: false,
  nomeAssinante:        '',
  rodapeCert:           'São Luís, MA — Edeconsil Construções e Locações LTDA',
  aprovacaoManual:      false,
  crAutomatico:         true,
  emailBoasVindas:      true,
  limitePorturma:       0,
}

export function useConfiguracoes() {
  const [config, setConfig] = useState<ConfiguracoesSistema>(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      if (salvo) return { ...DEFAULTS, ...JSON.parse(salvo) }
    } catch {}
    return DEFAULTS
  })

  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [tipoMsg,  setTipoMsg]  = useState<'sucesso' | 'erro'>('sucesso')

  const atualizar = useCallback(
    <K extends keyof ConfiguracoesSistema>(campo: K, valor: ConfiguracoesSistema[K]) => {
      setConfig(prev => ({ ...prev, [campo]: valor }))
    }, []
  )

  const salvar = useCallback(async (secao?: string) => {
    setSalvando(true)
    setMensagem('')
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      setMensagem(`${secao ? secao + ' salvo' : 'Configurações salvas'} com sucesso!`)
      setTipoMsg('sucesso')
      setTimeout(() => setMensagem(''), 3000)
    } catch {
      setMensagem('Erro ao salvar configurações.')
      setTipoMsg('erro')
    } finally {
      setSalvando(false)
    }
  }, [config])

  const restaurarPadroes = useCallback(() => {
    setConfig(DEFAULTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULTS))
    setMensagem('Configurações restauradas para o padrão.')
    setTipoMsg('sucesso')
    setTimeout(() => setMensagem(''), 3000)
  }, [])

  return { config, atualizar, salvar, salvando, mensagem, tipoMsg, restaurarPadroes }
}
