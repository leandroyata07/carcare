import { Outlet } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useSettingsStore } from '@/stores/settings-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { Toaster } from '@/components/ui/toaster'
import { PWAInstallPrompt } from '@/components/ui/pwa-install-prompt'
import { PWAUpdatePrompt } from '@/components/pwa-update-prompt'
import { SessionManager } from '@/components/session-manager'
import { useToast } from '@/hooks/use-toast'
import { initVersionListener, getLocalVersion, fetchServerVersion } from '@/lib/version-checker'

export function RootLayout() {
  const { settings } = useSettingsStore()
  const { initializeDefaultUser, currentUser } = useAuthStore()
  const { getUserVehicles } = useVehicleStore()
  const { getUpcomingMaintenances } = useMaintenanceStore()
  const { getUpcomingIPVAs } = useIPVAStore()
  const { toast } = useToast()

  const notifiedRef = useRef<Set<string>>(new Set())
  const versionNotifiedRef = useRef(false)

  useEffect(() => {
    // Initialize default admin user if no users exist
    initializeDefaultUser()
  }, [initializeDefaultUser])

  // Inicializa o listener de versão (FORÇA RELOAD QUANDO SW ATUALIZA)
  useEffect(() => {
    initVersionListener()
    console.log('[RootLayout] Version listener initialized')
  }, [])

  // Verifica se o sistema foi recém atualizado e mostra notificação
  useEffect(() => {
    if (versionNotifiedRef.current) return
    if (!currentUser) return

    const checkVersion = async () => {
      const localVersion = getLocalVersion()
      if (!localVersion) {
        // Primeira vez, salva a versão atual
        const serverVersionInfo = await fetchServerVersion()
        if (serverVersionInfo) {
          localStorage.setItem('carcare-app-version', serverVersionInfo.version)
        }
        return
      }

      // Verifica se acabou de atualizar (flag temporária)
      const justUpdated = sessionStorage.getItem('carcare-just-updated')
      if (justUpdated === 'true') {
        versionNotifiedRef.current = true
        sessionStorage.removeItem('carcare-just-updated')
        
        toast({
          title: '✨ Sistema Atualizado!',
          description: `Você está usando a versão ${localVersion}`,
          duration: 5000,
        })
      }
    }

    checkVersion()
  }, [currentUser, toast])

  useEffect(() => {
    // Apply dark mode class to document
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])

  // Notifications: check periodically for upcoming maintenances and IPVAs
  useEffect(() => {
    if (!settings.notificationsEnabled) return

    const interval = setInterval(() => {
      try {
        if (!currentUser) return

        const userVehicles = getUserVehicles(currentUser.id)
        userVehicles.forEach((v) => {
          const upcoming = getUpcomingMaintenances(v.id, v.mileage, settings.maintenanceAlertDistance)
          upcoming.forEach((m) => {
            if (!notifiedRef.current.has(m.id)) {
              notifiedRef.current.add(m.id)
              toast({
                title: 'Manutenção próxima',
                description: `${v.brand} ${v.model}: ${m.type} em ${m.nextChange} km (atual ${v.mileage} km)`,
              })
            }
          })
        })

        const upcomingIPVAs = getUpcomingIPVAs(settings.ipvaAlertDays).filter(i => i.userId === currentUser.id)
        upcomingIPVAs.forEach((i) => {
          if (!notifiedRef.current.has(i.id)) {
            notifiedRef.current.add(i.id)
            toast({
              title: 'IPVA próximo',
              description: `Veículo: ${i.vehicleId} • vencimento em ${i.dueDate}`,
            })
          }
        })
      } catch (e) {
        // ignore
      }
    }, 60 * 1000) // check every minute

    return () => clearInterval(interval)
  }, [settings.notificationsEnabled, settings.maintenanceAlertDistance, settings.ipvaAlertDays, currentUser, getUserVehicles, getUpcomingMaintenances, getUpcomingIPVAs, toast])

  return (
    <>
      <SessionManager />
      <Outlet />
      <Toaster />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </>
  )
}
