import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useCategoryStore } from '@/stores/category-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { maintenanceFormSchema, type MaintenanceForm } from '@/lib/schemas'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Calendar, MapPin, DollarSign, Gauge, AlertTriangle, Search, Filter, FileText, Image as ImageIcon } from 'lucide-react'

export function MaintenancesPage() {
  const { currentUser } = useAuthStore()
  const { getCurrentVehicle, vehicles, setCurrentVehicle, updateMileage } = useVehicleStore()
  const { maintenances, addMaintenance, updateMaintenance, deleteMaintenance, getVehicleMaintenances, getUpcomingMaintenances } = useMaintenanceStore()
  const { getUserCategories, getCategoryById } = useCategoryStore()
  const { toast } = useToast()

  const currentVehicle = getCurrentVehicle()
  const userVehicles = vehicles.filter((v) => v.userId === currentUser?.id)
  const categories = getUserCategories(currentUser?.id || '')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<MaintenanceForm>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      categoryId: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      mileage: currentVehicle?.mileage || 0,
      description: '',
      location: '',
      value: 0,
      nextChange: undefined,
      nextChangeDate: undefined,
      photo: '',
    },
  })

  const vehicleMaintenances = currentVehicle
    ? getVehicleMaintenances(currentVehicle.id)
        .filter((m) => {
          const matchesSearch = 
            m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.location.toLowerCase().includes(searchTerm.toLowerCase())
          
          const matchesCategory = selectedCategory === 'all' || m.categoryId === selectedCategory
          
          return matchesSearch && matchesCategory
        })
    : []

  const upcomingMaintenances = currentVehicle
    ? getUpcomingMaintenances(currentVehicle.id, currentVehicle.mileage, 500)
    : []

  const onSubmit = (data: MaintenanceForm) => {
    if (!currentVehicle || !currentUser) {
      toast({
        title: 'Erro',
        description: 'Veículo ou usuário não encontrado',
        variant: 'destructive',
      })
      return
    }

    try {
      if (editingMaintenance) {
        updateMaintenance(editingMaintenance, data)
        toast({
          title: 'Sucesso',
          description: 'Manutenção atualizada com sucesso!',
        })
      } else {
        addMaintenance(data, currentVehicle.id, currentUser.id)
        
        // Atualiza a quilometragem do veículo se for maior
        if (data.mileage > currentVehicle.mileage) {
          updateMileage(currentVehicle.id, data.mileage, data.date)
        }
        
        toast({
          title: 'Sucesso',
          description: 'Manutenção registrada com sucesso!',
        })
      }

      handleCloseDialog()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar manutenção',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (maintenanceId: string) => {
    const maintenance = maintenances.find((m) => m.id === maintenanceId)
    if (maintenance) {
      setEditingMaintenance(maintenanceId)
      setValue('categoryId', maintenance.categoryId)
      setValue('type', maintenance.type)
      setValue('date', maintenance.date)
      setValue('mileage', maintenance.mileage)
      setValue('description', maintenance.description)
      setValue('location', maintenance.location)
      setValue('value', maintenance.value)
      setValue('nextChange', maintenance.nextChange)
      setValue('nextChangeDate', maintenance.nextChangeDate)
      setValue('photo', maintenance.photo || '')
      setImagePreview(maintenance.photo || null)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = (maintenanceId: string) => {
    if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
      deleteMaintenance(maintenanceId)
      toast({
        title: 'Sucesso',
        description: 'Manutenção excluída com sucesso!',
      })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingMaintenance(null)
    setImagePreview(null)
    reset({
      categoryId: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      mileage: currentVehicle?.mileage || 0,
      description: '',
      location: '',
      value: 0,
      nextChange: undefined,
      nextChangeDate: undefined,
      photo: '',
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setValue('photo', base64String)
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  if (!currentVehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">Nenhum veículo selecionado</h2>
        <p className="text-muted-foreground">Selecione um veículo para gerenciar suas manutenções</p>
        {userVehicles.length > 0 && (
          <Select onValueChange={setCurrentVehicle}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecione um veículo" />
            </SelectTrigger>
            <SelectContent>
              {userVehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} - {vehicle.plate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manutenções</h1>
          <p className="text-muted-foreground">
            Gerencie o histórico de manutenções do seu {currentVehicle.brand} {currentVehicle.model}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMaintenance(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Manutenção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMaintenance ? 'Editar Manutenção' : 'Nova Manutenção'}
              </DialogTitle>
              <DialogDescription>
                Registre os detalhes da manutenção realizada
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Categoria */}
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Categoria *</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* Tipo de Serviço */}
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Serviço *</Label>
                  <Input
                    id="type"
                    {...register('type')}
                    placeholder="Ex: Troca de óleo"
                  />
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Data */}
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input id="date" type="date" {...register('date')} />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                  )}
                </div>

                {/* Quilometragem */}
                <div className="space-y-2">
                  <Label htmlFor="mileage">Quilometragem (km) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    {...register('mileage', { valueAsNumber: true })}
                    placeholder="Ex: 15000"
                  />
                  {errors.mileage && (
                    <p className="text-sm text-destructive">{errors.mileage.message}</p>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descreva os serviços realizados..."
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Local */}
                <div className="space-y-2">
                  <Label htmlFor="location">Oficina/Local *</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Nome da oficina"
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <Label htmlFor="value">Valor (R$) *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    {...register('value', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.value && (
                    <p className="text-sm text-destructive">{errors.value.message}</p>
                  )}
                </div>
              </div>

              {/* Próxima Troca */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextChange">Próxima Troca (km)</Label>
                  <Input
                    id="nextChange"
                    type="number"
                    {...register('nextChange', { 
                      setValueAs: (v) => v === '' ? undefined : Number(v) 
                    })}
                    placeholder="Ex: 20000 (opcional)"
                  />
                  {errors.nextChange && (
                    <p className="text-sm text-destructive">{errors.nextChange.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextChangeDate">Próxima Troca (data)</Label>
                  <Input
                    id="nextChangeDate"
                    type="date"
                    {...register('nextChangeDate')}
                  />
                  {errors.nextChangeDate && (
                    <p className="text-sm text-destructive">{errors.nextChangeDate.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    O que ocorrer primeiro: km ou data
                  </p>
                </div>
              </div>

              {/* Foto/Nota Fiscal */}
              <div className="space-y-2">
                <Label htmlFor="photo">Foto da Nota Fiscal ou Orçamento</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMaintenance ? 'Atualizar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertas de Manutenção Próxima */}
      {upcomingMaintenances.length > 0 && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              Manutenções Próximas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingMaintenances.map((maintenance) => {
                const category = getCategoryById(maintenance.categoryId)
                const kmRestantes = maintenance.nextChange! - currentVehicle.mileage
                return (
                  <div
                    key={maintenance.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <div>
                        <p className="font-medium">{maintenance.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Próxima troca: {maintenance.nextChange?.toLocaleString('pt-BR')} km
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-600">
                        Faltam {kmRestantes.toLocaleString('pt-BR')} km
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por serviço, descrição ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por Categoria */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Manutenções */}
      {vehicleMaintenances.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma manutenção registrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece a registrar as manutenções do seu veículo
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Manutenção
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicleMaintenances.map((maintenance) => {
            const category = getCategoryById(maintenance.categoryId)
            return (
              <Card key={maintenance.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <CardTitle className="text-lg">{maintenance.type}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(maintenance.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(maintenance.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{category?.name}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {maintenance.photo && (
                    <div className="relative h-32 rounded overflow-hidden">
                      <img
                        src={maintenance.photo}
                        alt="Nota fiscal"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 p-1 rounded">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {maintenance.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {formatDate(maintenance.date)}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Gauge className="w-4 h-4 text-muted-foreground" />
                      {maintenance.mileage.toLocaleString('pt-BR')} km
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {maintenance.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(maintenance.value)}
                    </div>

                    {(maintenance.nextChange || maintenance.nextChangeDate) && (
                      <div className="space-y-1">
                        {maintenance.nextChange && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <AlertTriangle className="w-4 h-4" />
                            Próxima: {maintenance.nextChange.toLocaleString('pt-BR')} km
                          </div>
                        )}
                        {maintenance.nextChangeDate && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Calendar className="w-4 h-4" />
                            Próxima: {formatDate(maintenance.nextChangeDate)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Estatísticas */}
      {vehicleMaintenances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total de Manutenções</p>
                <p className="text-2xl font-bold">{vehicleMaintenances.length}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Gasto Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    vehicleMaintenances.reduce((sum, m) => sum + m.value, 0)
                  )}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Média por Manutenção</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    vehicleMaintenances.reduce((sum, m) => sum + m.value, 0) /
                      vehicleMaintenances.length
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
