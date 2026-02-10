import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { useAuthStore } from '@/stores/auth-store'
import { useNotificationStore } from '@/stores/notification-store'
import { formatMileage, formatDate } from '@/lib/utils'
import { Bell, AlertTriangle, Calendar, CheckCircle2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

interface VehicleNotification {
  vehicleId: string
  vehicleBrand: string
  vehicleModel: string
  vehiclePlate: string
  overdueMaintenances: any[]
  upcomingMaintenances: any[]
  overdueIPVAs: any[]
  upcomingIPVAs: any[]
}

export function NotificationsPage() {
  const { vehicles } = useVehicleStore()
  const { currentUser } = useAuthStore()
  const { getUpcomingMaintenances, getOverdueMaintenances } = useMaintenanceStore()
  const { getUpcomingIPVAs, getOverdueIPVAs } = useIPVAStore()
  const { markAllAsRead, isRead, clearOldNotifications } = useNotificationStore()
  
  useEffect(() => {
    clearOldNotifications()
  }, [clearOldNotifications])

  // Pegar apenas veículos do usuário atual
  const userVehicles = currentUser ? vehicles.filter(v => v.userId === currentUser.id) : []
  
  // Buscar notificações de todos os veículos
  const allVehicleNotifications: VehicleNotification[] = userVehicles.map(vehicle => {
    const upcomingMaintenances = getUpcomingMaintenances(vehicle.id, vehicle.mileage, 500)
    const overdueMaintenances = getOverdueMaintenances(vehicle.id, vehicle.mileage)
    
    return {
      vehicleId: vehicle.id,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      vehiclePlate: vehicle.plate,
      overdueMaintenances,
      upcomingMaintenances,
      overdueIPVAs: [],
      upcomingIPVAs: [],
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

  const handleMarkAllAsRead = () => {
    markAllAsRead(allNotificationIds)
  }

  // Calcular notificações não lidas
  const unreadCount = allNotificationIds.filter(id => !isRead(id)).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            Notificações
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe todas as atividades e alertas do sistema
          </p>
        </div>
        {totalNotifications > 0 && unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotifications}</div>
            <p className="text-xs text-muted-foreground">
              {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesWithNotifications.length}</div>
            <p className="text-xs text-muted-foreground">
              com pendências
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehiclesWithNotifications.reduce((acc, v) => 
                acc + v.overdueMaintenances.length + v.upcomingMaintenances.length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {vehiclesWithNotifications.reduce((acc, v) => 
                acc + v.overdueMaintenances.length, 0
              )} atrasada{vehiclesWithNotifications.reduce((acc, v) => 
                acc + v.overdueMaintenances.length, 0
              ) !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPVA/Licenciamento</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehiclesWithNotifications.reduce((acc, v) => 
                acc + v.overdueIPVAs.length + v.upcomingIPVAs.length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {vehiclesWithNotifications.reduce((acc, v) => 
                acc + v.overdueIPVAs.length, 0
              )} atrasado{vehiclesWithNotifications.reduce((acc, v) => 
                acc + v.overdueIPVAs.length, 0
              ) !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      {totalNotifications === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <MessageSquare className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="font-semibold text-xl mb-2">Tudo em dia!</h3>
            <p className="text-muted-foreground max-w-md">
              Você não possui nenhuma notificação no momento. Continue mantendo seus veículos em dia!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {vehiclesWithNotifications.map((vehicleNotif) => {
            const vehicleTotalNotifications = 
              vehicleNotif.overdueMaintenances.length + 
              vehicleNotif.upcomingMaintenances.length +
              vehicleNotif.overdueIPVAs.length +
              vehicleNotif.upcomingIPVAs.length
            
            const vehicle = userVehicles.find(v => v.id === vehicleNotif.vehicleId)!

            return (
              <Card key={vehicleNotif.vehicleId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {vehicleNotif.vehicleBrand} {vehicleNotif.vehicleModel}
                      </CardTitle>
                      <CardDescription>
                        Placa: {vehicleNotif.vehiclePlate} • Km: {formatMileage(vehicle.mileage)}
                      </CardDescription>
                    </div>
                    <Badge variant="destructive" className="text-base px-3 py-1">
                      {vehicleTotalNotifications}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Manutenções atrasadas */}
                  {vehicleNotif.overdueMaintenances.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Manutenções Atrasadas</span>
                      </div>
                      <div className="space-y-2">
                        {vehicleNotif.overdueMaintenances.map((m) => (
                          <div
                            key={m.id}
                            className={`p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 ${
                              isRead(m.id) ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="font-semibold text-red-700 dark:text-red-400">{m.type}</div>
                                <div className="text-sm text-muted-foreground">
                                  Deveria ser feita em {formatMileage(m.nextChange || 0)}
                                </div>
                                <div className="text-sm font-medium text-red-600">
                                  Atrasado em {formatMileage((vehicle.mileage - (m.nextChange || 0)))}
                                </div>
                              </div>
                              {isRead(m.id) && (
                                <Badge variant="secondary" className="text-xs">
                                  Lida
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Manutenções próximas */}
                  {vehicleNotif.upcomingMaintenances.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Manutenções Próximas</span>
                      </div>
                      <div className="space-y-2">
                        {vehicleNotif.upcomingMaintenances.map((m) => (
                          <div
                            key={m.id}
                            className={`p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 ${
                              isRead(m.id) ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="font-semibold text-yellow-700 dark:text-yellow-400">{m.type}</div>
                                <div className="text-sm text-muted-foreground">
                                  Próxima em {formatMileage(m.nextChange || 0)}
                                </div>
                                <div className="text-sm font-medium text-yellow-600">
                                  Faltam {formatMileage((m.nextChange || 0) - vehicle.mileage)}
                                </div>
                              </div>
                              {isRead(m.id) && (
                                <Badge variant="secondary" className="text-xs">
                                  Lida
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IPVA atrasado */}
                  {vehicleNotif.overdueIPVAs.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <Calendar className="h-5 w-5" />
                        <span>IPVA/Licenciamento Atrasado</span>
                      </div>
                      <div className="space-y-2">
                        {vehicleNotif.overdueIPVAs.map((ipva) => (
                          <div
                            key={ipva.id}
                            className={`p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 ${
                              isRead(ipva.id) ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="font-semibold text-red-700 dark:text-red-400">
                                  {ipva.type} {ipva.year}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Venceu em {formatDate(ipva.dueDate)}
                                </div>
                              </div>
                              {isRead(ipva.id) && (
                                <Badge variant="secondary" className="text-xs">
                                  Lida
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IPVA próximo */}
                  {vehicleNotif.upcomingIPVAs.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                        <Calendar className="h-5 w-5" />
                        <span>IPVA/Licenciamento Próximo</span>
                      </div>
                      <div className="space-y-2">
                        {vehicleNotif.upcomingIPVAs.map((ipva) => (
                          <div
                            key={ipva.id}
                            className={`p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 ${
                              isRead(ipva.id) ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="font-semibold text-yellow-700 dark:text-yellow-400">
                                  {ipva.type} {ipva.year}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Vence em {formatDate(ipva.dueDate)}
                                </div>
                              </div>
                              {isRead(ipva.id) && (
                                <Badge variant="secondary" className="text-xs">
                                  Lida
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
