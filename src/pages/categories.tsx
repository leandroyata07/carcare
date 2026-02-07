import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useCategoryStore } from '@/stores/category-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoryFormSchema, type CategoryForm } from '@/lib/schemas'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Tag, Wrench, AlertTriangle } from 'lucide-react'

const iconOptions = [
  { value: 'wrench', label: 'Chave', icon: '🔧' },
  { value: 'oil-can', label: 'Óleo', icon: '🛢️' },
  { value: 'filter', label: 'Filtro', icon: '🔍' },
  { value: 'brake', label: 'Freio', icon: '🛑' },
  { value: 'tire', label: 'Pneu', icon: '⚫' },
  { value: 'battery', label: 'Bateria', icon: '🔋' },
  { value: 'snowflake', label: 'Ar Condicionado', icon: '❄️' },
  { value: 'engine', label: 'Motor', icon: '⚙️' },
  { value: 'gear', label: 'Transmissão', icon: '⚙️' },
  { value: 'bolt', label: 'Elétrico', icon: '⚡' },
  { value: 'soap', label: 'Limpeza', icon: '🧼' },
  { value: 'tools', label: 'Ferramentas', icon: '🛠️' },
  { value: 'car', label: 'Geral', icon: '🚗' },
]

const colorOptions = [
  { value: '#10b981', label: 'Verde' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#f59e0b', label: 'Laranja' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#14b8a6', label: 'Turquesa' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#eab308', label: 'Amarelo' },
  { value: '#64748b', label: 'Cinza' },
]

export function CategoriesPage() {
  const { currentUser } = useAuthStore()
  const { categories, addCategory, updateCategory, deleteCategory, getUserCategories } = useCategoryStore()
  const { maintenances } = useMaintenanceStore()
  const { toast } = useToast()

  const userCategories = currentUser ? getUserCategories(currentUser.id) : []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      color: '#3b82f6',
      icon: 'wrench',
    },
  })

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  const onSubmit = (data: CategoryForm) => {
    if (!currentUser) {
      toast({
        title: 'Erro',
        description: 'Usuário não encontrado',
        variant: 'destructive',
      })
      return
    }

    try {
      if (editingCategory) {
        updateCategory(editingCategory, data)
        toast({
          title: 'Sucesso',
          description: 'Categoria atualizada com sucesso!',
        })
      } else {
        addCategory(data, currentUser.id)
        toast({
          title: 'Sucesso',
          description: 'Categoria criada com sucesso!',
        })
      }

      handleCloseDialog()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar categoria',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      setEditingCategory(categoryId)
      setValue('name', category.name)
      setValue('color', category.color)
      setValue('icon', category.icon)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = (categoryId: string) => {
    const categoryMaintenances = maintenances.filter((m) => m.categoryId === categoryId)
    
    if (categoryMaintenances.length > 0) {
      toast({
        title: 'Não é possível excluir',
        description: `Esta categoria possui ${categoryMaintenances.length} manutenções associadas. Exclua ou altere as manutenções primeiro.`,
        variant: 'destructive',
      })
      return
    }

    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(categoryId)
      toast({
        title: 'Sucesso',
        description: 'Categoria excluída com sucesso!',
      })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    reset()
  }

  const getCategoryUsageCount = (categoryId: string) => {
    return maintenances.filter((m) => m.categoryId === categoryId).length
  }

  const getCategoryUsageTotal = (categoryId: string) => {
    return maintenances
      .filter((m) => m.categoryId === categoryId)
      .reduce((sum, m) => sum + m.value, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias de Manutenção</h1>
          <p className="text-muted-foreground">
            Organize suas manutenções em categorias personalizadas
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                Crie categorias para organizar melhor suas manutenções
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: Troca de óleo"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Cor da Categoria *</Label>
                <div className="grid grid-cols-5 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setValue('color', color.value)}
                      className={`h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedColor === color.value
                          ? 'border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-900 dark:ring-white'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
                {errors.color && (
                  <p className="text-sm text-destructive">{errors.color.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Ícone da Categoria *</Label>
                <div className="grid grid-cols-4 gap-3">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => setValue('icon', icon.value)}
                      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center gap-2 ${
                        selectedIcon === icon.value
                          ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">{icon.icon}</span>
                      <span className="text-xs text-center">{icon.label}</span>
                    </button>
                  ))}
                </div>
                {errors.icon && (
                  <p className="text-sm text-destructive">{errors.icon.message}</p>
                )}
              </div>

              {/* Preview */}
              <div className="p-4 border rounded-lg">
                <Label className="mb-2 block">Preview</Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {iconOptions.find((i) => i.value === selectedIcon)?.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{watch('name') || 'Nome da categoria'}</p>
                    <p className="text-xs text-muted-foreground">Preview da sua categoria</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {userCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Tag className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Nenhuma categoria criada</h3>
                <p className="text-muted-foreground">
                  Comece criando sua primeira categoria
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCategories.map((category) => {
            const usageCount = getCategoryUsageCount(category.id)
            const usageTotal = getCategoryUsageTotal(category.id)
            const iconData = iconOptions.find((i) => i.value === category.icon)

            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: category.color }}
                    >
                      {iconData?.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        {usageCount} {usageCount === 1 ? 'manutenção' : 'manutenções'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Gasto Total</span>
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">
                      R$ {usageTotal.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(category.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(category.id)}
                      disabled={usageCount > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {usageCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Possui manutenções associadas</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Statistics */}
      {userCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas das Categorias</CardTitle>
            <CardDescription>Distribuição das manutenções por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userCategories
                .map((cat) => ({
                  category: cat,
                  count: getCategoryUsageCount(cat.id),
                  total: getCategoryUsageTotal(cat.id),
                }))
                .filter((stat) => stat.count > 0)
                .sort((a, b) => b.total - a.total)
                .map((stat) => {
                  const iconData = iconOptions.find((i) => i.value === stat.category.icon)
                  const totalGeral = userCategories.reduce(
                    (sum, cat) => sum + getCategoryUsageTotal(cat.id),
                    0
                  )
                  const percentage = totalGeral > 0 ? (stat.total / totalGeral) * 100 : 0

                  return (
                    <div key={stat.category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: stat.category.color }}
                          >
                            {iconData?.icon}
                          </div>
                          <span className="font-medium">{stat.category.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            R$ {stat.total.toFixed(2).replace('.', ',')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stat.count} {stat.count === 1 ? 'manutenção' : 'manutenções'}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: stat.category.color,
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
    </div>
  )
}
