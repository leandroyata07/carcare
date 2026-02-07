import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod'
import {
  userSchema,
  vehicleSchema,
  maintenanceSchema,
  ipvaSchema,
  categorySchema,
  settingsSchema,
} from '@/lib/schemas'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('pt-BR').format(mileage) + ' km'
}

export function generateUUID(): string {
  return crypto.randomUUID()
}

export function resizeImage(file: File, maxSize: number = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Não foi possível obter o contexto do canvas'))
          return
        }
        
        canvas.width = maxSize
        canvas.height = maxSize
        
        // Calcular dimensões mantendo proporção
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxSize) {
            height = height * (maxSize / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = width * (maxSize / height)
            height = maxSize
          }
        }
        
        // Centralizar imagem
        const x = (maxSize - width) / 2
        const y = (maxSize - height) / 2
        
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, maxSize, maxSize)
        ctx.drawImage(img, x, y, width, height)
        
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

export function getVehicleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    car: 'Carro',
    motorcycle: 'Moto',
    truck: 'Caminhão',
    van: 'Van',
    suv: 'SUV',
  }
  return labels[type] || type
}

export function getIPVAStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    paid: 'Pago',
    pending: 'Pendente',
    overdue: 'Atrasado',
  }
  return labels[status] || status
}

export function getIPVAStatusColor(status: string): string {
  const colors: Record<string, string> = {
    paid: 'text-green-600',
    pending: 'text-yellow-600',
    overdue: 'text-red-600',
  }
  return colors[status] || 'text-gray-600'
}

export function calculateDaysUntil(dateString: string): number {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  
  const diffTime = date.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function isOverdue(dateString: string): boolean {
  return calculateDaysUntil(dateString) < 0
}

export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function importFromJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(new Error('Arquivo JSON inválido'))
      }
    }
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsText(file)
  })
}

// Backup schema for validating imported JSON backups
const backupSchema = z.object({
  users: z.array(userSchema).optional(),
  vehicles: z.array(vehicleSchema).optional(),
  maintenances: z.array(maintenanceSchema).optional(),
  ipvas: z.array(ipvaSchema).optional(),
  categories: z.array(categorySchema).optional(),
  settings: settingsSchema.optional(),
})

export async function importBackup(file: File) {
  const text = await file.text()
  try {
    const parsed = JSON.parse(text)
    const result = backupSchema.safeParse(parsed)
    if (!result.success) {
      const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      throw new Error('Arquivo inválido: ' + issues.join('; '))
    }
    return { ok: true, data: result.data }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Erro ao importar backup' }
  }
}

export function exportBackup(data: any, filename = 'carcare-backup.json') {
  // Optionally validate before exporting
  try {
    const safe = backupSchema.parse({
      users: data.users,
      vehicles: data.vehicles,
      maintenances: data.maintenances,
      ipvas: data.ipvas,
      categories: data.categories,
      settings: data.settings,
    })
    exportToJSON(safe, filename)
  } catch (err) {
    // If validation fails, still export raw data but flag in filename
    exportToJSON(data, `INVALID-${filename}`)
  }
}
