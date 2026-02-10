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

export function RootLayout() {
  const { settings } = useSettingsStore()
  const { initializeDefaultUser, currentUser } = useAuthStore()
  const { getUserVehicles } = useVehicleStore()
  const { getUpcomingMaintenances } = useMaintenanceStore()
  const { getUpcomingIPVAs } = useIPVAStore()
  const { toast } = useToast()

  const notifiedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Initialize default admin user if no users exist
    initializeDefaultUser()
  }, [initializeDefaultUser])

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
