import { useState, useMemo, useRef } from 'react'
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Car, 
  Wrench, 
  MapPin, 
  DollarSign, 
  Gauge,
  Printer,
  X
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useCategoryStore } from '@/stores/category-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { formatCurrency, formatDate, formatMileage } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Filters {
  vehicleId: string
  categoryId: string
  startDate: string
  endDate: string
  location: string
  minValue: string
  maxValue: string
  minMileage: string
  maxMileage: string
  type: string
}

export function ReportsPage() {
  const { currentUser } = useAuthStore()
  const { getUserVehicles } = useVehicleStore()
  const { getUserCategories } = useCategoryStore()
  const { maintenances } = useMaintenanceStore()
  const reportRef = useRef<HTMLDivElement>(null)

  const userVehicles = currentUser ? getUserVehicles(currentUser.id) : []
  const userCategories = currentUser ? getUserCategories(currentUser.id) : []
  const userMaintenances = currentUser 
    ? maintenances.filter(m => m.userId === currentUser.id)
    : []

  const [filters, setFilters] = useState<Filters>({
    vehicleId: 'all',
    categoryId: 'all',
    startDate: '',
    endDate: '',
    location: '',
    minValue: '',
    maxValue: '',
    minMileage: '',
    maxMileage: '',
    type: ''
  })

  const [showFilters, setShowFilters] = useState(true)

  // Filtrar manutenções
  const filteredMaintenances = useMemo(() => {
    return userMaintenances.filter(maintenance => {
      // Filtro por veículo
      if (filters.vehicleId !== 'all' && maintenance.vehicleId !== filters.vehicleId) {
        return false
      }

      // Filtro por categoria
      if (filters.categoryId !== 'all' && maintenance.categoryId !== filters.categoryId) {
        return false
      }

      // Filtro por data início
      if (filters.startDate && maintenance.date < filters.startDate) {
        return false
      }

      // Filtro por data fim
      if (filters.endDate && maintenance.date > filters.endDate) {
        return false
      }

      // Filtro por local/oficina
      if (filters.location && !maintenance.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Filtro por tipo de serviço
      if (filters.type && !maintenance.type.toLowerCase().includes(filters.type.toLowerCase())) {
        return false
      }

      // Filtro por valor mínimo
      if (filters.minValue && maintenance.value < parseFloat(filters.minValue)) {
        return false
      }

      // Filtro por valor máximo
      if (filters.maxValue && maintenance.value > parseFloat(filters.maxValue)) {
        return false
      }

      // Filtro por quilometragem mínima
      if (filters.minMileage && maintenance.mileage < parseFloat(filters.minMileage)) {
        return false
      }

      // Filtro por quilometragem máxima
      if (filters.maxMileage && maintenance.mileage > parseFloat(filters.maxMileage)) {
        return false
      }

      return true
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [userMaintenances, filters])

  // Estatísticas do relatório
  const stats = useMemo(() => {
    const totalValue = filteredMaintenances.reduce((sum, m) => sum + m.value, 0)
    const avgValue = filteredMaintenances.length > 0 ? totalValue / filteredMaintenances.length : 0
    const totalMileage = filteredMaintenances.length > 0
      ? Math.max(...filteredMaintenances.map(m => m.mileage)) - Math.min(...filteredMaintenances.map(m => m.mileage))
      : 0
    const costPerKm = totalMileage > 0 ? totalValue / totalMileage : 0

    return {
      count: filteredMaintenances.length,
      totalValue,
      avgValue,
      totalMileage,
      costPerKm
    }
  }, [filteredMaintenances])

  // Agrupar por categoria
  const categoryStats = useMemo(() => {
    const grouped = filteredMaintenances.reduce((acc, maintenance) => {
      const categoryId = maintenance.categoryId
      if (!acc[categoryId]) {
        acc[categoryId] = {
          count: 0,
          totalValue: 0
        }
      }
      acc[categoryId].count++
      acc[categoryId].totalValue += maintenance.value
      return acc
    }, {} as Record<string, { count: number; totalValue: number }>)

    return Object.entries(grouped).map(([categoryId, data]) => {
      const category = userCategories.find(c => c.id === categoryId)
      return {
        categoryId,
        categoryName: category?.name || 'Categoria desconhecida',
        categoryColor: category?.color || '#999999',
        ...data
      }
    }).sort((a, b) => b.totalValue - a.totalValue)
  }, [filteredMaintenances, userCategories])

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      vehicleId: 'all',
      categoryId: 'all',
      startDate: '',
      endDate: '',
      location: '',
      minValue: '',
      maxValue: '',
      minMileage: '',
      maxMileage: '',
      type: ''
    })
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'vehicleId' || key === 'categoryId') return value !== 'all'
    return value !== ''
  })

  // Exportar para PDF
  const exportToPDF = async () => {
    if (!reportRef.current) return

    try {
      // Ocultar botões antes de capturar
      setShowFilters(false)
      
      // Aguardar um pouco para a UI atualizar
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      const fileName = `relatorio-manutencoes-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      // Restaurar visibilidade dos filtros
      setShowFilters(true)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      setShowFilters(true)
    }
  }

  // Imprimir
  const printReport = () => {
    window.print()
  }

  const getVehicleName = (vehicleId: string) => {
    const vehicle = userVehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}` : 'Veículo desconhecido'
  }

  const getCategoryName = (categoryId: string) => {
    const category = userCategories.find(c => c.id === categoryId)
    return category?.name || 'Categoria desconhecida'
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Relatórios
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Gere relatórios personalizados de manutenções
          </p>
        </div>

        <div className="flex gap-2 print:hidden flex-shrink-0">
          <Button onClick={printReport} variant="outline" size="sm" className="flex-1 sm:flex-initial">
            <Printer className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          <Button onClick={exportToPDF} size="sm" className="flex-1 sm:flex-initial">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="print:hidden bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100 text-lg sm:text-xl">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                  Filtros
                </CardTitle>
                <CardDescription className="text-purple-600/70 text-sm">
                  Personalize seu relatório com os filtros abaixo
                </CardDescription>
              </div>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" size="sm" className="w-full sm:w-auto">
                  <X className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Filtro por Veículo */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Veículo</span>
                </Label>
                <Select
                  value={filters.vehicleId}
                  onValueChange={(value) => setFilters({ ...filters, vehicleId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os veículos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os veículos</SelectItem>
                    {userVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} - {vehicle.plate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Categoria */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <Wrench className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Categoria</span>
                </Label>
                <Select
                  value={filters.categoryId}
                  onValueChange={(value) => setFilters({ ...filters, categoryId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {userCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Tipo de Serviço */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Tipo de Serviço</span>
                </Label>
                <Input
                  className="w-full"
                  placeholder="Ex: Troca de óleo"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                />
              </div>

              {/* Filtro por Data Início */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Data Início</span>
                </Label>
                <Input
                  className="w-full"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>

              {/* Filtro por Data Fim */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Data Fim</span>
                </Label>
                <Input
                  className="w-full"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>

              {/* Filtro por Local/Oficina */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Local/Oficina</span>
                </Label>
                <Input
                  className="w-full"
                  placeholder="Ex: Oficina do João"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>

              {/* Filtro por Valor Mínimo */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Valor Mínimo</span>
                </Label>
                <Input
                  className="w-full"
                  type="number"
                  placeholder="R$ 0,00"
                  value={filters.minValue}
                  onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Filtro por Valor Máximo */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Valor Máximo</span>
                </Label>
                <Input
                  className="w-full"
                  type="number"
                  placeholder="R$ 9999,99"
                  value={filters.maxValue}
                  onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Filtro por Quilometragem Mínima */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <Gauge className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>KM Mínimo</span>
                </Label>
                <Input
                  className="w-full"
                  type="number"
                  placeholder="0 km"
                  value={filters.minMileage}
                  onChange={(e) => setFilters({ ...filters, minMileage: e.target.value })}
                  min="0"
                />
              </div>

              {/* Filtro por Quilometragem Máxima */}
              <div className="space-y-2 min-w-0">
                <Label className="flex items-center gap-2 text-sm">
                  <Gauge className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>KM Máximo</span>
                </Label>
                <Input
                  className="w-full"
                  type="number"
                  placeholder="999999 km"
                  value={filters.maxMileage}
                  onChange={(e) => setFilters({ ...filters, maxMileage: e.target.value })}
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório */}
      <div ref={reportRef} className="space-y-6">
        {/* Cabeçalho do Relatório (visível na impressão) */}
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-2xl font-bold">CarCare - Relatório de Manutenções</h1>
          <p className="text-sm text-gray-600">
            Gerado em {formatDate(new Date().toISOString().split('T')[0])}
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100">
                Total de Manutenções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.count}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-100">
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-orange-900 dark:text-orange-100">
                Valor Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{formatCurrency(stats.avgValue)}</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-100">
                KM Percorridos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{formatMileage(stats.totalMileage)}</div>
            </CardContent>
          </Card>

          <Card className="bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-pink-900 dark:text-pink-100">
                Custo por KM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-pink-600">{formatCurrency(stats.costPerKm)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Gastos por Categoria */}
        {categoryStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((stat) => {
                  const percentage = stats.totalValue > 0 ? (stat.totalValue / stats.totalValue) * 100 : 0
                  return (
                    <div key={stat.categoryId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stat.categoryColor }}
                          />
                          <span className="font-medium">{stat.categoryName}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(stat.totalValue)}</div>
                          <div className="text-xs text-muted-foreground">{stat.count} manutenções</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: stat.categoryColor,
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {percentage.toFixed(1)}% do total
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Manutenções */}
        <Card>
          <CardHeader>
            <CardTitle>Manutenções Detalhadas</CardTitle>
            <CardDescription>
              {filteredMaintenances.length} {filteredMaintenances.length === 1 ? 'registro encontrado' : 'registros encontrados'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMaintenances.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma manutenção encontrada com os filtros selecionados
                </p>
              </div>
            ) : (
              <>
                {/* Tabela Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium whitespace-nowrap">Data</th>
                        <th className="text-left p-2 font-medium whitespace-nowrap">Veículo</th>
                        <th className="text-left p-2 font-medium whitespace-nowrap">Categoria</th>
                        <th className="text-left p-2 font-medium whitespace-nowrap">Tipo</th>
                        <th className="text-left p-2 font-medium whitespace-nowrap">Local</th>
                        <th className="text-right p-2 font-medium whitespace-nowrap">KM</th>
                        <th className="text-right p-2 font-medium whitespace-nowrap">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaintenances.map((maintenance) => (
                        <tr key={maintenance.id} className="border-b last:border-0">
                          <td className="p-2 whitespace-nowrap">{formatDate(maintenance.date)}</td>
                          <td className="p-2">{getVehicleName(maintenance.vehicleId)}</td>
                          <td className="p-2">{getCategoryName(maintenance.categoryId)}</td>
                          <td className="p-2">{maintenance.type}</td>
                          <td className="p-2">{maintenance.location}</td>
                          <td className="p-2 text-right whitespace-nowrap">{formatMileage(maintenance.mileage)}</td>
                          <td className="p-2 text-right font-medium whitespace-nowrap">{formatCurrency(maintenance.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 font-bold">
                        <td colSpan={6} className="p-2 text-right">Total:</td>
                        <td className="p-2 text-right whitespace-nowrap">{formatCurrency(stats.totalValue)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Cards Mobile */}
                <div className="md:hidden space-y-3">
                  {filteredMaintenances.map((maintenance) => (
                    <div key={maintenance.id} className="border rounded-lg p-3 space-y-2 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">{maintenance.type}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(maintenance.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(maintenance.value)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Veículo</p>
                          <p className="font-medium">{getVehicleName(maintenance.vehicleId)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Categoria</p>
                          <p className="font-medium">{getCategoryName(maintenance.categoryId)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Local</p>
                          <p className="font-medium">{maintenance.location}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">KM</p>
                          <p className="font-medium">{formatMileage(maintenance.mileage)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t-2 pt-3 flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(stats.totalValue)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
