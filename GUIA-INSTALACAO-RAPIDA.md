# 🚀 Guia Rápido de Instalação e Uso - CarCare React

## 📋 Pré-requisitos

- **Node.js 18+** (baixe em https://nodejs.org/)
- **npm** (incluído com Node.js)

## 🔧 Instalação em 3 Passos

### 1️⃣ Instalar Dependências

Abra o terminal na pasta do projeto e execute:

\`\`\`bash
npm install
\`\`\`

Aguarde alguns minutos enquanto todas as dependências são baixadas (~200MB).

### 2️⃣ Iniciar o Servidor de Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Você verá algo como:

\`\`\`
  VITE v5.0.10  ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
\`\`\`

### 3️⃣ Acessar a Aplicação

Abra seu navegador e acesse: **http://localhost:5173**

## 🔑 Primeiro Acesso

Use as credenciais padrão:
- **Usuário:** `admin`
- **Senha:** `admin123`

## 📦 Comandos Úteis

\`\`\`bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Gera build de produção (pasta dist/)
npm run preview          # Preview do build de produção

# Code Quality
npm run lint             # Verifica erros de código
\`\`\`

## 🎯 Primeiros Passos no Sistema

### 1. Login
- Acesse a tela de login
- Use `admin` / `admin123`
- Clique em "Entrar"

### 2. Cadastrar Primeiro Veículo
- No menu lateral, clique em "Veículos"
- Clique no botão "+ Adicionar Veículo"
- Preencha os dados:
  - Tipo (carro, moto, etc.)
  - Marca
  - Modelo
  - Ano
  - Placa (formato: ABC-1234)
  - Quilometragem atual
  - Foto (opcional)
- Clique em "Salvar"

### 3. Adicionar Manutenção
- No menu lateral, clique em "Manutenções"
- Clique em "+ Nova Manutenção"
- Preencha os campos:
  - Categoria
  - Tipo de serviço
  - Data
  - Quilometragem
  - Descrição
  - Local/Oficina
  - Valor
  - Próxima troca (opcional)
  - Foto (opcional)
- Clique em "Salvar"

### 4. Registrar IPVA
- No menu lateral, clique em "IPVA"
- Clique em "+ Novo IPVA"
- Preencha:
  - Ano
  - Valor do IPVA
  - Valor do Licenciamento
  - Data de vencimento
  - Status
- Clique em "Salvar"

## 🎨 Recursos da Interface

### Dark Mode
- Clique no ícone 🌙/☀️ no canto superior direito
- A preferência é salva automaticamente

### Notificações
- Clique no ícone 🔔 para ver alertas
- Mostra manutenções próximas e IPVA a vencer

### Menu de Usuário
- Clique no ícone 👤 para:
  - Acessar Configurações
  - Fazer Logout

### Navegação Lateral
- Dashboard: Visão geral
- Veículos: Gerencie seus veículos
- Manutenções: Histórico de manutenções
- IPVA: Controle de IPVA
- Categorias: Personalize categorias
- Usuários: Gestão de usuários (apenas Admin)

## 🔧 Solução de Problemas

### Erro ao instalar dependências
\`\`\`bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Porta 5173 já está em uso
\`\`\`bash
# Use outra porta
npm run dev -- --port 3000
\`\`\`

### Erro de TypeScript
\`\`\`bash
# Reconstrua o projeto
npm run build
\`\`\`

## 📱 Dispositivos Suportados

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablet
- ✅ Mobile (iOS, Android)

## 🌐 Navegadores Suportados

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (não suportado)

## 💾 Armazenamento de Dados

Os dados são salvos automaticamente no **LocalStorage** do navegador:
- Não é necessário banco de dados
- Dados persistem entre sessões
- Limitado a ~10MB por domínio

### Backup de Dados
1. Vá em "Configurações"
2. Clique em "Exportar Dados"
3. Salve o arquivo JSON
4. Para restaurar, use "Importar Dados"

## 🎓 Dicas de Uso

1. **Mantenha atualizado**: Sempre atualize a quilometragem do veículo
2. **Use fotos**: Adicione fotos às manutenções para referência futura
3. **Categorias**: Crie categorias personalizadas para organizar melhor
4. **IPVA**: Cadastre assim que receber o boleto para não esquecer
5. **Backup**: Faça backup regular dos dados (exportar JSON)

## ⚡ Performance

Para melhor desempenho:
- Use navegadores modernos
- Evite armazenar muitas fotos (max 256x256px)
- Faça limpeza periódica de dados antigos

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte o README-REACT.md
2. Verifique os logs do console (F12)
3. Entre em contato com o desenvolvedor

---

**Desenvolvido por Leandro Yata** 🚀
