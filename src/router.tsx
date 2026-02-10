import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router'
import { RootLayout } from '@/components/layouts/root-layout'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { LoginPage } from '@/pages/login'
import { DashboardPage } from '@/pages/dashboard'
import { VehiclesPage } from '@/pages/vehicles'
import { MaintenancesPage } from '@/pages/maintenances'
import { IPVAPage } from '@/pages/ipva'
import { CategoriesPage } from '@/pages/categories'
import { UsersPage } from '@/pages/users'
import { SettingsPage } from '@/pages/settings'
import { HelpPage } from '@/pages/help'
import { AboutPage } from '@/pages/about'
import { ReportsPage } from '@/pages/reports'
import { NotificationsPage } from '@/pages/notifications'
import { useAuthStore } from '@/stores/auth-store'

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    // Se não estiver autenticado e tentar acessar a raiz, redireciona para login
    if (!isAuthenticated && window.location.pathname === '/') {
      throw redirect({ to: '/login' })
    }
  },
})

// Auth layout route
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
})

// Login route
const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
})

// Dashboard layout route (protected)
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard',
  component: DashboardLayout,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
})

// Dashboard routes
const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/',
  component: DashboardPage,
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
})

const vehiclesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/vehicles',
  component: VehiclesPage,
})

const maintenancesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/maintenances',
  component: MaintenancesPage,
})

const ipvaRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/ipva',
  component: IPVAPage,
})

const categoriesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/categories',
  component: CategoriesPage,
})

const usersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/users',
  component: UsersPage,
  beforeLoad: () => {
    const { currentUser } = useAuthStore.getState()
    if (currentUser?.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
})

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})

const helpRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/help',
  component: HelpPage,
})

const aboutRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/about',
  component: AboutPage,
})

const reportsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/reports',
  component: ReportsPage,
})

const notificationsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/notifications',
  component: NotificationsPage,
})

// Build route tree
const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([loginRoute]),
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    vehiclesRoute,
    maintenancesRoute,
    ipvaRoute,
    categoriesRoute,
    usersRoute,
    settingsRoute,
    reportsRoute,
    notificationsRoute,
    helpRoute,
    aboutRoute,
  ]),
])

// Create router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  basepath: '/carcare',
})

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
