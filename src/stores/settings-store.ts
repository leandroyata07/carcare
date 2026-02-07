import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Settings } from '@/lib/schemas'
import { DEFAULT_SETTINGS } from '@/lib/constants'

interface SettingsState {
  settings: Settings
  updateSettings: (data: Partial<Settings>) => void
  toggleDarkMode: () => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (data: Partial<Settings>) => {
        set((state) => ({
          settings: { ...state.settings, ...data },
        }))
      },

      toggleDarkMode: () => {
        set((state) => ({
          settings: { ...state.settings, darkMode: !state.settings.darkMode },
        }))
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS })
      },
    }),
    {
      name: 'carcare-settings',
    }
  )
)
