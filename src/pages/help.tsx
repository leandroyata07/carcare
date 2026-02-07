import { useState } from 'react'
import { 
  Book, 
  Car, 
  Wrench, 
  FileText, 
  Grid, 
  Users, 
  Settings,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Info,
  Play,
  Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface HelpSection {
  id: string
  title: string
  icon: any
  color: string
  bgColor: string
  content: {
    subtitle: string
    description: string
    tips?: string[]
    steps?: string[]
  }[]
}

const helpSections: HelpSection[] = [
  {
    id: 'inicio',
    title: 'Começando',
    icon: Play,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    content: [
      {
        subtitle: 'Bem-vindo ao CarCare!',
        description: 'O CarCare é seu assistente pessoal para controle completo de manutenção veicular. Com ele você pode gerenciar múltiplos veículos, registrar manutenções, controlar pagamentos de IPVA e muito mais.',
        tips: [
          'Faça login com: usuário "admin" e senha "admin123"',
          'Comece cadastrando seu primeiro veículo',
          'Configure categorias personalizadas para suas manutenções',
          'Acompanhe gastos e histórico completo do seu veículo'
        ]
      },
      {
        subtitle: 'Dica de Ouro 💡',
        description: 'Sempre atualize a quilometragem do veículo ao registrar manutenções. Isso permite que o sistema calcule automaticamente quando fazer a próxima manutenção!',
      }
    ]
  },
  {
    id: 'veiculos',
    title: 'Veículos',
    icon: Car,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    content: [
      {
        subtitle: 'Cadastrar Novo Veículo',
        description: 'Registre todos os seus veículos no sistema para controle individual.',
        steps: [
          'Clique no menu "Veículos"',
          'Clique no botão "Novo Veículo"',
          'Preencha os dados: tipo, marca, modelo, ano, placa',
          'Adicione uma foto (opcional)',
          'Informe a quilometragem atual',
          'Clique em "Cadastrar"'
        ],
        tips: [
          'Você pode cadastrar carros, motos, caminhões e mais',
          'A foto será redimensionada automaticamente',
          'Use placas no formato antigo (ABC-1234) ou Mercosul (ABC1D23)',
          'Mantenha a quilometragem sempre atualizada'
        ]
      },
      {
        subtitle: 'Gerenciar Veículos',
        description: 'Edite, exclua ou selecione o veículo ativo para visualizar suas informações.',
        tips: [
          'O veículo selecionado aparece destacado',
          'Dados de manutenção são filtrados por veículo',
          'Você pode ter quantos veículos quiser cadastrados'
        ]
      }
    ]
  },
  {
    id: 'manutencoes',
    title: 'Manutenções',
    icon: Wrench,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    content: [
      {
        subtitle: 'Registrar Manutenção',
        description: 'Mantenha histórico completo de todas as manutenções realizadas.',
        steps: [
          'Selecione o veículo no menu Veículos',
          'Vá em "Manutenções"',
          'Clique em "Nova Manutenção"',
          'Escolha a categoria (troca de óleo, pneus, etc)',
          'Informe data, quilometragem e valor',
          'Adicione descrição e local (opcional)',
          'Defina a próxima troca (opcional)',
          'Anexe foto do serviço (opcional)',
          'Salve o registro'
        ],
        tips: [
          'Use as categorias para organizar diferentes tipos de serviço',
          'Defina "Próxima Troca" para receber alertas',
          'O sistema avisa quando está próximo da manutenção',
          'Fotos ajudam a documentar o serviço realizado'
        ]
      },
      {
        subtitle: 'Acompanhar Manutenções',
        description: 'Visualize histórico, próximas manutenções e estatísticas.',
        tips: [
          'Use os filtros para buscar manutenções específicas',
          'Veja o gráfico de gastos por categoria',
          'Acompanhe a média de gasto por quilômetro',
          'O card "Próximas Manutenções" mostra o que está vencendo'
        ]
      }
    ]
  },
  {
    id: 'ipva',
    title: 'IPVA e Licenciamento',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    content: [
      {
        subtitle: 'Registrar IPVA',
        description: 'Controle pagamentos de IPVA e taxas de licenciamento.',
        steps: [
          'Acesse o menu "IPVA"',
          'Clique em "Novo IPVA"',
          'Informe o ano de referência',
          'Escolha o tipo: IPVA, Licenciamento ou Ambos',
          'Preencha os valores',
          'Defina data de vencimento',
          'Configure parcelamento (se aplicável)',
          'Adicione documentos escaneados (opcional)'
        ],
        tips: [
          'Registre assim que receber o boleto',
          'Configure alertas de vencimento',
          'Guarde fotos dos comprovantes',
          'Acompanhe o histórico anual'
        ]
      },
      {
        subtitle: 'Status de Pagamento',
        description: 'Acompanhe pendências e pagamentos realizados.',
        tips: [
          'Status: Pendente (amarelo), Pago (verde), Atrasado (vermelho)',
          'Atualize o status após cada pagamento',
          'Visualize o total gasto por veículo'
        ]
      }
    ]
  },
  {
    id: 'categorias',
    title: 'Categorias',
    icon: Grid,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    content: [
      {
        subtitle: 'Criar Categorias',
        description: 'Personalize categorias para organizar suas manutenções.',
        steps: [
          'Vá em "Categorias"',
          'Clique em "Nova Categoria"',
          'Escolha um nome descritivo',
          'Selecione uma cor',
          'Escolha um ícone',
          'Salve'
        ],
        tips: [
          'O sistema já vem com categorias padrão',
          'Crie categorias específicas para seus serviços',
          'Use cores para identificação rápida',
          'Não é possível excluir categorias com manutenções'
        ]
      },
      {
        subtitle: 'Exemplos de Categorias',
        description: 'Sugestões: Troca de Óleo, Pneus, Freios, Suspensão, Bateria, Revisão, Ar Condicionado, Alinhamento, Estética, Documentação.',
      }
    ]
  },
  {
    id: 'usuarios',
    title: 'Usuários (Admin)',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    content: [
      {
        subtitle: 'Gerenciar Usuários',
        description: 'Apenas administradores podem criar e gerenciar usuários.',
        steps: [
          'Acesse "Usuários" (apenas admins)',
          'Clique em "Novo Usuário"',
          'Preencha nome, email e username',
          'Defina uma senha',
          'Escolha o papel: Admin ou Usuário',
          'Salve'
        ],
        tips: [
          'Admins têm acesso total ao sistema',
          'Usuários comuns não veem o menu de gerenciamento',
          'Cada usuário tem seus próprios veículos e dados',
          'Não é possível excluir o último administrador'
        ]
      },
      {
        subtitle: 'Alterar Senha',
        description: 'Qualquer usuário pode alterar sua própria senha nas configurações.',
      }
    ]
  },
  {
    id: 'configuracoes',
    title: 'Configurações',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    content: [
      {
        subtitle: 'Personalizar Sistema',
        description: 'Ajuste o sistema de acordo com suas preferências.',
        tips: [
          'Modo Escuro: Alterne entre tema claro e escuro',
          'Notificações: Configure alertas de manutenção',
          'Perfil: Atualize suas informações pessoais',
          'Senha: Altere sua senha de acesso'
        ]
      }
    ]
  }
]

export function HelpPage() {
  const [openSection, setOpenSection] = useState<string>('inicio')
  const [searchTerm, setSearchTerm] = useState('')

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? '' : sectionId)
  }

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.some(c => 
      c.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Book className="h-12 w-12" />
          <div>
            <h1 className="text-3xl font-bold">Manual do Usuário</h1>
            <p className="text-slate-200">Aprenda a usar todos os recursos do CarCare</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar no manual..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Quick Tips Card */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
            <Lightbulb className="h-5 w-5" />
            Dicas Rápidas para Iniciantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900 dark:text-yellow-300">
              <strong>Primeiro passo:</strong> Cadastre seu veículo antes de registrar manutenções
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900 dark:text-yellow-300">
              <strong>Mantenha atualizado:</strong> Sempre informe a quilometragem atual nas manutenções
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900 dark:text-yellow-300">
              <strong>Use categorias:</strong> Organize suas manutenções por tipo de serviço
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-900 dark:text-yellow-300">
              <strong>Configure alertas:</strong> Defina "Próxima Troca" para receber notificações
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Help Sections */}
      <div className="space-y-4">
        {filteredSections.map((section) => {
          const Icon = section.icon
          const isOpen = openSection === section.id

          return (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "w-full text-left p-6 transition-colors",
                  section.bgColor,
                  "hover:opacity-80"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm", section.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-6 w-6 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-6 w-6 text-gray-500" />
                  )}
                </div>
              </button>

              {isOpen && (
                <CardContent className="pt-6 space-y-6">
                  {section.content.map((item, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.description}
                      </p>

                      {item.steps && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Passo a passo:
                          </h4>
                          <ol className="space-y-2">
                            {item.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                                  {stepIndex + 1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {item.tips && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
                          <h4 className="font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Dicas:
                          </h4>
                          <ul className="space-y-1">
                            {item.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {index < section.content.length - 1 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {filteredSections.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum resultado encontrado para "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
