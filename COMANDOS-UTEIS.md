# ⚡ Comandos Úteis - CarCare React

## 🚀 Comandos Principais

### Instalação e Inicialização
\`\`\`bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 🔧 Comandos de Desenvolvimento

### Vite
\`\`\`bash
# Desenvolvimento em outra porta
npm run dev -- --port 3000

# Abrir automaticamente no navegador
npm run dev -- --open

# Expor na rede local
npm run dev -- --host

# Debug mode
npm run dev -- --debug
\`\`\`

### TypeScript
\`\`\`bash
# Verificar tipos (sem build)
npx tsc --noEmit

# Verificar tipos com watch
npx tsc --noEmit --watch

# Gerar arquivos de declaração
npx tsc --declaration --emitDeclarationOnly
\`\`\`

### Linting
\`\`\`bash
# Verificar código
npm run lint

# Verificar e corrigir automaticamente
npm run lint -- --fix

# Verificar apenas arquivos alterados
npm run lint -- --cache
\`\`\`

---

## 📦 Gerenciamento de Dependências

### Instalar Novas Dependências
\`\`\`bash
# Dependência de produção
npm install nome-do-pacote

# Dependência de desenvolvimento
npm install -D nome-do-pacote

# Instalar versão específica
npm install nome-do-pacote@1.2.3

# Atualizar todas as dependências
npm update
\`\`\`

### Remover Dependências
\`\`\`bash
# Remover pacote
npm uninstall nome-do-pacote

# Limpar cache do npm
npm cache clean --force
\`\`\`

### Verificar Dependências
\`\`\`bash
# Listar dependências desatualizadas
npm outdated

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Ver árvore de dependências
npm list --depth=0
\`\`\`

---

## 🎨 Tailwind CSS

### Comandos
\`\`\`bash
# Gerar CSS (já incluído no npm run dev)
npx tailwindcss -i ./src/index.css -o ./dist/output.css

# Watch mode
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch

# Minified
npx tailwindcss -i ./src/index.css -o ./dist/output.css --minify
\`\`\`

### Adicionar Componente ShadCN
\`\`\`bash
# Exemplo: adicionar componente badge
npx shadcn-ui@latest add badge

# Adicionar múltiplos componentes
npx shadcn-ui@latest add badge avatar alert
\`\`\`

---

## 🔍 Debug e Análise

### Análise de Bundle
\`\`\`bash
# Instalar plugin
npm install -D rollup-plugin-visualizer

# Adicionar no vite.config.ts e rodar build
npm run build
\`\`\`

### Source Maps
\`\`\`bash
# Build com source maps
npm run build -- --sourcemap

# Build com inline source maps
npm run build -- --sourcemap=inline
\`\`\`

### Performance
\`\`\`bash
# Build com análise de performance
npm run build -- --profile
\`\`\`

---

## 🧪 Testing (quando implementado)

### Vitest
\`\`\`bash
# Rodar testes
npm run test

# Testes com coverage
npm run test:coverage

# Testes em watch mode
npm run test:watch

# Testes UI
npm run test:ui
\`\`\`

---

## 🔄 Git

### Comandos Comuns
\`\`\`bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "feat: adicionar nova feature"

# Push
git push origin main

# Pull
git pull origin main

# Ver status
git status

# Ver log
git log --oneline
\`\`\`

### Conventional Commits
\`\`\`bash
# Features
git commit -m "feat: adicionar página de veículos"

# Fixes
git commit -m "fix: corrigir validação de placa"

# Refactoring
git commit -m "refactor: melhorar estrutura de stores"

# Documentation
git commit -m "docs: atualizar README"

# Style
git commit -m "style: aplicar formatação"

# Tests
git commit -m "test: adicionar testes de formulário"
\`\`\`

---

## 📁 Gerenciamento de Arquivos

### Criar Estruturas
\`\`\`bash
# Criar múltiplos diretórios
mkdir -p src/components/forms src/components/cards

# Criar arquivo
touch src/components/forms/maintenance-form.tsx

# Copiar componente
cp src/components/forms/vehicle-form.tsx src/components/forms/maintenance-form.tsx
\`\`\`

### Busca e Substituição
\`\`\`bash
# Buscar em arquivos
grep -r "useVehicleStore" src/

# Buscar e contar
grep -r "useVehicleStore" src/ | wc -l

# Buscar e substituir (com sed)
sed -i 's/oldText/newText/g' file.tsx
\`\`\`

---

## 🌐 Servidor de Produção

### Instalar Servidor
\`\`\`bash
# Instalar serve globalmente
npm install -g serve

# Servir build de produção
serve -s dist

# Servir em porta específica
serve -s dist -p 3000
\`\`\`

### Docker (opcional)
\`\`\`dockerfile
# Dockerfile exemplo
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
\`\`\`

\`\`\`bash
# Build Docker
docker build -t carcare-react .

# Rodar container
docker run -p 3000:3000 carcare-react
\`\`\`

---

## 🔐 Environment Variables

### Usar variáveis
\`\`\`bash
# Criar arquivo .env.local
cp .env.example .env.local

# Editar variáveis
# VITE_API_URL=http://localhost:3000
\`\`\`

### Acessar no código
\`\`\`typescript
// Todas as variáveis devem começar com VITE_
const apiUrl = import.meta.env.VITE_API_URL
\`\`\`

---

## 📊 Performance

### Lighthouse
\`\`\`bash
# Instalar lighthouse
npm install -g lighthouse

# Rodar análise
lighthouse http://localhost:5173 --view

# Gerar relatório
lighthouse http://localhost:5173 --output=json --output-path=./report.json
\`\`\`

### Bundle Size
\`\`\`bash
# Ver tamanho do build
npm run build
du -sh dist/

# Analisar arquivos grandes
find dist/ -type f -exec ls -lh {} \; | awk '{print $5, $9}' | sort -hr | head -10
\`\`\`

---

## 🎯 Atalhos VS Code

### Recomendados
\`\`\`
Ctrl+P         → Quick Open
Ctrl+Shift+P   → Command Palette
Ctrl+B         → Toggle Sidebar
Ctrl+J         → Toggle Terminal
Ctrl+\`         → Toggle Terminal
F2             → Rename Symbol
F12            → Go to Definition
Ctrl+Space     → Trigger Suggestions
Ctrl+.         → Quick Fix
\`\`\`

### Extensões Recomendadas
\`\`\`bash
# Instalar extensões via CLI
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension formulahendry.auto-rename-tag
code --install-extension dsznajder.es7-react-js-snippets
\`\`\`

---

## 🚀 Deploy

### Vercel
\`\`\`bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy para produção
netlify deploy --prod
\`\`\`

### GitHub Pages
\`\`\`bash
# Instalar gh-pages
npm install -D gh-pages

# Adicionar scripts no package.json
# "predeploy": "npm run build"
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
\`\`\`

---

## 🔄 Scripts Personalizados

### Adicionar no package.json
\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules",
    "reinstall": "npm run clean && npm install",
    "analyze": "npm run build -- --mode=analyze"
  }
}
\`\`\`

---

## 📝 Notas Importantes

### Performance Tips
- Use `npm ci` em CI/CD (mais rápido que `npm install`)
- Rode `npm prune` para remover dependências não usadas
- Use `npm dedupe` para otimizar árvore de dependências

### Troubleshooting
\`\`\`bash
# Limpar tudo e recomeçar
rm -rf node_modules package-lock.json dist
npm install

# Verificar versão do Node
node --version  # Deve ser 18+

# Verificar versão do npm
npm --version

# Listar variáveis de ambiente
npm run env
\`\`\`

---

**💡 Dica:** Salve este arquivo e use como referência rápida!

**Desenvolvido por Leandro Yata** 🚀
