import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Car, Upload, X } from 'lucide-react'
import { vehicleFormSchema, type VehicleForm } from '@/lib/schemas'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { resizeImage } from '@/lib/utils'
import { VEHICLE_TYPES } from '@/lib/constants'

interface VehicleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingVehicle?: { id: string } & VehicleForm
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  editingVehicle,
}: VehicleFormDialogProps) {
  const { currentUser } = useAuthStore()
  const { addVehicle, updateVehicle } = useVehicleStore()
  const { toast } = useToast()
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(editingVehicle?.photo)

  const form = useForm<VehicleForm>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: editingVehicle ? {
      ...editingVehicle,
      mileageDate: editingVehicle.mileageDate || new Date().toISOString().split('T')[0],
    } : {
      type: 'car',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plate: '',
      mileage: 0,
      mileageDate: new Date().toISOString().split('T')[0],
      photo: undefined,
    },
  })

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Arquivo inválido',
          description: 'Por favor, selecione uma imagem',
        })
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo é 5MB',
        })
        return
      }

      // Resize and convert to base64
      const resizedPhoto = await resizeImage(file, 256)
      setPhotoPreview(resizedPhoto)
      form.setValue('photo', resizedPhoto)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao processar imagem',
        description: 'Tente novamente com outra imagem',
      })
    }
  }

  const removePhoto = () => {
    setPhotoPreview(undefined)
    form.setValue('photo', undefined)
  }

  const onSubmit = (data: VehicleForm) => {
    if (!currentUser) return

    try {
      if (editingVehicle) {
        updateVehicle(editingVehicle.id, data)
        toast({
          title: 'Veículo atualizado!',
          description: 'As alterações foram salvas com sucesso',
        })
      } else {
        addVehicle(data, currentUser.id)
        toast({
          title: 'Veículo cadastrado!',
          description: 'Seu veículo foi adicionado com sucesso',
        })
      }

      form.reset()
      setPhotoPreview(undefined)
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error instanceof Error ? error.message : 'Tente novamente',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
          </DialogTitle>
          <DialogDescription>
            {editingVehicle
              ? 'Atualize as informações do seu veículo'
              : 'Adicione um novo veículo ao sistema'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Foto do Veículo (opcional)</Label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border-2"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={removePhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-32 w-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    A imagem será redimensionada para 256x256px
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vehicle Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Veículo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VEHICLE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ford, Honda, etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Focus, Civic, etc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 2020"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plate */}
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ABC-1234 ou ABC1D23"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      Formato antigo (ABC-1234) ou Mercosul (ABC1D23)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mileage */}
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem Atual (km) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 50000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Quilometragem atual do veículo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mileage Date */}
              <FormField
                control={form.control}
                name="mileageDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Leitura *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Data em que a quilometragem foi registrada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Salvando...'
                  : editingVehicle
                  ? 'Atualizar'
                  : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
