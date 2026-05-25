import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { formatMileage, formatDate } from '@/lib/utils'
import { Bell, AlertTriangle, Calendar } from 'lucide-react'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

export function NotificationsPanel() {
  const { getCurrentVehicle } = useVehicleStore()
  const { getUpcomingMaintenances, getOverdueMaintenances } = useMaintenanceStore()
  const { getUpcomingIPVAs, getOverdueIPVAs } = useIPVAStore()
  
  const currentVehicle = getCurrentVehicle()
  
  if (!currentVehicle) {
    return null
  }

  const upcomingMaintenances = getUpcomingMaintenances(currentVehicle.id, currentVehicle.mileage, 500)
  const overdueMaintenances = getOverdueMaintenances(currentVehicle.id, currentVehicle.mileage)
  const upcomingIPVAs = getUpcomingIPVAs(30)
  const overdueIPVAs = getOverdueIPVAs()

  const totalNotifications = upcomingMaintenances.length + overdueMaintenances.length + upcomingIPVAs.length + overdueIPVAs.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalNotifications > 9 ? '9+' : totalNotifications}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {totalNotifications === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {/* Manutenções atrasadas */}
            {overdueMaintenances.length > 0 && (
              <>
                <DropdownMenuLabel className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Manutenções Atrasadas
                </DropdownMenuLabel>
                {overdueMaintenances.map((m) => (
                  <DropdownMenuItem key={m.id} className="flex flex-col items-start p-3">
                    <div className="font-medium text-red-600">{m.type}</div>
                    <div className="text-xs text-muted-foreground">
                      Deveria ser feita em {formatMileage(m.nextChange || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Atrasado em {formatMileage((currentVehicle.mileage - (m.nextChange || 0)))}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Manutenções próximas */}
            {upcomingMaintenances.length > 0 && (
              <>
                <DropdownMenuLabel className="text-yellow-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Manutenções Próximas
                </DropdownMenuLabel>
                {upcomingMaintenances.map((m) => (
                  <DropdownMenuItem key={m.id} className="flex flex-col items-start p-3">
                    <div className="font-medium">{m.type}</div>
                    <div className="text-xs text-muted-foreground">
                      Próxima em {formatMileage(m.nextChange || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Faltam {formatMileage((m.nextChange || 0) - currentVehicle.mileage)}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* IPVA atrasado */}
            {overdueIPVAs.length > 0 && (
              <>
                <DropdownMenuLabel className="text-red-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  IPVA/Licenciamento Atrasado
                </DropdownMenuLabel>
                {overdueIPVAs.map((ipva) => (
                  <DropdownMenuItem key={ipva.id} className="flex flex-col items-start p-3">
                    <div className="font-medium text-red-600">
                      {ipva.type} {ipva.year}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Venceu em {formatDate(ipva.dueDate)}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* IPVA próximo */}
            {upcomingIPVAs.length > 0 && (
              <>
                <DropdownMenuLabel className="text-yellow-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  IPVA/Licenciamento Próximo
                </DropdownMenuLabel>
                {upcomingIPVAs.map((ipva) => (
                  <DropdownMenuItem key={ipva.id} className="flex flex-col items-start p-3">
                    <div className="font-medium">
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
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
