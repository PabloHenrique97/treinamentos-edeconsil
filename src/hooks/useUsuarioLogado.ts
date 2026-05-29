import { useMemo } from 'react'
import { getUsuario } from '../services/authStorage'

interface UsuarioLogado {
  id: string
  nome: string
  email: string
  perfil: 'admin' | 'instrutor' | 'colaborador'
  matricula: string
  cr: string
  cargo: string
  setor: string
  foto_url: string | null
}

export function useUsuarioLogado() {
  const usuario = useMemo(() => {
    return getUsuario<UsuarioLogado>()
  }, [])

  const iniciais = useMemo(() => {
    if (!usuario?.nome) return 'U'
    return usuario.nome
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }, [usuario?.nome])

  const primeiroNome = useMemo(() => {
    if (!usuario?.nome) return 'Usuário'
    return usuario.nome.split(' ')[0]
  }, [usuario?.nome])

  return {
    usuario,
    iniciais,
    primeiroNome,
    id:     usuario?.id     ?? '',
    nome:   usuario?.nome   ?? 'Usuário',
    email:  usuario?.email  ?? '',
    perfil: usuario?.perfil ?? 'colaborador',
    cargo:  usuario?.cargo  ?? '',
    setor:  usuario?.setor  ?? '',
    isAdmin:       usuario?.perfil === 'admin',
    isColaborador: usuario?.perfil === 'colaborador',
  }
}
