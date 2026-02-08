import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { useVehicleStore } from '@/stores/vehicle-store'
import { useMaintenanceStore } from '@/stores/maintenance-store'
import { useIPVAStore } from '@/stores/ipva-store'
import { useCategoryStore } from '@/stores/category-store'
import { useSettingsStore } from '@/stores/settings-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { exportBackup, importBackup } from '@/lib/utils'
import { Download, Upload, Moon, Sun, Bell, Database, AlertTriangle, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

export function SettingsPage() {
  const { currentUser, users } = useAuthStore()
  const { vehicles } = useVehicleStore()
  const { maintenances } = useMaintenanceStore()
  const { ipvas } = useIPVAStore()
  const { categories } = useCategoryStore()
  const { settings, updateSettings, toggleDarkMode } = useSettingsStore()
  const { toast } = useToast()
  
  const [maintenanceAlertDistance, setMaintenanceAlertDistance] = useState(settings.maintenanceAlertDistance)
  const [ipvaAlertDays, setIpvaAlertDays] = useState(settings.ipvaAlertDays)

  const handleBackup = () => {
    // Use exportBackup util which validates before exporting
    try {
      exportBackup({ users, vehicles, maintenances, ipvas, categories, settings })
      toast({ title: 'Backup realizado!', description: 'Seus dados foram exportados com sucesso.' })
    } catch (e: any) {
      toast({ title: 'Erro ao fazer backup', description: e.message || 'Não foi possível exportar os dados.', variant: 'destructive' })
    }
  }

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    ;(async () => {
      const res = await importBackup(file)
      if (!res.ok) {
        toast({ title: 'Erro ao restaurar backup', description: res.error || 'Arquivo inválido', variant: 'destructive' })
        return
      }

      // Confirmar antes de restaurar
      if (!confirm('Tem certeza que deseja restaurar este backup? Isso irá substituir todos os dados atuais.')) {
        return
      }

      const data = res.data
      if (!data) {
        toast({ title: 'Erro ao restaurar backup', description: 'Dados inválidos', variant: 'destructive' })
        return
      }

      if (data.vehicles) {
        localStorage.setItem('carcare-vehicles', JSON.stringify({ state: { vehicles: data.vehicles, currentVehicleId: null } }))
      }
      if (data.maintenances) {
        localStorage.setItem('carcare-maintenances', JSON.stringify({ state: { maintenances: data.maintenances } }))
      }
      if (data.ipvas) {
        localStorage.setItem('carcare-ipvas', JSON.stringify({ state: { ipvas: data.ipvas } }))
      }
      if (data.categories) {
        localStorage.setItem('carcare-categories', JSON.stringify({ state: { categories: data.categories } }))
      }
      if (data.settings) {
        localStorage.setItem('carcare-settings', JSON.stringify({ state: { settings: data.settings } }))
      }
      if (data.users) {
        localStorage.setItem('carcare-auth', JSON.stringify({ state: { users: data.users, currentUser: null, isAuthenticated: false } }))
      }

      toast({ title: 'Backup restaurado!', description: 'Recarregando a página para aplicar as mudanças...' })
      setTimeout(() => window.location.reload(), 1200)
    })()
  }

  const handleSaveSettings = () => {
    updateSettings({
      maintenanceAlertDistance,
      ipvaAlertDays,
    })
    toast({
      title: 'Configurações salvas!',
      description: 'Suas preferências foram atualizadas.',
    })
  }

  // Password change form
  const { changePassword, updateUser } = useAuthStore()

  const pwForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onChangePassword = (vals: any) => {
    if (!currentUser) return
    const { currentPassword, newPassword, confirmPassword } = vals
    if (newPassword.length < 6) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Senha deve ter ao menos 6 caracteres' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Confirmação de senha não confere' })
      return
    }
    if (currentUser.password !== currentPassword) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Senha atual incorreta' })
      return
    }

    try {
      changePassword(currentUser.id, newPassword)
      updateUser(currentUser.id, { mustChangePassword: false })
      toast({ title: 'Senha alterada!', description: 'Senha atualizada com sucesso.' })
      pwForm.reset()
    } catch (e) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível alterar a senha' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e dados do sistema</p>
      </div>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Aparência
          </CardTitle>
          <CardDescription>Personalize a aparência do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Ative o tema escuro para reduzir o cansaço visual
              </p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>

        {/* Conta - Trocar Senha */}
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Altere sua senha de acesso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={pwForm.handleSubmit(onChangePassword)} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input id="currentPassword" type="password" {...pwForm.register('currentPassword')} />
              </div>

              <div>
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input id="newPassword" type="password" {...pwForm.register('newPassword')} />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input id="confirmPassword" type="password" {...pwForm.register('confirmPassword')} />
              </div>

              <Button type="submit">Alterar senha</Button>
            </form>
          </CardContent>
        </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure os alertas de manutenção e IPVA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maintenanceAlert">Alerta de Manutenção (km antes)</Label>
            <Input
              id="maintenanceAlert"
              type="number"
              value={maintenanceAlertDistance}
              onChange={(e) => setMaintenanceAlertDistance(Number(e.target.value))}
              placeholder="500"
            />
            <p className="text-sm text-muted-foreground">
              Você será notificado quando faltar esta quilometragem para a próxima manutenção
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipvaAlert">Alerta de IPVA (dias antes)</Label>
            <Input
              id="ipvaAlert"
              type="number"
              value={ipvaAlertDays}
              onChange={(e) => setIpvaAlertDays(Number(e.target.value))}
              placeholder="30"
            />
            <p className="text-sm text-muted-foreground">
              Você será notificado quando faltar este número de dias para o vencimento do IPVA
            </p>
          </div>

          <Button onClick={handleSaveSettings}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Backup e Restauração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup e Restauração
          </CardTitle>
          <CardDescription>Exporte ou importe seus dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">Backup Automático</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Seus dados são salvos automaticamente no navegador
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleBackup} className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Fazer Backup
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Baixe todos os seus dados em um arquivo JSON
            </p>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => document.getElementById('restore-file')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Restaurar Backup
            </Button>
            <input
              id="restore-file"
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleRestore}
            />
            <p className="text-sm text-muted-foreground text-center">
              Importe um arquivo de backup anterior
            </p>
          </div>

          <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>Atenção:</strong> A restauração irá substituir todos os dados atuais
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas do Sistema</CardTitle>
          <CardDescription>Informações sobre seus dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{vehicles.length}</p>
              <p className="text-sm text-muted-foreground">Veículos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{maintenances.length}</p>
              <p className="text-sm text-muted-foreground">Manutenções</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{ipvas.length}</p>
              <p className="text-sm text-muted-foreground">Registros IPVA</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Categorias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

