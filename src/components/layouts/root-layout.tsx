import { Outlet, Link } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useSettingsStore } from '@/stores/settings-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { Toaster } from '@/components/ui/toaster'
import { PWAInstallPrompt } from '@/components/ui/pwa-install-prompt'
import { useToast } from '@/hooks/use-toast'
import { DEFAULT_ADMIN } from '@/lib/constants'

export function RootLayout() {
  const { settings } = useSettingsStore()
  const { initializeDefaultUser, users, currentUser } = useAuthStore()
  const { getUserVehicles } = useVehicleStore()
  const { getUpcomingMaintenances } = useMaintenanceStore()
  const { getUpcomingIPVAs } = useIPVAStore()
  const { toast } = useToast()

  const [showDemoWarning, setShowDemoWarning] = useState(() => {
    try {
      return localStorage.getItem('carcare-demo-warning-dismissed') !== 'true'
    } catch {
      return true
    }
  })

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

  // Demo warning detection: check if default admin (with default password) still exists
  const defaultAdminPresent = users.some(
    (u) => u.username === DEFAULT_ADMIN.username && u.mustChangePassword === true,
  )

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
      {defaultAdminPresent && showDemoWarning && (
        <div className="w-full bg-yellow-50 border-b border-yellow-200 text-yellow-900 p-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <strong>Atenção:</strong> Esta instalação está com o usuário admin padrão ativo. Não use dados reais.
            </div>
            <div className="flex items-center gap-2">
              <Link to="/users" className="underline text-sm">Alterar senha</Link>
              <button
                className="text-sm px-3 py-1 bg-yellow-200 rounded"
                onClick={() => {
                  try { localStorage.setItem('carcare-demo-warning-dismissed', 'true') } catch {}
                  setShowDemoWarning(false)
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      <Outlet />
      <Toaster />
      <PWAInstallPrompt />
    </>
  )
}
