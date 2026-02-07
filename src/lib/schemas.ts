import { z } from 'zod'

// ============================================
// ENUMS
// ============================================

export const VehicleTypeEnum = z.enum(['car', 'motorcycle', 'truck', 'van', 'suv'])
export type VehicleType = z.infer<typeof VehicleTypeEnum>

export const UserRoleEnum = z.enum(['admin', 'user'])
export type UserRole = z.infer<typeof UserRoleEnum>

export const IPVAStatusEnum = z.enum(['paid', 'pending', 'overdue'])
export type IPVAStatus = z.infer<typeof IPVAStatusEnum>

export const IPVATypeEnum = z.enum(['IPVA', 'Licensing', 'Both'])
export type IPVAType = z.infer<typeof IPVATypeEnum>

// ============================================
// USER SCHEMAS
// ============================================

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido').optional(),
  role: UserRoleEnum,
  mustChangePassword: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const userFormSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  role: UserRoleEnum,
})

export const loginSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type User = z.infer<typeof userSchema>
export type UserForm = z.infer<typeof userFormSchema>
export type LoginForm = z.infer<typeof loginSchema>

// ============================================
// VEHICLE SCHEMAS
// ============================================

export const vehicleSchema = z.object({
  id: z.string().uuid(),
  type: VehicleTypeEnum,
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres'),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres'),
  year: z.number()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano não pode ser no futuro'),
  plate: z.string()
    .regex(/^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, 'Placa inválida (ABC-1234 ou ABC1D23)'),
  color: z.string().optional(),
  mileage: z.number().min(0, 'Quilometragem não pode ser negativa'),
  fuelType: z.enum(['Gasoline', 'Ethanol', 'Diesel', 'Flex', 'Electric', 'Hybrid']).default('Gasoline'),
  chassisNumber: z.string().optional(),
  renavam: z.string().optional(),
  engineNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseValue: z.number().min(0).optional(),
  insuranceCompany: z.string().optional(),
  insurancePolicy: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  notes: z.string().optional(),
  photo: z.string().optional(), // base64
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const vehicleFormSchema = z.object({
  type: VehicleTypeEnum,
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres'),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres'),
  year: z.number()
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano não pode ser no futuro'),
  plate: z.string()
    .regex(/^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, 'Placa inválida (ABC-1234 ou ABC1D23)'),
  color: z.string().optional().or(z.literal('')),
  mileage: z.number().min(0, 'Quilometragem não pode ser negativa'),
  fuelType: z.enum(['Gasoline', 'Ethanol', 'Diesel', 'Flex', 'Electric', 'Hybrid']).default('Gasoline'),
  chassisNumber: z.string().optional().or(z.literal('')),
  renavam: z.string().optional().or(z.literal('')),
  engineNumber: z.string().optional().or(z.literal('')),
  purchaseDate: z.string().optional().or(z.literal('')),
  purchaseValue: z.number().min(0).optional().or(z.literal('')),
  insuranceCompany: z.string().optional().or(z.literal('')),
  insurancePolicy: z.string().optional().or(z.literal('')),
  insuranceExpiry: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  photo: z.string().optional(),
})

export type Vehicle = z.infer<typeof vehicleSchema>
export type VehicleForm = z.infer<typeof vehicleFormSchema>

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (formato: #RRGGBB)'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
})

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (formato: #RRGGBB)'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
})

export type Category = z.infer<typeof categorySchema>
export type CategoryForm = z.infer<typeof categoryFormSchema>

// ============================================
// MAINTENANCE SCHEMAS
// ============================================

export const maintenanceSchema = z.object({
  id: z.string().uuid(),
  vehicleId: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: z.string().min(2, 'Tipo de serviço deve ter no mínimo 2 caracteres'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: YYYY-MM-DD)'),
  mileage: z.number().min(0, 'Quilometragem não pode ser negativa'),
  description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
  location: z.string().min(2, 'Local deve ter no mínimo 2 caracteres'),
  value: z.number().min(0, 'Valor não pode ser negativo'),
  nextChange: z.number().min(0, 'Próxima troca não pode ser negativa').optional(),
  photo: z.string().optional(), // base64
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const maintenanceFormSchema = z.object({
  categoryId: z.string().uuid('Categoria é obrigatória'),
  type: z.string().min(2, 'Tipo de serviço deve ter no mínimo 2 caracteres'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: YYYY-MM-DD)'),
  mileage: z.number().min(0, 'Quilometragem não pode ser negativa'),
  description: z.string().min(5, 'Descrição deve ter no mínimo 5 caracteres'),
  location: z.string().min(2, 'Local deve ter no mínimo 2 caracteres'),
  value: z.number().min(0, 'Valor não pode ser negativo'),
  nextChange: z.number().min(0, 'Próxima troca não pode ser negativa').optional().or(z.literal('')),
  photo: z.string().optional(),
})

export type Maintenance = z.infer<typeof maintenanceSchema>
export type MaintenanceForm = z.infer<typeof maintenanceFormSchema>

// ============================================
// IPVA SCHEMAS
// ============================================

export const ipvaSchema = z.object({
  id: z.string().uuid(),
  vehicleId: z.string().uuid(),
  year: z.number().min(2020, 'Ano deve ser 2020 ou posterior'),
  type: IPVATypeEnum,
  ipvaValue: z.number().min(0, 'Valor do IPVA não pode ser negativo'),
  licensingValue: z.number().min(0, 'Valor do licenciamento não pode ser negativo'),
  totalValue: z.number().min(0, 'Valor total não pode ser negativo'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: YYYY-MM-DD)'),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: YYYY-MM-DD)').optional(),
  status: IPVAStatusEnum,
  paymentLocation: z.string().optional(),
  paymentMethod: z.string().optional(),
  receiptNumber: z.string().optional(),
  installments: z.number().min(1).max(12).default(1),
  currentInstallment: z.number().min(1).max(12).default(1),
  notes: z.string().optional(),
  documents: z.array(z.string()).optional(), // Array de base64 strings
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ipvaFormSchema = z.object({
  year: z.number().min(2020, 'Ano deve ser 2020 ou posterior'),
  type: IPVATypeEnum,
  ipvaValue: z.number().min(0, 'Valor do IPVA não pode ser negativo'),
  licensingValue: z.number().min(0, 'Valor do licenciamento não pode ser negativo'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: YYYY-MM-DD)'),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').optional().or(z.literal('')),
  status: IPVAStatusEnum,
  paymentLocation: z.string().optional().or(z.literal('')),
  paymentMethod: z.string().optional().or(z.literal('')),
  receiptNumber: z.string().optional().or(z.literal('')),
  installments: z.number().min(1).max(12).default(1),
  currentInstallment: z.number().min(1).max(12).default(1),
  notes: z.string().optional().or(z.literal('')),
  documents: z.array(z.string()).optional(),
})

export type IPVA = z.infer<typeof ipvaSchema>
export type IPVAForm = z.infer<typeof ipvaFormSchema>

// ============================================
// SETTINGS SCHEMA
// ============================================

export const settingsSchema = z.object({
  darkMode: z.boolean(),
  notificationsEnabled: z.boolean(),
  maintenanceAlertDistance: z.number().min(100).max(1000),
  ipvaAlertDays: z.number().min(7).max(60),
})

export type Settings = z.infer<typeof settingsSchema>
