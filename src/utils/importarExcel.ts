import * as XLSX from 'xlsx'

export interface AlunoImportado {
  nome:             string
  cpf:              string
  cargo:            string
  setor:            string | null  // coluna H — Setor/Turma (opcional)
  data_admissao:    string | null
  matricula:        string | null
  data_nascimento:  string | null
  centro_custo:     string | null
  cpfLimpo:         string
  senhaInicial:     string | null
  erros:            string[]
  valido:           boolean
}

function converterData(valor: any): string | null {
  if (!valor) return null

  if (typeof valor === 'number') {
    const data = XLSX.SSF.parse_date_code(valor)
    if (data) {
      const dd   = String(data.d).padStart(2, '0')
      const mm   = String(data.m).padStart(2, '0')
      const yyyy = data.y
      return `${yyyy}-${mm}-${dd}`
    }
  }

  if (typeof valor === 'string') {
    const partes = valor.trim().split('/')
    if (partes.length === 3) {
      const [dd, mm, yyyy] = partes
      return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return valor
    }
    if (/^\d{8}$/.test(valor)) {
      const dd   = valor.slice(0,2)
      const mm   = valor.slice(2,4)
      const yyyy = valor.slice(4,8)
      return `${yyyy}-${mm}-${dd}`
    }
  }

  return null
}

function dataNascimentoParaSenha(dataIso: string | null): string | null {
  if (!dataIso) return null
  const [yyyy, mm, dd] = dataIso.split('-')
  if (!yyyy || !mm || !dd) return null
  return `${dd}${mm}${yyyy}`
}

function limparCpf(valor: any): string {
  if (!valor) return ''
  return String(valor).replace(/[.\-\s]/g, '').trim()
}

export function lerPlanilhaExcel(arquivo: File): Promise<AlunoImportado[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: false,
          raw: false,
        })

        const nomePlanilha = workbook.SheetNames[0]
        const planilha     = workbook.Sheets[nomePlanilha]

        const linhas: any[][] = XLSX.utils.sheet_to_json(planilha, {
          header: 1,
          raw: true,
          defval: '',
        })

        const alunos: AlunoImportado[] = []

        const primeiraLinha = linhas[0] ?? []
        const temCabecalho  = typeof primeiraLinha[0] === 'string'
          && primeiraLinha[0].toLowerCase().includes('nome')

        const inicio = temCabecalho ? 1 : 0

        for (let i = inicio; i < linhas.length; i++) {
          const linha = linhas[i]

          if (!linha || linha.every((c: any) => !c)) continue

          const nome            = String(linha[0] ?? '').trim()
          const cpfRaw          = linha[1]
          const cargo           = String(linha[2] ?? '').trim()
          const admissaoRaw     = linha[3]
          const matriculaRaw    = linha[4]
          const dataNascRaw     = linha[5]
          const centroCustoRaw  = linha[6]
          const setorRaw        = linha[7]  // coluna H — Setor/Turma (opcional)

          const cpfLimpo        = limparCpf(cpfRaw)
          const data_admissao   = converterData(admissaoRaw)
          const data_nascimento = converterData(dataNascRaw)
          const matricula       = matriculaRaw ? String(matriculaRaw).trim() : null
          const centro_custo    = centroCustoRaw ? String(centroCustoRaw).trim() : null
          const setor           = setorRaw ? String(setorRaw).trim() : null
          const senhaInicial    = dataNascimentoParaSenha(data_nascimento)

          const erros: string[] = []
          if (!nome)                   erros.push('Nome vazio')
          if (cpfLimpo.length !== 11)  erros.push(`CPF inválido: "${cpfRaw}" (${cpfLimpo.length} dígitos)`)
          if (!/^\d+$/.test(cpfLimpo)) erros.push('CPF contém letras')
          if (!data_nascimento)        erros.push('Data de nascimento inválida ou ausente')

          alunos.push({
            nome,
            cpf:            cpfRaw ? String(cpfRaw) : '',
            cargo,
            setor,
            data_admissao,
            matricula,
            data_nascimento,
            centro_custo,
            cpfLimpo,
            senhaInicial,
            erros,
            valido: erros.length === 0,
          })
        }

        resolve(alunos)
      } catch (err) {
        reject(new Error('Erro ao ler planilha: ' + (err as Error).message))
      }
    }

    reader.onerror = () => reject(new Error('Erro ao carregar arquivo'))
    reader.readAsArrayBuffer(arquivo)
  })
}
