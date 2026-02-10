import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReadNotification {
  id: string
  readAt: string
}

interface NotificationState {
  readNotifications: ReadNotification[]
  markAsRead: (notificationId: string) => void
  markAllAsRead: (notificationIds: string[]) => void
  isRead: (notificationId: string) => boolean
  clearOldNotifications: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      readNotifications: [],

      markAsRead: (notificationId: string) => {
        const { readNotifications } = get()
        if (!readNotifications.find(n => n.id === notificationId)) {
          set({
            readNotifications: [
              ...readNotifications,
              { id: notificationId, readAt: new Date().toISOString() }
            ]
          })
        }
      },

      markAllAsRead: (notificationIds: string[]) => {
        const { readNotifications } = get()
        const now = new Date().toISOString()
        const newReadNotifications = notificationIds
          .filter(id => !readNotifications.find(n => n.id === id))
          .map(id => ({ id, readAt: now }))
        
        set({
          readNotifications: [...readNotifications, ...newReadNotifications]
        })
      },

      isRead: (notificationId: string) => {
        return get().readNotifications.some(n => n.id === notificationId)
      },

      clearOldNotifications: () => {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        set((state) => ({
          readNotifications: state.readNotifications.filter(
            n => new Date(n.readAt) > thirtyDaysAgo
          )
        }))
      },
    }),
    {
      name: 'carcare-notifications',
    }
  )
)
