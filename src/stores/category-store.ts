import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Category, CategoryForm } from '@/lib/schemas'
import { generateUUID } from '@/lib/utils'
import { DEFAULT_CATEGORIES } from '@/lib/constants'

interface CategoryState {
  categories: Category[]
  initializeDefaultCategories: (userId: string) => void
  addCategory: (data: CategoryForm, userId: string) => Category
  updateCategory: (id: string, data: Partial<CategoryForm>) => void
  deleteCategory: (id: string) => void
  getUserCategories: (userId: string) => Category[]
  getCategoryById: (id: string) => Category | null
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],

      initializeDefaultCategories: (userId: string) => {
        const { categories } = get()
        const userCategories = categories.filter((c) => c.userId === userId)
        
        if (userCategories.length === 0) {
          const now = new Date().toISOString()
          const defaultCategories = DEFAULT_CATEGORIES.map((cat) => ({
            id: generateUUID(),
            ...cat,
            userId,
            createdAt: now,
          }))
          
          set({ categories: [...categories, ...defaultCategories] })
        }
      },

      addCategory: (data: CategoryForm, userId: string) => {
        const now = new Date().toISOString()
        const newCategory: Category = {
          id: generateUUID(),
          ...data,
          userId,
          createdAt: now,
        }
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
        
        return newCategory
      },

      updateCategory: (id: string, data: Partial<CategoryForm>) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...data }
              : category
          ),
        }))
      },

      deleteCategory: (id: string) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },

      getUserCategories: (userId: string) => {
        return get().categories.filter((c) => c.userId === userId)
      },

      getCategoryById: (id: string) => {
        return get().categories.find((c) => c.id === id) || null
      },
    }),
    {
      name: 'carcare-categories',
    }
  )
)
