import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IPVA, IPVAForm, IPVAStatus } from '@/lib/schemas'
import { generateUUID, calculateDaysUntil } from '@/lib/utils'

interface IPVAState {
  ipvas: IPVA[]
  addIPVA: (data: IPVAForm, vehicleId: string, userId: string) => IPVA
  updateIPVA: (id: string, data: Partial<IPVAForm>) => void
  deleteIPVA: (id: string) => void
  getVehicleIPVAs: (vehicleId: string) => IPVA[]
  getIPVAById: (id: string) => IPVA | null
  getUpcomingIPVAs: (alertDays: number) => IPVA[]
  getOverdueIPVAs: () => IPVA[]
  updateIPVAStatus: (id: string, status: IPVAStatus) => void
}

export const useIPVAStore = create<IPVAState>()(
  persist(
    (set, get) => ({
      ipvas: [],

      addIPVA: (data: IPVAForm, vehicleId: string, userId: string) => {
        const now = new Date().toISOString()
        const newIPVA: IPVA = {
          id: generateUUID(),
          ...data,
          totalValue: data.ipvaValue + data.licensingValue,
          paymentDate: data.paymentDate || undefined,
          paymentLocation: data.paymentLocation || undefined,
          paymentMethod: data.paymentMethod || undefined,
          receiptNumber: data.receiptNumber || undefined,
          notes: data.notes || undefined,
          documents: data.documents || [],
          vehicleId,
          userId,
          createdAt: now,
          updatedAt: now,
        }
        
        set((state) => ({
          ipvas: [...state.ipvas, newIPVA],
        }))
        
        return newIPVA
      },

      updateIPVA: (id: string, data: Partial<IPVAForm>) => {
        const now = new Date().toISOString()
        
        set((state) => ({
          ipvas: state.ipvas.map((ipva) => {
            if (ipva.id !== id) return ipva
            const updated = { ...ipva, ...data, updatedAt: now }
            // Recalcular totalValue se ipvaValue ou licensingValue mudaram
            if (data.ipvaValue !== undefined || data.licensingValue !== undefined) {
              updated.totalValue = (data.ipvaValue ?? ipva.ipvaValue) + (data.licensingValue ?? ipva.licensingValue)
            }
            return updated
          }),
        }))
      },

      deleteIPVA: (id: string) => {
        set((state) => ({
          ipvas: state.ipvas.filter((i) => i.id !== id),
        }))
      },

      getVehicleIPVAs: (vehicleId: string) => {
        return get()
          .ipvas.filter((i) => i.vehicleId === vehicleId)
          .sort((a, b) => b.year - a.year)
      },

      getIPVAById: (id: string) => {
        return get().ipvas.find((i) => i.id === id) || null
      },

      getUpcomingIPVAs: (alertDays: number) => {
        return get()
          .ipvas.filter((i) => {
            if (i.status === 'paid') return false
            const daysUntil = calculateDaysUntil(i.dueDate)
            return daysUntil >= 0 && daysUntil <= alertDays
          })
          .sort((a, b) => calculateDaysUntil(a.dueDate) - calculateDaysUntil(b.dueDate))
      },

      getOverdueIPVAs: () => {
        return get()
          .ipvas.filter((i) => {
            if (i.status === 'paid') return false
            const daysUntil = calculateDaysUntil(i.dueDate)
            return daysUntil < 0
          })
          .sort((a, b) => calculateDaysUntil(b.dueDate) - calculateDaysUntil(a.dueDate))
      },

      updateIPVAStatus: (id: string, status: IPVAStatus) => {
        const now = new Date().toISOString()
        
        set((state) => ({
          ipvas: state.ipvas.map((ipva) =>
            ipva.id === id
              ? { 
                  ...ipva, 
                  status, 
                  paymentDate: status === 'paid' ? now.split('T')[0] : ipva.paymentDate,
                  updatedAt: now 
                }
              : ipva
          ),
        }))
      },
    }),
    {
      name: 'carcare-ipvas',
    }
  )
)
