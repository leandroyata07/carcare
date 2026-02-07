import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ipvaFormSchema, type IPVAForm } from '@/lib/schemas'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Edit, Trash2, Calendar, DollarSign, FileText, AlertTriangle, CheckCircle } from 'lucide-react'

export function IPVAPage() {
  const { currentUser } = useAuthStore()
  const { getCurrentVehicle } = useVehicleStore()
  const { ipvas, addIPVA, updateIPVA, deleteIPVA, getVehicleIPVAs, updateIPVAStatus } = useIPVAStore()
  const { toast } = useToast()

  const currentVehicle = getCurrentVehicle()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIPVA, setEditingIPVA] = useState<string | null>(null)
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IPVAForm>({
    resolver: zodResolver(ipvaFormSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      type: 'Both',
      ipvaValue: 0,
      licensingValue: 0,
      dueDate: '',
      paymentDate: '',
      status: 'pending',
      paymentLocation: '',
      paymentMethod: '',
      receiptNumber: '',
      installments: 1,
      currentInstallment: 1,
      notes: '',
      documents: [],
    },
  })

  const vehicleIPVAs = currentVehicle
    ? getVehicleIPVAs(currentVehicle.id).sort((a, b) => b.year - a.year)
    : []

  const onSubmit = (data: IPVAForm) => {
    if (!currentVehicle || !currentUser) {
      toast({
        title: 'Erro',
        description: 'Veículo ou usuário não encontrado',
        variant: 'destructive',
      })
      return
    }

    try {
      if (editingIPVA) {
        updateIPVA(editingIPVA, data)
        toast({
          title: 'Sucesso',
          description: 'IPVA atualizado com sucesso!',
        })
      } else {
        addIPVA(data, currentVehicle.id, currentUser.id)
        toast({
          title: 'Sucesso',
          description: 'IPVA registrado com sucesso!',
        })
      }

      handleCloseDialog()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar IPVA',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (ipvaId: string) => {
    const ipva = ipvas.find((i) => i.id === ipvaId)
    if (ipva) {
      setEditingIPVA(ipvaId)
      setValue('year', ipva.year)
      setValue('type', ipva.type)
      setValue('ipvaValue', ipva.ipvaValue)
      setValue('licensingValue', ipva.licensingValue)
      setValue('dueDate', ipva.dueDate)
      setValue('paymentDate', ipva.paymentDate || '')
      setValue('status', ipva.status)
      setValue('paymentLocation', ipva.paymentLocation || '')
      setValue('paymentMethod', ipva.paymentMethod || '')
      setValue('receiptNumber', ipva.receiptNumber || '')
      setValue('installments', ipva.installments)
      setValue('currentInstallment', ipva.currentInstallment)
      setValue('notes', ipva.notes || '')
      setValue('documents', ipva.documents || [])
      setDocumentPreviews(ipva.documents || [])
      setIsDialogOpen(true)
    }
  }

  const handleDelete = (ipvaId: string) => {
    if (confirm('Tem certeza que deseja excluir este registro de IPVA?')) {
      deleteIPVA(ipvaId)
      toast({
        title: 'Sucesso',
        description: 'IPVA excluído com sucesso!',
      })
    }
  }

  const handleMarkAsPaid = (ipvaId: string) => {
    updateIPVAStatus(ipvaId, 'paid')
    toast({
      title: 'Sucesso',
      description: 'IPVA marcado como pago!',
    })
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingIPVA(null)
    setDocumentPreviews([])
    reset()
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setDocumentPreviews((prev) => [...prev, base64String])
        const currentDocs = watch('documents') || []
        setValue('documents', [...currentDocs, base64String])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeDocument = (index: number) => {
    const newPreviews = documentPreviews.filter((_, i) => i !== index)
    setDocumentPreviews(newPreviews)
    setValue('documents', newPreviews)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    const labels = {
      paid: 'Pago',
      pending: 'Pendente',
      overdue: 'Atrasado',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      paid: <CheckCircle className="w-5 h-5 text-green-600" />,
      pending: <Calendar className="w-5 h-5 text-yellow-600" />,
      overdue: <AlertTriangle className="w-5 h-5 text-red-600" />,
    }
    return icons[status as keyof typeof icons]
  }

  const totalPaid = vehicleIPVAs
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalValue, 0)
  
  const totalPending = vehicleIPVAs
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.totalValue, 0)

  if (!currentVehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500" />
        <h2 className="text-2xl font-bold">Nenhum veículo selecionado</h2>
        <p className="text-muted-foreground">Selecione um veículo para gerenciar o IPVA</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IPVA e Licenciamento</h1>
          <p className="text-muted-foreground">
            Controle os pagamentos do {currentVehicle.brand} {currentVehicle.model}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingIPVA(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingIPVA ? 'Editar Registro' : 'Novo Registro de IPVA'}
              </DialogTitle>
              <DialogDescription>
                Registre os pagamentos de IPVA e licenciamento do seu veículo
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    placeholder="2025"
                  />
                  {errors.year && (
                    <p className="text-sm text-destructive">{errors.year.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IPVA">Apenas IPVA</SelectItem>
                          <SelectItem value="Licensing">Apenas Licenciamento</SelectItem>
                          <SelectItem value="Both">IPVA + Licenciamento</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipvaValue">Valor do IPVA (R$) *</Label>
                  <Input
                    id="ipvaValue"
                    type="number"
                    step="0.01"
                    {...register('ipvaValue', { valueAsNumber: true })}
                    placeholder="1500.00"
                  />
                  {errors.ipvaValue && (
                    <p className="text-sm text-destructive">{errors.ipvaValue.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licensingValue">Valor do Licenciamento (R$) *</Label>
                  <Input
                    id="licensingValue"
                    type="number"
                    step="0.01"
                    {...register('licensingValue', { valueAsNumber: true })}
                    placeholder="300.00"
                  />
                  {errors.licensingValue && (
                    <p className="text-sm text-destructive">{errors.licensingValue.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data de Vencimento *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register('dueDate')}
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="paid">Pago</SelectItem>
                          <SelectItem value="overdue">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {watch('status') === 'paid' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Data do Pagamento</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      {...register('paymentDate')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentLocation">Local do Pagamento</Label>
                      <Input
                        id="paymentLocation"
                        {...register('paymentLocation')}
                        placeholder="Banco, Site, etc"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                      <Input
                        id="paymentMethod"
                        {...register('paymentMethod')}
                        placeholder="Cartão, PIX, etc"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Número do Recibo</Label>
                    <Input
                      id="receiptNumber"
                      {...register('receiptNumber')}
                      placeholder="123456789"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="installments">Parcelas</Label>
                  <Input
                    id="installments"
                    type="number"
                    min="1"
                    max="12"
                    {...register('installments', { valueAsNumber: true })}
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentInstallment">Parcela Atual</Label>
                  <Input
                    id="currentInstallment"
                    type="number"
                    min="1"
                    max="12"
                    {...register('currentInstallment', { valueAsNumber: true })}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Informações adicionais..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents">Documentos/Comprovantes</Label>
                <Input
                  id="documents"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDocumentUpload}
                />
                {documentPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {documentPreviews.map((doc, index) => (
                      <div key={index} className="relative">
                        <img
                          src={doc}
                          alt={`Documento ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeDocument(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingIPVA ? 'Atualizar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicleIPVAs.length}</div>
            <p className="text-xs text-muted-foreground">anos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">pagamentos realizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground">a pagar</p>
          </CardContent>
        </Card>
      </div>

      {/* IPVA List */}
      {vehicleIPVAs.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Nenhum registro de IPVA</h3>
                <p className="text-muted-foreground">
                  Adicione registros de IPVA e licenciamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vehicleIPVAs.map((ipva) => (
            <Card key={ipva.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(ipva.status)}
                    <div>
                      <CardTitle>
                        {ipva.type === 'IPVA' ? 'IPVA' : ipva.type === 'Licensing' ? 'Licenciamento' : 'IPVA + Licenciamento'} {ipva.year}
                      </CardTitle>
                      <CardDescription>
                        Vencimento: {formatDate(ipva.dueDate)}
                        {ipva.paymentDate && ` • Pago em: ${formatDate(ipva.paymentDate)}`}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(ipva.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor IPVA</p>
                    <p className="text-lg font-semibold">{formatCurrency(ipva.ipvaValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Licenciamento</p>
                    <p className="text-lg font-semibold">{formatCurrency(ipva.licensingValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold">{formatCurrency(ipva.totalValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Parcelas</p>
                    <p className="text-lg font-semibold">{ipva.currentInstallment}/{ipva.installments}</p>
                  </div>
                </div>

                {ipva.status === 'paid' && (
                  <div className="pt-3 border-t grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {ipva.paymentLocation && (
                      <div>
                        <p className="text-muted-foreground">Local</p>
                        <p className="font-medium">{ipva.paymentLocation}</p>
                      </div>
                    )}
                    {ipva.paymentMethod && (
                      <div>
                        <p className="text-muted-foreground">Forma</p>
                        <p className="font-medium">{ipva.paymentMethod}</p>
                      </div>
                    )}
                    {ipva.receiptNumber && (
                      <div>
                        <p className="text-muted-foreground">Recibo</p>
                        <p className="font-medium">{ipva.receiptNumber}</p>
                      </div>
                    )}
                  </div>
                )}

                {ipva.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">Observações</p>
                    <p className="text-sm mt-1">{ipva.notes}</p>
                  </div>
                )}

                {ipva.documents && ipva.documents.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Documentos ({ipva.documents.length})</p>
                    <div className="grid grid-cols-4 gap-2">
                      {ipva.documents.map((doc, index) => (
                        <img
                          key={index}
                          src={doc}
                          alt={`Documento ${index + 1}`}
                          className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                          onClick={() => window.open(doc, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                {ipva.status !== 'paid' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleMarkAsPaid(ipva.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Pago
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(ipva.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(ipva.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
