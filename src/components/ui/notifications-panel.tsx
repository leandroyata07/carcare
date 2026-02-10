import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { useAuthStore } from '@/stores/auth-store'
import { useNotificationStore } from '@/stores/notification-store'
import { Bell } from 'lucide-react'
import { Button } from './button'
import { Link } from '@tanstack/react-router'

export function NotificationsPanel() {
  const { vehicles } = useVehicleStore()
  const { currentUser } = useAuthStore()
  const { getUpcomingMaintenances, getOverdueMaintenances } = useMaintenanceStore()
  const { getUpcomingIPVAs, getOverdueIPVAs } = useIPVAStore()
  const { isRead } = useNotificationStore()
  
  // Pegar apenas veículos do usuário atual
  const userVehicles = currentUser ? vehicles.filter(v => v.userId === currentUser.id) : []
  
  // Buscar notificações de todos os veículos
  const allVehicleNotifications = userVehicles.map(vehicle => {
    const upcomingMaintenances = getUpcomingMaintenances(vehicle.id, vehicle.mileage, 500)
    const overdueMaintenances = getOverdueMaintenances(vehicle.id, vehicle.mileage)
    
    return {
      vehicleId: vehicle.id,
      overdueMaintenances,
      upcomingMaintenances,
      overdueIPVAs: [] as any[],
      upcomingIPVAs: [] as any[],
    }
  })
  
  // Buscar IPVAs (já vêm filtrados globalmente)
  const upcomingIPVAs = getUpcomingIPVAs(30)
  const overdueIPVAs = getOverdueIPVAs()
  
  // Adicionar IPVAs aos veículos correspondentes
  upcomingIPVAs.forEach(ipva => {
    const vehicleNotif = allVehicleNotifications.find(v => v.vehicleId === ipva.vehicleId)
    if (vehicleNotif) {
      vehicleNotif.upcomingIPVAs.push(ipva)
    }
  })
  
  overdueIPVAs.forEach(ipva => {
    const vehicleNotif = allVehicleNotifications.find(v => v.vehicleId === ipva.vehicleId)
    if (vehicleNotif) {
      vehicleNotif.overdueIPVAs.push(ipva)
    }
  })
  
  // Filtrar apenas veículos com notificações
  const vehiclesWithNotifications = allVehicleNotifications.filter(v => 
    v.overdueMaintenances.length > 0 || 
    v.upcomingMaintenances.length > 0 ||
    v.overdueIPVAs.length > 0 ||
    v.upcomingIPVAs.length > 0
  )
  
  // Calcular total de notificações
  const totalNotifications = vehiclesWithNotifications.reduce((acc, v) => 
    acc + v.overdueMaintenances.length + v.upcomingMaintenances.length + 
    v.overdueIPVAs.length + v.upcomingIPVAs.length, 0
  )

  // Coletar todos os IDs de notificações
  const allNotificationIds = vehiclesWithNotifications.flatMap(v => [
    ...v.overdueMaintenances.map(m => m.id),
    ...v.upcomingMaintenances.map(m => m.id),
    ...v.overdueIPVAs.map(i => i.id),
    ...v.upcomingIPVAs.map(i => i.id),
  ])

  // Calcular notificações não lidas
  const unreadCount = allNotificationIds.filter(id => !isRead(id)).length

  return (
    <Link to="/notifications">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    </Link>
  )
}
