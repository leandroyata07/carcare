import { Outlet, Link, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { 
  Car, 
  Wrench, 
  FileText, 
  Settings, 
  Users, 
  Grid, 
  LogOut,
  Moon,
  Sun,
  User,
  Menu,
  X,
  BookOpen,
  MessageCircle,
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useSettingsStore } from '@/stores/settings-store'
import { Button } from '@/components/ui/button'
import { NotificationsPanel } from '@/components/ui/notifications-panel'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { currentUser, logout } = useAuthStore()
  const { settings, toggleDarkMode } = useSettingsStore()
  const router = useRouterState()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Gerencia o botão "voltar" do navegador para fechar o menu mobile
  useEffect(() => {
    const handlePopState = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      // Adiciona um estado ao histórico quando o menu abre
      window.history.pushState({ mobileMenu: true }, '')
      window.addEventListener('popstate', handlePopState)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [mobileMenuOpen])

  // Fecha o menu ao navegar para outra rota
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [router.location.pathname])

  const navItems = [
    { to: '/', icon: Grid, label: 'Dashboard' },
    { to: '/vehicles', icon: Car, label: 'Veículos' },
    { to: '/maintenances', icon: Wrench, label: 'Manutenções' },
    { to: '/ipva', icon: FileText, label: 'IPVA' },
    { to: '/categories', icon: Grid, label: 'Categorias' },
    { to: '/reports', icon: BarChart3, label: 'Relatórios' },
  ]

  if (currentUser?.role === 'admin') {
    navItems.push({ to: '/users', icon: Users, label: 'Usuários' })
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>

              <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CarCare
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
              >
                {settings.darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Notifications */}
              <NotificationsPanel />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>{currentUser?.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {currentUser?.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/help" className="cursor-pointer">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Manual do Usuário
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about" className="cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Fale Conosco
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = router.location.pathname === item.to
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Mobile Menu */}
          <>
            {/* Backdrop */}
            <div
              className={cn(
                "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ease-in-out",
                mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile sidebar */}
            <aside
              className={cn(
                "fixed top-16 left-0 bottom-0 w-72 bg-white dark:bg-gray-800 z-50 lg:hidden shadow-2xl overflow-y-auto",
                "transition-transform duration-300 ease-out",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <nav className="p-4 space-y-1">
                {navItems.map((item, index) => {
                  const isActive = router.location.pathname === item.to
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                        'transform hover:scale-[1.02] active:scale-[0.98]',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                      style={{
                        transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                        opacity: mobileMenuOpen ? 1 : 0,
                        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)'
                      }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </aside>
          </>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
