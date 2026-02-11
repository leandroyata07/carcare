import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Vehicle, VehicleForm } from '@/lib/schemas'
import { generateUUID } from '@/lib/utils'

interface VehicleState {
  vehicles: Vehicle[]
  currentVehicleId: string | null
  addVehicle: (data: VehicleForm, userId: string) => Vehicle
  updateVehicle: (id: string, data: Partial<VehicleForm>) => void
  deleteVehicle: (id: string) => void
  setCurrentVehicle: (id: string) => void
  getCurrentVehicle: () => Vehicle | null
  getUserVehicles: (userId: string) => Vehicle[]
  updateMileage: (id: string, mileage: number, mileageDate: string) => void
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      currentVehicleId: null,

      addVehicle: (data: VehicleForm, userId: string) => {
        const now = new Date().toISOString()
        
        const cleanData = {
          ...data,
          mileageDate: data.mileageDate || new Date().toISOString().split('T')[0],
        }
        
        const newVehicle: Vehicle = {
          id: generateUUID(),
          ...cleanData,
          userId,
          createdAt: now,
          updatedAt: now,
        }
        
        set((state) => ({
          vehicles: [...state.vehicles, newVehicle],
          currentVehicleId: state.currentVehicleId || newVehicle.id,
        }))
        
        return newVehicle
      },

      updateVehicle: (id: string, data: Partial<VehicleForm>) => {
        const now = new Date().toISOString()
        
        const cleanData = {
          ...data,
        }
        
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id
              ? { ...vehicle, ...cleanData, updatedAt: now }
              : vehicle
          ),
        }))
      },

      deleteVehicle: (id: string) => {
        set((state) => ({
          vehicles: state.vehicles.filter((v) => v.id !== id),
          currentVehicleId: state.currentVehicleId === id ? null : state.currentVehicleId,
        }))
      },

      setCurrentVehicle: (id: string) => {
        set({ currentVehicleId: id })
      },

      getCurrentVehicle: () => {
        const { vehicles, currentVehicleId } = get()
        return vehicles.find((v) => v.id === currentVehicleId) || null
      },

      getUserVehicles: (userId: string) => {
        return get().vehicles.filter((v) => v.userId === userId)
      },

      updateMileage: (id: string, mileage: number, mileageDate: string) => {
        const now = new Date().toISOString()
        
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id
              ? { ...vehicle, mileage, mileageDate, updatedAt: now }
              : vehicle
          ),
        }))
      },
    }),
    {
      name: 'carcare-vehicles',
    }
  )
)
