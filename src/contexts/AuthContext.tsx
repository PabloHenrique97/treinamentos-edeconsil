import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authAPI } from '../services/api'

interface Usuario {
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

interface AuthContextType {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  erro: string | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isColaborador: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario]       = useState<Usuario | null>(null)
  const [token, setToken]           = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro]             = useState<string | null>(null)

  useEffect(() => {
    const tokenSalvo   = localStorage.getItem('edeconsil_token')
    const usuarioSalvo = localStorage.getItem('edeconsil_usuario')

    if (tokenSalvo && usuarioSalvo) {
      try {
        setToken(tokenSalvo)
        setUsuario(JSON.parse(usuarioSalvo))
      } catch {
        localStorage.removeItem('edeconsil_token')
        localStorage.removeItem('edeconsil_usuario')
      }
    }
    setCarregando(false)
  }, [])

  const login = async (email: string, senha: string) => {
    setErro(null)
    setCarregando(true)
    try {
      const resposta = await authAPI.login(email, senha)
      localStorage.setItem('edeconsil_token',   resposta.token)
      localStorage.setItem('edeconsil_usuario', JSON.stringify(resposta.usuario))
      setToken(resposta.token)
      setUsuario(resposta.usuario as Usuario)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao fazer login'
      setErro(mensagem)
      throw err
    } finally {
      setCarregando(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('edeconsil_token')
    localStorage.removeItem('edeconsil_usuario')
    setToken(null)
    setUsuario(null)
    setErro(null)
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      carregando,
      erro,
      login,
      logout,
      isAdmin:       usuario?.perfil === 'admin',
      isColaborador: usuario?.perfil === 'colaborador',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
