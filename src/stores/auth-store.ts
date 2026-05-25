import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, UserForm } from '@/lib/schemas'
import { generateUUID } from '@/lib/utils'
import { DEFAULT_ADMIN } from '@/lib/constants'

interface AuthState {
  currentUser: User | null
  users: User[]
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  register: (data: UserForm) => User
  addUser: (data: UserForm) => User
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  changePassword: (id: string, newPassword: string) => void
  initializeDefaultUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isAuthenticated: false,

      initializeDefaultUser: () => {
        const { users } = get()
        if (users.length === 0) {
          const now = new Date().toISOString()
          const defaultUser: User = {
            id: generateUUID(),
            ...DEFAULT_ADMIN,
            createdAt: now,
            updatedAt: now,
          }
          set({ users: [defaultUser] })
        }
      },

      login: (username: string, password: string) => {
        const { users } = get()
        const user = users.find(
          (u) => u.username === username && u.password === password
        )
        
        if (user) {
          set({ currentUser: user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false })
      },

      register: (data: UserForm) => {
        const { users } = get()
        const now = new Date().toISOString()
        
        // Check if username already exists
        if (users.some((u) => u.username === data.username)) {
          throw new Error('Usuário já existe')
        }
        
        const newUser: User = {
          id: generateUUID(),
          ...data,
          createdAt: now,
          updatedAt: now,
        }
        
        set({ users: [...users, newUser] })
        return newUser
      },

      addUser: (data: UserForm) => {
        const { users } = get()
        const now = new Date().toISOString()
        
        // Check if username already exists
        if (users.some((u) => u.username === data.username)) {
          throw new Error('Usuário já existe')
        }
        
        const newUser: User = {
          id: generateUUID(),
          ...data,
          createdAt: now,
          updatedAt: now,
        }
        
        set({ users: [...users, newUser] })
        return newUser
      },

      updateUser: (id: string, data: Partial<User>) => {
        const { users, currentUser } = get()
        const now = new Date().toISOString()
        
        const updatedUsers = users.map((user) =>
          user.id === id
            ? { ...user, ...data, updatedAt: now }
            : user
        )
        
        set({ 
          users: updatedUsers,
          currentUser: currentUser?.id === id 
            ? { ...currentUser, ...data, updatedAt: now }
            : currentUser
        })
      },

      deleteUser: (id: string) => {
        const { users, currentUser } = get()
        
        // Prevent deleting the current user
        if (currentUser?.id === id) {
          throw new Error('Não é possível excluir o usuário atual')
        }
        
        // Prevent deleting the last admin
        const admins = users.filter((u) => u.role === 'admin')
        const userToDelete = users.find((u) => u.id === id)
        
        if (userToDelete?.role === 'admin' && admins.length === 1) {
          throw new Error('Não é possível excluir o último administrador')
        }
        
        set({ users: users.filter((u) => u.id !== id) })
      },

      changePassword: (id: string, newPassword: string) => {
        const { users, currentUser } = get()
        const now = new Date().toISOString()
        
        const updatedUsers = users.map((user) =>
          user.id === id
            ? { ...user, password: newPassword, updatedAt: now }
            : user
        )
        
        set({ 
          users: updatedUsers,
          currentUser: currentUser?.id === id 
            ? { ...currentUser, password: newPassword, updatedAt: now }
            : currentUser
        })
      },
    }),
    {
      name: 'carcare-auth',
    }
  )
)
