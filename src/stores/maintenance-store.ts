import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Maintenance, MaintenanceForm } from '@/lib/schemas'
import { generateUUID } from '@/lib/utils'

interface MaintenanceState {
  maintenances: Maintenance[]
  addMaintenance: (data: MaintenanceForm, vehicleId: string, userId: string) => Maintenance
  updateMaintenance: (id: string, data: Partial<MaintenanceForm>) => void
  deleteMaintenance: (id: string) => void
  getVehicleMaintenances: (vehicleId: string) => Maintenance[]
  getMaintenanceById: (id: string) => Maintenance | null
  getUpcomingMaintenances: (vehicleId: string, currentMileage: number, alertDistance: number) => Maintenance[]
  getOverdueMaintenances: (vehicleId: string, currentMileage: number) => Maintenance[]
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      maintenances: [],

      addMaintenance: (data: MaintenanceForm, vehicleId: string, userId: string) => {
        const now = new Date().toISOString()
        const newMaintenance: Maintenance = {
          id: generateUUID(),
          ...data,
          nextChange: data.nextChange || undefined,
          vehicleId,
          userId,
          createdAt: now,
          updatedAt: now,
        }
        
        set((state) => ({
          maintenances: [...state.maintenances, newMaintenance],
        }))
        
        return newMaintenance
      },

      updateMaintenance: (id: string, data: Partial<MaintenanceForm>) => {
        const now = new Date().toISOString()
        
        // Convert empty string to undefined for optional fields
        const cleanData = {
          ...data,
          nextChange: data.nextChange === '' ? undefined : data.nextChange,
        }
        
        set((state) => ({
          maintenances: state.maintenances.map((maintenance) =>
            maintenance.id === id
              ? { ...maintenance, ...cleanData, updatedAt: now }
              : maintenance
          ),
        }))
      },

      deleteMaintenance: (id: string) => {
        set((state) => ({
          maintenances: state.maintenances.filter((m) => m.id !== id),
        }))
      },

      getVehicleMaintenances: (vehicleId: string) => {
        return get()
          .maintenances.filter((m) => m.vehicleId === vehicleId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      getMaintenanceById: (id: string) => {
        return get().maintenances.find((m) => m.id === id) || null
      },

      getUpcomingMaintenances: (vehicleId: string, currentMileage: number, alertDistance: number) => {
        return get()
          .maintenances.filter((m) => 
            m.vehicleId === vehicleId && 
            m.nextChange && 
            m.nextChange <= currentMileage + alertDistance &&
            m.nextChange > currentMileage
          )
          .sort((a, b) => (a.nextChange || 0) - (b.nextChange || 0))
      },

      getOverdueMaintenances: (vehicleId: string, currentMileage: number) => {
        return get()
          .maintenances.filter((m) => 
            m.vehicleId === vehicleId && 
            m.nextChange && 
            m.nextChange < currentMileage
          )
          .sort((a, b) => (a.nextChange || 0) - (b.nextChange || 0))
      },
    }),
    {
      name: 'carcare-maintenances',
    }
  )
)
