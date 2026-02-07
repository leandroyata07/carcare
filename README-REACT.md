# 🚗 CarCare React - Sistema de Controle de Manutenção Veicular

Aplicação moderna desenvolvida com **React**, **TypeScript**, **Zod**, **ShadCN**, **Lucide React**, **React Hook Form**, **Tanstack Router** e **Zustand**.

## 🎯 Tecnologias e Melhores Práticas

### Stack Principal
- ⚛️ **React 18** - Biblioteca UI
- 📘 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool ultra-rápido
- 🎨 **Tailwind CSS** - Utility-first CSS

### Validação e Formulários
- ✅ **Zod** - Schema validation
- 📝 **React Hook Form** - Gerenciamento de formulários
- 🔗 **@hookform/resolvers** - Integração Zod + React Hook Form

### Roteamento e Estado
- 🛣️ **Tanstack Router** - Type-safe routing
- 🐻 **Zustand** - State management
- 💾 **Zustand Persist** - Persistência em LocalStorage

### UI Components
- 🎨 **ShadCN/ui** - Componentes acessíveis com Radix UI
- 🎭 **Lucide React** - Ícones modernos
- 🌈 **Class Variance Authority** - Variantes de componentes
- 🎯 **Tailwind Merge** - Merge de classes CSS

## ✨ Funcionalidades

### 🔐 Autenticação
- Login seguro com validação Zod
- Gerenciamento de sessão com Zustand
- Proteção de rotas com Tanstack Router
- Usuário padrão: `admin` / `admin123`

### 🚘 Gerenciamento de Veículos
- Cadastro de múltiplos veículos (carro, moto, caminhão, van, SUV)
- Upload e redimensionamento de fotos (256x256px)
- Controle de quilometragem
- Alternância entre veículos

### 🔧 Manutenções
- CRUD completo com React Hook Form
- Validação de formulários com Zod
- Categorias personalizáveis
- Upload de fotos
- Histórico completo

### 💰 IPVA e Licenciamento
- Controle por ano e veículo
- Status automático (Pago, Pendente, Atrasado)
- Alertas de vencimento
- Dashboard com estatísticas

### 👥 Gerenciamento de Usuários (Admin)
- Interface administrativa
- Criação e edição de usuários
- Controle de permissões (Admin/Usuário)
- Redefinição de senhas

### 🌙 Modo Escuro
- Toggle automático
- Persistência de preferência
- Tema completo dark/light

### 🔔 Sistema de Notificações
- Alertas de manutenções próximas
- Alertas de IPVA
- Badge com contador
- Toast notifications

## 📂 Estrutura do Projeto

\`\`\`
src/
├── components/
│   ├── layouts/
│   │   ├── root-layout.tsx       # Layout raiz com dark mode
│   │   ├── auth-layout.tsx       # Layout de autenticação
│   │   └── dashboard-layout.tsx  # Layout principal com sidebar
│   └── ui/                        # Componentes ShadCN
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       ├── toast.tsx
│       └── ...
├── hooks/
│   └── use-toast.ts              # Hook de notificações
├── lib/
│   ├── constants.ts              # Constantes da aplicação
│   ├── schemas.ts                # Schemas Zod
│   └── utils.ts                  # Funções utilitárias
├── pages/
│   ├── login.tsx                 # Página de login
│   ├── dashboard.tsx             # Dashboard principal
│   ├── vehicles.tsx              # Gestão de veículos
│   ├── maintenances.tsx          # Gestão de manutenções
│   ├── ipva.tsx                  # Gestão de IPVA
│   ├── categories.tsx            # Gestão de categorias
│   ├── users.tsx                 # Gestão de usuários
│   └── settings.tsx              # Configurações
├── stores/
│   ├── auth-store.ts             # Estado de autenticação
│   ├── vehicle-store.ts          # Estado de veículos
│   ├── maintenance-store.ts      # Estado de manutenções
│   ├── ipva-store.ts             # Estado de IPVA
│   ├── category-store.ts         # Estado de categorias
│   └── settings-store.ts         # Estado de configurações
├── router.tsx                    # Configuração de rotas
├── main.tsx                      # Entry point
└── index.css                     # Estilos globais + Tailwind
\`\`\`

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

\`\`\`bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
\`\`\`

A aplicação estará disponível em: \`http://localhost:5173\`

## 🎨 Padrões de Código

### Schemas Zod
Todos os formulários usam validação Zod:

\`\`\`typescript
import { z } from 'zod'

export const vehicleFormSchema = z.object({
  brand: z.string().min(2, 'Marca deve ter no mínimo 2 caracteres'),
  model: z.string().min(2, 'Modelo deve ter no mínimo 2 caracteres'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  // ...
})
\`\`\`

### React Hook Form
Integração com Zod usando \`@hookform/resolvers\`:

\`\`\`typescript
const form = useForm<VehicleForm>({
  resolver: zodResolver(vehicleFormSchema),
  defaultValues: { /* ... */ }
})

const onSubmit = (data: VehicleForm) => {
  // data é type-safe e validado
}
\`\`\`

### Zustand Stores
State management com persistência:

\`\`\`typescript
export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      addVehicle: (data) => { /* ... */ },
      // ...
    }),
    { name: 'carcare-vehicles' }
  )
)
\`\`\`

### Tanstack Router
Rotas type-safe com proteção:

\`\`\`typescript
const usersRoute = createRoute({
  path: '/users',
  component: UsersPage,
  beforeLoad: () => {
    const { currentUser } = useAuthStore.getState()
    if (currentUser?.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  }
})
\`\`\`

### ShadCN Components
Componentes acessíveis com Radix UI:

\`\`\`typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
    </DialogHeader>
    {/* Conteúdo */}
  </DialogContent>
</Dialog>
\`\`\`

## 🔧 Funcionalidades Técnicas

### Validação de Dados
- Schemas Zod para todos os formulários
- Validação client-side instantânea
- Mensagens de erro personalizadas
- Type safety completo

### Gerenciamento de Estado
- Zustand para estado global
- Persistência automática em LocalStorage
- Actions type-safe
- Computed values

### Roteamento
- File-based routing com Tanstack Router
- Type-safe navigation
- Route guards
- Lazy loading

### UI/UX
- Design system consistente com ShadCN
- Dark mode completo
- Animações suaves
- Responsivo (mobile-first)
- Acessibilidade (a11y)

## 📦 Dependências Principais

\`\`\`json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "@tanstack/react-router": "^1.14.0",
    "zustand": "^4.5.0",
    "lucide-react": "^0.309.0",
    "@radix-ui/react-*": "^1.0+",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss": "^3.4.1"
  }
}
\`\`\`

## 🎓 Conceitos Aplicados

1. **Separation of Concerns**: Separação clara entre lógica, UI e estado
2. **Type Safety**: TypeScript + Zod para segurança de tipos
3. **Component Composition**: Componentes reutilizáveis e compostos
4. **Controlled Components**: Formulários controlados com React Hook Form
5. **Immutable State**: Estado imutável com Zustand
6. **Responsive Design**: Mobile-first com Tailwind CSS
7. **Accessibility**: Componentes acessíveis com Radix UI
8. **Performance**: Code splitting e lazy loading

## 👨‍💻 Desenvolvedor

**Leandro Yata**
- Full Stack Developer
- Especialista em React, TypeScript e Arquitetura Frontend

## 📄 Licença

MIT License - Livre para uso pessoal e comercial

---

Desenvolvido com ❤️ usando as melhores práticas de React e TypeScript
