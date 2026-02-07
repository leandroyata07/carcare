// Default categories for new users
export const DEFAULT_CATEGORIES = [
  { name: 'Troca de óleo', color: '#10b981', icon: 'Droplet' },
  { name: 'Filtros', color: '#3b82f6', icon: 'Filter' },
  { name: 'Freios', color: '#ef4444', icon: 'CircleStop' },
  { name: 'Pneus', color: '#8b5cf6', icon: 'Circle' },
  { name: 'Suspensão', color: '#f59e0b', icon: 'Car' },
  { name: 'Bateria', color: '#06b6d4', icon: 'Battery' },
  { name: 'Ar Condicionado', color: '#14b8a6', icon: 'Wind' },
  { name: 'Motor', color: '#dc2626', icon: 'Gauge' },
  { name: 'Transmissão', color: '#7c3aed', icon: 'Settings' },
  { name: 'Sistema Elétrico', color: '#eab308', icon: 'Zap' },
  { name: 'Limpeza', color: '#22c55e', icon: 'Sparkles' },
  { name: 'Outros', color: '#64748b', icon: 'Wrench' },
]

// Default admin user
export const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // In production, this should be hashed
  name: 'Administrador',
  email: 'admin@carcare.com',
  role: 'admin' as const,
  mustChangePassword: true,
}

// Default settings
export const DEFAULT_SETTINGS = {
  darkMode: false,
  notificationsEnabled: true,
  maintenanceAlertDistance: 500, // km
  ipvaAlertDays: 30, // days
}

// Vehicle types
export const VEHICLE_TYPES = [
  { value: 'car', label: 'Carro', icon: 'Car' },
  { value: 'motorcycle', label: 'Moto', icon: 'Bike' },
  { value: 'truck', label: 'Caminhão', icon: 'Truck' },
  { value: 'van', label: 'Van', icon: 'Bus' },
  { value: 'suv', label: 'SUV', icon: 'Car' },
]

// User roles
export const USER_ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuário' },
]

// IPVA status
export const IPVA_STATUS = [
  { value: 'paid', label: 'Pago', color: 'bg-green-100 text-green-800' },
  { value: 'pending', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'overdue', label: 'Atrasado', color: 'bg-red-100 text-red-800' },
]
