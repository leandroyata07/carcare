import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { useAuthStore } from '@/stores/auth-store'
import { formatMileage, formatDate } from '@/lib/utils'
import { Bell, AlertTriangle, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

// Tipo para agrupar notificações por veículo
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

export function NotificationsPanel() {
  const { vehicles } = useVehicleStore()
  const { currentUser } = useAuthStore()
  const { getUpcomingMaintenances, getOverdueMaintenances } = useMaintenanceStore()
  const { getUpcomingIPVAs, getOverdueIPVAs } = useIPVAStore()
  
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {totalNotifications > 9 ? '9+' : totalNotifications}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        {/* Cabeçalho */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-base">Notificações</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Visualize todas as atividades recentes do sistema
          </p>
        </div>
        
        {totalNotifications === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <MessageSquare className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="font-semibold text-base mb-1">Tudo em dia!</h4>
            <p className="text-sm text-muted-foreground text-center">
              Você não possui nenhuma notificação no momento.
            </p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            {vehiclesWithNotifications.map((vehicleNotif, index) => {
              const vehicleTotalNotifications = 
                vehicleNotif.overdueMaintenances.length + 
                vehicleNotif.upcomingMaintenances.length +
                vehicleNotif.overdueIPVAs.length +
                vehicleNotif.upcomingIPVAs.length
              
              return (
                <div key={vehicleNotif.vehicleId}>
                  {index > 0 && <DropdownMenuSeparator />}
                  
                  {/* Cabeçalho do veículo */}
                  <div className="px-4 py-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">{vehicleNotif.vehicleBrand} {vehicleNotif.vehicleModel}</div>
                        <div className="text-xs text-muted-foreground">
                          {vehicleNotif.vehiclePlate}
                        </div>
                      </div>
                      <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                        {vehicleTotalNotifications > 9 ? '9+' : vehicleTotalNotifications}
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {/* Manutenções atrasadas */}
                    {vehicleNotif.overdueMaintenances.length > 0 && (
                      <>
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 text-red-600 font-medium text-xs">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Manutenções Atrasadas</span>
                          </div>
                        </div>
                        {vehicleNotif.overdueMaintenances.map((m) => {
                          const vehicle = userVehicles.find(v => v.id === vehicleNotif.vehicleId)!
                          return (
                            <DropdownMenuItem key={m.id} className="mx-2 mb-1 flex flex-col items-start p-3 cursor-pointer">
                              <div className="font-medium text-sm text-red-600">{m.type}</div>
                              <div className="text-xs text-muted-foreground">
                                Deveria ser feita em {formatMileage(m.nextChange || 0)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Atrasado em {formatMileage((vehicle.mileage - (m.nextChange || 0)))}
                              </div>
                            </DropdownMenuItem>
                          )
                        })}
                      </>
                    )}

                    {/* Manutenções próximas */}
                    {vehicleNotif.upcomingMaintenances.length > 0 && (
                      <>
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 text-yellow-600 font-medium text-xs">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Manutenções Próximas</span>
                          </div>
                        </div>
                        {vehicleNotif.upcomingMaintenances.map((m) => {
                          const vehicle = userVehicles.find(v => v.id === vehicleNotif.vehicleId)!
                          return (
                            <DropdownMenuItem key={m.id} className="mx-2 mb-1 flex flex-col items-start p-3 cursor-pointer">
                              <div className="font-medium text-sm">{m.type}</div>
                              <div className="text-xs text-muted-foreground">
                                Próxima em {formatMileage(m.nextChange || 0)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Faltam {formatMileage((m.nextChange || 0) - vehicle.mileage)}
                              </div>
                            </DropdownMenuItem>
                          )
                        })}
                      </>
                    )}

                    {/* IPVA atrasado */}
                    {vehicleNotif.overdueIPVAs.length > 0 && (
                      <>
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 text-red-600 font-medium text-xs">
                            <Calendar className="h-4 w-4" />
                            <span>IPVA/Licenciamento Atrasado</span>
                          </div>
                        </div>
                        {vehicleNotif.overdueIPVAs.map((ipva) => (
                          <DropdownMenuItem key={ipva.id} className="mx-2 mb-1 flex flex-col items-start p-3 cursor-pointer">
                            <div className="font-medium text-sm text-red-600">
                              {ipva.type} {ipva.year}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Venceu em {formatDate(ipva.dueDate)}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}

                    {/* IPVA próximo */}
                    {vehicleNotif.upcomingIPVAs.length > 0 && (
                      <>
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 text-yellow-600 font-medium text-xs">
                            <Calendar className="h-4 w-4" />
                            <span>IPVA/Licenciamento Próximo</span>
                          </div>
                        </div>
                        {vehicleNotif.upcomingIPVAs.map((ipva) => (
                          <DropdownMenuItem key={ipva.id} className="mx-2 mb-1 flex flex-col items-start p-3 cursor-pointer">
                            <div className="font-medium text-sm">
                              {ipva.type} {ipva.year}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Vence em {formatDate(ipva.dueDate)}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {totalNotifications > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-4 py-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Marcar como lidas
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
