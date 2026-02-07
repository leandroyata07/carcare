import { Car, Wrench, DollarSign, Plus, BarChart3, TrendingUp, Activity } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useCategoryStore } from '@/stores/category-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { formatCurrency, formatDate, formatMileage } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'

export function DashboardPage() {
  const { currentUser } = useAuthStore()
  const { getCurrentVehicle, getUserVehicles } = useVehicleStore()
  const { getVehicleMaintenances } = useMaintenanceStore()
  const { getVehicleIPVAs } = useIPVAStore()
  const { getUserCategories, initializeDefaultCategories } = useCategoryStore()

  const currentVehicle = getCurrentVehicle()
  const userVehicles = currentUser ? getUserVehicles(currentUser.id) : []
  const maintenances = currentVehicle ? getVehicleMaintenances(currentVehicle.id) : []
  const ipvas = currentVehicle ? getVehicleIPVAs(currentVehicle.id) : []
  const categories = currentUser ? getUserCategories(currentUser.id) : []

  useEffect(() => {
    if (currentUser && categories.length === 0) {
      initializeDefaultCategories(currentUser.id)
    }
  }, [currentUser, categories.length, initializeDefaultCategories])

  // Statistics
  const totalSpent = maintenances.reduce((sum, m) => sum + m.value, 0)
  const avgPerKm = currentVehicle && currentVehicle.mileage > 0
    ? totalSpent / currentVehicle.mileage
    : 0
  const lastMaintenance = maintenances[0]
  const totalIPVASpent = ipvas.reduce((sum, i) => sum + i.ipvaValue + i.licensingValue, 0)

  // Advanced Statistics
  const categoryStats = categories.map(cat => {
    const categoryMaintenances = maintenances.filter(m => m.categoryId === cat.id)
    const totalValue = categoryMaintenances.reduce((sum, m) => sum + m.value, 0)
    return {
      category: cat,
      count: categoryMaintenances.length,
      totalValue,
    }
  }).filter(stat => stat.count > 0).sort((a, b) => b.totalValue - a.totalValue)

  // Last 6 months statistics
  const monthlyStats = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const monthMaintenances = maintenances.filter(m => {
      const mDate = new Date(m.date)
      return mDate.getFullYear() === year && mDate.getMonth() === month
    })
    
    return {
      month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      count: monthMaintenances.length,
      value: monthMaintenances.reduce((sum, m) => sum + m.value, 0),
    }
  }).reverse()

  const totalMaintenance = maintenances.length
  const averageMaintenanceValue = totalMaintenance > 0 ? totalSpent / totalMaintenance : 0

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Visão geral completa do seu veículo e manutenções
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Veículos"
          value={userVehicles.length}
          subtitle={userVehicles.length === 1 ? 'veículo cadastrado' : 'veículos cadastrados'}
          icon={Car}
          colorScheme="blue"
        />
        
        <StatCard
          title="Manutenções"
          value={maintenances.length}
          subtitle={maintenances.length === 1 ? 'serviço realizado' : 'serviços realizados'}
          icon={Wrench}
          colorScheme="orange"
        />

        <StatCard
          title="Total Gasto"
          value={formatCurrency(totalSpent)}
          subtitle="em manutenções"
          icon={DollarSign}
          colorScheme="green"
        />

        <StatCard
          title="Custo por Km"
          value={formatCurrency(avgPerKm)}
          subtitle="média por quilômetro"
          icon={TrendingUp}
          colorScheme="purple"
        />
      </div>

      {/* Current Vehicle */}
      {currentVehicle ? (
        <Card className="card-hover glass-effect border-2 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="h-6 w-6" />
                <CardTitle className="text-2xl">Veículo Atual</CardTitle>
              </div>
              <Badge variant="success" className="text-sm">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Modelo</p>
                <p className="text-xl font-bold text-foreground">
                  {currentVehicle.brand} {currentVehicle.model}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Ano</p>
                <p className="text-xl font-bold text-foreground">{currentVehicle.year}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Placa</p>
                <p className="text-xl font-bold text-foreground">{currentVehicle.plate}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Quilometragem</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatMileage(currentVehicle.mileage)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Última Manutenção</p>
                <p className="text-xl font-bold text-orange-600">
                  {lastMaintenance ? formatDate(lastMaintenance.date) : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total IPVA Pago</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalIPVASpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-hover border-2 border-dashed">
          <CardContent className="py-16">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 bg-muted rounded-full">
                  <Car className="h-20 w-20 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Nenhum veículo cadastrado</h3>
                <p className="text-muted-foreground text-lg">
                  Comece adicionando seu primeiro veículo para começar a rastrear as manutenções
                </p>
              </div>
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link to="/vehicles">
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Veículo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Maintenances */}
      {maintenances.length > 0 && (
        <Card className="card-hover border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-b-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-xl text-orange-900 dark:text-orange-100">
                  Últimas Manutenções
                </CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild className="hover:bg-orange-100 dark:hover:bg-orange-900/40">
                <Link to="/maintenances">Ver todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {maintenances.slice(0, 5).map((maintenance, index) => (
                <div
                  key={maintenance.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all animate-slideIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                      <Wrench className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{maintenance.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(maintenance.date)} • {formatMileage(maintenance.mileage)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold text-green-600">{formatCurrency(maintenance.value)}</p>
                    <p className="text-sm text-muted-foreground">{maintenance.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Statistics */}
      {categoryStats.length > 0 && (
        <Card className="card-hover border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-b-2 border-purple-200 dark:border-purple-800">
            <CardTitle className="text-xl text-purple-900 dark:text-purple-100">Gastos por Categoria</CardTitle>
            <CardDescription className="text-purple-600/70">Distribuição dos gastos entre as categorias de manutenção</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {categoryStats.map((stat, index) => {
                const percentage = totalSpent > 0 ? (stat.totalValue / totalSpent) * 100 : 0
                return (
                  <div 
                    key={stat.category.id} 
                    className="space-y-3 p-4 rounded-lg border border-border hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all animate-slideIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-md"
                          style={{ backgroundColor: stat.category.color }}
                        />
                        <span className="font-semibold text-lg">{stat.category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {stat.count} {stat.count === 1 ? 'manutenção' : 'manutenções'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-600">{formatCurrency(stat.totalValue)}</div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {percentage.toFixed(1)}% do total
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-3"
                      style={{
                        // @ts-ignore
                        '--progress-background': stat.category.color,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Statistics */}
      {monthlyStats.length > 0 && monthlyStats.some(m => m.count > 0) && (
        <Card className="card-hover border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-b-2 border-green-200 dark:border-green-800">
            <CardTitle className="text-xl text-green-900 dark:text-green-100">Gastos nos Últimos 6 Meses</CardTitle>
            <CardDescription className="text-green-600/70">Evolução dos gastos com manutenção</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border-2 border-blue-200 dark:border-blue-800 card-hover">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-3xl font-bold text-blue-600">{totalMaintenance}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Total de Manutenções</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border-2 border-green-200 dark:border-green-800 card-hover">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Gasto Total</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl border-2 border-purple-200 dark:border-purple-800 card-hover">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(averageMaintenanceValue)}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Média por Manutenção</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {monthlyStats.map((stat, index) => {
                  const maxValue = Math.max(...monthlyStats.map(s => s.value))
                  const barWidth = maxValue > 0 ? (stat.value / maxValue) * 100 : 0
                  return (
                    <div 
                      key={stat.month} 
                      className="space-y-2 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-all animate-slideIn"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold uppercase tracking-wider">{stat.month}</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(stat.value)}</div>
                          <div className="text-xs text-muted-foreground">
                            {stat.count} {stat.count === 1 ? 'manutenção' : 'manutenções'}
                          </div>
                        </div>
                      </div>
                      <Progress value={barWidth} className="h-3" />
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports Quick Access */}
      {maintenances.length > 0 && (
        <Card className="card-hover border-2 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <BarChart3 className="h-12 w-12" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-2">
                    Relatórios Personalizados
                  </h3>
                  <p className="text-indigo-100 text-lg">
                    Gere relatórios detalhados com filtros por data, veículo, categoria e muito mais
                  </p>
                </div>
              </div>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold px-8"
              >
                <Link to="/reports">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Gerar Relatório
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
