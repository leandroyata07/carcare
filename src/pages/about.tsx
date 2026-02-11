import { 
  Mail, 
  Globe, 
  Instagram, 
  Linkedin,
  MessageCircle,
  Code,
  Heart,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: 'Rápido e Eficiente',
      description: 'Interface moderna e responsiva para acesso em qualquer dispositivo'
    },
    {
      icon: Shield,
      title: 'Dados Seguros',
      description: 'Suas informações armazenadas localmente com total privacidade'
    },
    {
      icon: TrendingUp,
      title: 'Análises Inteligentes',
      description: 'Acompanhe gastos, estatísticas e receba alertas automáticos'
    },
    {
      icon: Users,
      title: 'Multi-usuário',
      description: 'Suporte para múltiplos usuários e veículos'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">CarCare</h1>
          <p className="text-xl text-slate-200 mb-4">Sistema de Controle de Manutenção Veicular</p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-2">Sistema Profissional</span>
          </div>
        </div>
      </div>

      {/* Sobre o Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-600" />
            Sobre o CarCare
          </CardTitle>
          <CardDescription>
            Controle completo e profissional para gestão de veículos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            O <strong>CarCare</strong> é um sistema completo e moderno para controle de manutenção veicular. 
            Desenvolvido com as mais recentes tecnologias web, oferece uma experiência fluida e intuitiva 
            para gerenciar todos os aspectos relacionados aos seus veículos.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            Com o CarCare você pode cadastrar múltiplos veículos, registrar histórico completo de manutenções, 
            controlar pagamentos de IPVA e licenciamento, organizar serviços por categorias personalizadas, 
            acompanhar gastos e estatísticas, receber alertas de manutenções próximas e muito mais!
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Desenvolvedor */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            Desenvolvido por
          </CardTitle>
          <CardDescription>
            Conheça o criador do CarCare
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Leandro Yata
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Desenvolvedor Full Stack
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {/* WhatsApp/Phone */}
            <a
              href="https://wa.me/5575991902534"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">WhatsApp</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">75 9 9190-2534</div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:leandroyata07@hotmail.com"
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">E-mail</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">leandroyata07@hotmail.com</div>
              </div>
            </a>

            {/* Website */}
            <a
              href="http://www.leandroyata.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Website</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">www.leandroyata.com.br</div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/leandroyata07_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Instagram</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">@leandroyata07_</div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/leandro-oliveira-lima-27140149/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Linkedin className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">LinkedIn</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Leandro Oliveira Lima</div>
              </div>
            </a>
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
            <h4 className="text-xl font-bold mb-2">Precisa de Suporte ou Desenvolvimento?</h4>
            <p className="mb-4 text-blue-100">
              Entre em contato para suporte técnico, customizações ou desenvolvimento de novos projetos
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-100 text-blue-600"
              >
                <a href="https://wa.me/5575991902534" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-gray-100 text-blue-600"
              >
                <a href="mailto:leandroyata07@hotmail.com">
                  <Mail className="h-5 w-5 mr-2" />
                  E-mail
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tecnologias */}
      <Card>
        <CardHeader>
          <CardTitle>Tecnologias Utilizadas</CardTitle>
          <CardDescription>Stack moderno e performático</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'TailwindCSS', 'Vite', 'Zustand', 'React Hook Form', 'Zod', 'Tanstack Router', 'Lucide Icons'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-4">
        <p>CarCare v2.2.8 - © 2026 Leandro Yata</p>
        <p className="mt-1">Todos os direitos reservados</p>
      </div>
    </div>
  )
}
