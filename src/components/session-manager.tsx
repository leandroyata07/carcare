import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'

export function SessionManager() {
  const { isAuthenticated, checkSession, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleSessionCheck = useCallback(() => {
    if (isAuthenticated) {
      const isValid = checkSession()
      if (!isValid) {
        console.log('[SessionManager] Sessão expirada - fazendo logout')
        logout()
        navigate({ to: '/login' })
      }
    }
  }, [isAuthenticated, checkSession, logout, navigate])

  useEffect(() => {
    // Verifica sessão quando a página fica visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[SessionManager] Página visível - verificando sessão')
        handleSessionCheck()
      }
    }

    // Verifica sessão quando a página ganha foco
    const handleFocus = () => {
      console.log('[SessionManager] Página ganhou foco - verificando sessão')
      handleSessionCheck()
    }

    // Verifica sessão periodicamente (a cada 1 minuto)
    const interval = setInterval(() => {
      handleSessionCheck()
    }, 60000) // 1 minuto

    // Adiciona listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // Verifica imediatamente ao montar
    handleSessionCheck()

    // Cleanup
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [handleSessionCheck])

  // Este componente não renderiza nada
  return null
}
