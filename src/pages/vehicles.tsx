import { useState, useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vehicleFormSchema, type VehicleForm, type Vehicle } from '@/lib/schemas'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate, formatMileage } from '@/lib/utils'
import { Plus, Edit, Trash2, Car, DollarSign, FileText, Shield, Image as ImageIcon, Check, Search, Grid3x3, List, ArrowUpDown, Download, Trash, Wrench } from 'lucide-react'
import { exportToJSON } from '@/lib/utils'

export function VehiclesPage() {
  const { currentUser } = useAuthStore()
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, setCurrentVehicle, getCurrentVehicle } = useVehicleStore()
  const { getVehicleMaintenances } = useMaintenanceStore()
  const { getVehicleIPVAs } = useIPVAStore()
  const { toast } = useToast()

  const currentVehicle = getCurrentVehicle()
  const userVehicles = vehicles.filter((v) => v.userId === currentUser?.id)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'mileage'>('name')
  
  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase()
    let filtered = userVehicles.filter((v) => {
      if (filterType && v.type !== filterType) return false
      if (!q) return true
      return (
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q)
      )
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
        case 'year':
          return b.year - a.year
        case 'mileage':
          return b.mileage - a.mileage
        default:
          return 0
      }
    })

    return filtered
  }, [userVehicles, query, filterType, sortBy])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      type: 'car',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plate: '',
      color: '',
      mileage: 0,
      fuelType: 'Gasoline',
      chassisNumber: '',
      renavam: '',
      engineNumber: '',
      purchaseDate: '',
      purchaseValue: 0,
      insuranceCompany: '',
      insurancePolicy: '',
      insuranceExpiry: '',
      notes: '',
      photo: '',
    },
  })

  const onSubmit = (data: VehicleForm) => {
    if (!currentUser) {
      toast({
        title: 'Erro',
        description: 'Usuário não encontrado',
        variant: 'destructive',
      })
      return
    }

    try {
      if (editingVehicle) {
        updateVehicle(editingVehicle, data)
        toast({
          title: 'Sucesso',
          description: 'Veículo atualizado com sucesso!',
        })
      } else {
        addVehicle(data, currentUser.id)
        toast({
          title: 'Sucesso',
          description: 'Veículo cadastrado com sucesso!',
        })
      }

      handleCloseDialog()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar veículo',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    if (vehicle) {
      setEditingVehicle(vehicleId)
      setValue('type', vehicle.type)
      setValue('brand', vehicle.brand)
      setValue('model', vehicle.model)
      setValue('year', vehicle.year)
      setValue('plate', vehicle.plate)
      setValue('color', vehicle.color || '')
      setValue('mileage', vehicle.mileage)
      setValue('fuelType', vehicle.fuelType)
      setValue('chassisNumber', vehicle.chassisNumber || '')
      setValue('renavam', vehicle.renavam || '')
      setValue('engineNumber', vehicle.engineNumber || '')
      setValue('purchaseDate', vehicle.purchaseDate || '')
      setValue('purchaseValue', vehicle.purchaseValue || 0)
      setValue('insuranceCompany', vehicle.insuranceCompany || '')
      setValue('insurancePolicy', vehicle.insurancePolicy || '')
      setValue('insuranceExpiry', vehicle.insuranceExpiry || '')
      setValue('notes', vehicle.notes || '')
      setValue('photo', vehicle.photo || '')
      setImagePreview(vehicle.photo || null)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = (vehicleId: string) => {
    const maintenances = getVehicleMaintenances(vehicleId)
    const ipvas = getVehicleIPVAs(vehicleId)
    
    const message = maintenances.length > 0 || ipvas.length > 0
      ? `Este veículo possui ${maintenances.length} manutenções e ${ipvas.length} registros de IPVA. Todos os dados relacionados serão excluídos. Deseja continuar?`
      : 'Tem certeza que deseja excluir este veículo?'

    if (confirm(message)) {
      deleteVehicle(vehicleId)
      toast({
        title: 'Sucesso',
        description: 'Veículo excluído com sucesso!',
      })
    }
  }

  const toggleSelect = (vehicleId: string) => {
    setSelected((s) => ({ ...s, [vehicleId]: !s[vehicleId] }))
  }

  const selectedIds = Object.keys(selected).filter((k) => selected[k])

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Deseja excluir ${selectedIds.length} veículos selecionados? Esta ação é irreversível.`)) return
    selectedIds.forEach((id) => deleteVehicle(id))
    setSelected({})
    toast({ title: 'Sucesso', description: 'Veículos excluídos.' })
  }

  const handleExportSelected = () => {
    if (selectedIds.length === 0) return
    const data = vehicles.filter((v) => selectedIds.includes(v.id))
    exportToJSON({ vehicles: data }, `vehicles-export-${new Date().toISOString().split('T')[0]}.json`)
    toast({ title: 'Exportado', description: `${selectedIds.length} veículos exportados.` })
  }

  const handleSelectVehicle = (vehicleId: string) => {
    setCurrentVehicle(vehicleId)
    toast({
      title: 'Veículo selecionado',
      description: 'Veículo atual atualizado!',
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingVehicle(null)
    setImagePreview(null)
    reset()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'A imagem deve ter no máximo 2MB',
          variant: 'destructive',
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setValue('photo', base64String)
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const getVehicleStats = (vehicle: Vehicle) => {
    const maintenances = getVehicleMaintenances(vehicle.id)
    const ipvas = getVehicleIPVAs(vehicle.id)
    const totalSpent = maintenances.reduce((sum, m) => sum + m.value, 0)
    const totalIPVA = ipvas.reduce((sum, i) => sum + i.totalValue, 0)

    return {
      maintenanceCount: maintenances.length,
      ipvaCount: ipvas.length,
      totalSpent,
      totalIPVA,
    }
  }

  const getVehicleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      car: 'Carro',
      motorcycle: 'Moto',
      truck: 'Caminhão',
      van: 'Van',
      suv: 'SUV',
    }
    return labels[type] || type
  }

  const getFuelTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Gasoline: 'Gasolina',
      Ethanol: 'Etanol',
      Diesel: 'Diesel',
      Flex: 'Flex',
      Electric: 'Elétrico',
      Hybrid: 'Híbrido',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meus Veículos
            </h1>
            <p className="text-muted-foreground text-lg mt-1">
              Gerencie todos os seus veículos em um só lugar
            </p>
          </div>
          <Badge variant="info" className="text-lg px-4 py-2">
            {userVehicles.length} {userVehicles.length === 1 ? 'veículo' : 'veículos'}
          </Badge>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 h-11"
              placeholder="Buscar por marca, modelo ou placa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Select value={filterType || 'all'} onValueChange={(v) => setFilterType(v === 'all' ? null : v)}>
            <SelectTrigger className="w-[180px] h-11">
              <SelectValue placeholder="Tipo de veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="car">Carro</SelectItem>
              <SelectItem value="motorcycle">Moto</SelectItem>
              <SelectItem value="truck">Caminhão</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-[180px] h-11">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
              <SelectItem value="mileage">Quilometragem</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-9"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingVehicle(null)} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Veículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do seu veículo
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Informações Básicas
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Veículo *</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="car">Carro</SelectItem>
                            <SelectItem value="motorcycle">Moto</SelectItem>
                            <SelectItem value="truck">Caminhão</SelectItem>
                            <SelectItem value="van">Van</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Combustível *</Label>
                    <Controller
                      name="fuelType"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gasoline">Gasolina</SelectItem>
                            <SelectItem value="Ethanol">Etanol</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Flex">Flex</SelectItem>
                            <SelectItem value="Electric">Elétrico</SelectItem>
                            <SelectItem value="Hybrid">Híbrido</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      {...register('brand')}
                      placeholder="Ex: Toyota"
                    />
                    {errors.brand && (
                      <p className="text-sm text-destructive">{errors.brand.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      {...register('model')}
                      placeholder="Ex: Corolla"
                    />
                    {errors.model && (
                      <p className="text-sm text-destructive">{errors.model.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano *</Label>
                    <Input
                      id="year"
                      type="number"
                      {...register('year', { valueAsNumber: true })}
                      placeholder="2024"
                    />
                    {errors.year && (
                      <p className="text-sm text-destructive">{errors.year.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plate">Placa *</Label>
                    <Input
                      id="plate"
                      {...register('plate')}
                      placeholder="ABC-1234"
                      className="uppercase"
                      onChange={(e) => setValue('plate', e.target.value.toUpperCase())}
                    />
                    {errors.plate && (
                      <p className="text-sm text-destructive">{errors.plate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Cor</Label>
                    <Input
                      id="color"
                      {...register('color')}
                      placeholder="Preto"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Quilometragem Atual (km) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    {...register('mileage', { valueAsNumber: true })}
                    placeholder="50000"
                  />
                  {errors.mileage && (
                    <p className="text-sm text-destructive">{errors.mileage.message}</p>
                  )}
                </div>
              </div>

              {/* Documentação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documentação
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chassisNumber">Número do Chassi</Label>
                    <Input
                      id="chassisNumber"
                      {...register('chassisNumber')}
                      placeholder="9BWZZZ377VT004251"
                      className="uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="renavam">RENAVAM</Label>
                    <Input
                      id="renavam"
                      {...register('renavam')}
                      placeholder="00000000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engineNumber">Número do Motor</Label>
                  <Input
                    id="engineNumber"
                    {...register('engineNumber')}
                    placeholder="XYZ123456"
                    className="uppercase"
                  />
                </div>
              </div>

              {/* Compra */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Informações de Compra
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Data da Compra</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      {...register('purchaseDate')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseValue">Valor de Compra (R$)</Label>
                    <Input
                      id="purchaseValue"
                      type="number"
                      step="0.01"
                      {...register('purchaseValue', { 
                        setValueAs: (v) => v === '' ? undefined : Number(v) 
                      })}
                      placeholder="50000.00"
                    />
                  </div>
                </div>
              </div>

              {/* Seguro */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Seguro
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceCompany">Seguradora</Label>
                    <Input
                      id="insuranceCompany"
                      {...register('insuranceCompany')}
                      placeholder="Porto Seguro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurancePolicy">Número da Apólice</Label>
                    <Input
                      id="insurancePolicy"
                      {...register('insurancePolicy')}
                      placeholder="123456789"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceExpiry">Vencimento do Seguro</Label>
                  <Input
                    id="insuranceExpiry"
                    type="date"
                    {...register('insuranceExpiry')}
                  />
                </div>
              </div>

              {/* Foto e Observações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Foto e Observações
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="photo">Foto do Veículo</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Informações adicionais sobre o veículo..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVehicle ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg">
            <Badge variant="info" className="text-sm">
              {selectedIds.length} selecionado(s)
            </Badge>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={handleExportSelected}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle List */}
      {filteredVehicles.length === 0 ? (
        <Card className="card-hover border-2 border-dashed">
          <CardContent className="py-16">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 bg-muted rounded-full">
                  <Car className="h-20 w-20 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {userVehicles.length === 0 ? 'Nenhum veículo cadastrado' : 'Nenhum veículo encontrado'}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {userVehicles.length === 0 
                    ? 'Comece adicionando seu primeiro veículo'
                    : 'Tente ajustar os filtros de busca'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredVehicles.map((vehicle, index) => {
            const stats = getVehicleStats(vehicle)
            const isCurrentVehicle = currentVehicle?.id === vehicle.id

            return (
              <Card
                key={vehicle.id}
                className={`card-hover border-2 transition-all ${
                  isCurrentVehicle ? 'ring-2 ring-blue-500 border-blue-300 dark:border-blue-700' : ''
                } ${
                  selected[vehicle.id] ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                } animate-fadeIn`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {vehicle.photo && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={vehicle.photo}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {isCurrentVehicle && (
                      <Badge className="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 shadow-lg">
                        <Check className="w-3 h-3 mr-1" />
                        Atual
                      </Badge>
                    )}
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        aria-label={`Selecionar veículo ${vehicle.brand} ${vehicle.model}`}
                        checked={!!selected[vehicle.id]}
                        onChange={() => toggleSelect(vehicle.id)}
                        className="w-4 h-4 mt-1 cursor-pointer"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold mb-1">
                          {vehicle.brand} {vehicle.model}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{getVehicleTypeLabel(vehicle.type)}</Badge>
                          <Badge variant="secondary">{vehicle.year}</Badge>
                          <Badge variant="outline" className="font-mono">{vehicle.plate}</Badge>
                        </div>
                      </div>
                    </div>
                    {isCurrentVehicle && !vehicle.photo && (
                      <Badge variant="success">
                        <Check className="w-3 h-3 mr-1" />
                        Atual
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground font-medium">Combustível</p>
                      <p className="font-semibold">{getFuelTypeLabel(vehicle.fuelType)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground font-medium">Quilometragem</p>
                      <p className="font-semibold text-blue-600">{formatMileage(vehicle.mileage)}</p>
                    </div>
                    {vehicle.color && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground font-medium">Cor</p>
                        <p className="font-semibold">{vehicle.color}</p>
                      </div>
                    )}
                    {vehicle.renavam && (
                      <div className="space-y-1">
                        <p className="text-muted-foreground font-medium">RENAVAM</p>
                        <p className="font-semibold text-xs">{vehicle.renavam}</p>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-muted-foreground">Manutenções</span>
                      </div>
                      <span className="font-bold text-orange-600">{stats.maintenanceCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-muted-foreground">Gasto Total</span>
                      </div>
                      <span className="font-bold text-green-600">{formatCurrency(stats.totalSpent)}</span>
                    </div>
                    {stats.ipvaCount > 0 && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-muted-foreground">IPVA Pago</span>
                        </div>
                        <span className="font-bold text-blue-600">{formatCurrency(stats.totalIPVA)}</span>
                      </div>
                    )}
                  </div>

                  {/* Insurance Info */}
                  {vehicle.insuranceCompany && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Seguro</p>
                            <p className="font-semibold text-sm">{vehicle.insuranceCompany}</p>
                          </div>
                        </div>
                        {vehicle.insuranceExpiry && (
                          <Badge variant="outline" className="text-xs">
                            {formatDate(vehicle.insuranceExpiry)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4">
                  {!isCurrentVehicle && (
                    <Button
                      variant="outline"
                      className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-300"
                      onClick={() => handleSelectVehicle(vehicle.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Selecionar
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-300"
                    onClick={() => handleEdit(vehicle.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
