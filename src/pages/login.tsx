import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Car, Lock, User, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { loginSchema, type LoginForm } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { toast } = useToast()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginForm) => {
    const success = login(data.username, data.password)

    if (success) {
      const usr = useAuthStore.getState().currentUser
      if (usr?.mustChangePassword) {
        toast({
          title: 'Trocar senha',
          description: 'É obrigatório alterar a senha padrão antes de continuar',
        })
        navigate({ to: '/settings' })
        return
      }

      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo ao CarCare',
      })
      navigate({ to: '/' })
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: 'Usuário ou senha inválidos',
      })
    }
  }

  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md animate-scaleIn shadow-2xl border-2 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative p-5 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Car className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold">
              <span className="gradient-text">CarCare</span>
            </CardTitle>
            <CardDescription className="text-base flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Sistema de Controle de Manutenção Veicular
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="animate-slideIn">
                    <FormLabel className="text-sm font-semibold">Usuário</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Digite seu usuário" 
                          className="pl-10 h-11 transition-all focus:ring-2"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="animate-slideIn" style={{ animationDelay: '0.1s' }}>
                    <FormLabel className="text-sm font-semibold">Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Digite sua senha"
                          className="pl-10 h-11 transition-all focus:ring-2"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                size="lg"
              >
                Entrar
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Credenciais padrão
                  </span>
                </div>
              </div>

              <div className="text-xs text-center glass-effect p-3 rounded-lg border space-y-1.5">
                <p className="flex items-center justify-center gap-2">
                  <User className="w-3 h-3" />
                  <span className="text-muted-foreground">Usuário:</span> 
                  <strong className="text-foreground">admin</strong>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Lock className="w-3 h-3" />
                  <span className="text-muted-foreground">Senha:</span> 
                  <strong className="text-foreground">admin123</strong>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
