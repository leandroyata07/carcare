# 🚀 Guia de Deploy - GitHub Pages

## ✅ O que foi configurado

O sistema **AutoLar** agora está pronto para deploy automático no GitHub Pages!

### 📋 Configurações realizadas:

1. **Base Path** (`vite.config.ts`): Configurado para `/carcare/`
2. **GitHub Actions** (`.github/workflows/deploy.yml`): Deploy automático
3. **Arquivo .nojekyll** (`public/.nojekyll`): Evita processamento Jekyll
4. **Scripts de build** (`package.json`): Comandos otimizados

---

## 🔧 Configuração no GitHub (Faça isso AGORA)

### **Passo 1: Configurar GitHub Pages**

1. Vá em seu repositório: `https://github.com/SEU-USUARIO/carcare`
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source** (Fonte), selecione:
   - **GitHub Actions** (NÃO mais "Deploy from a branch")
5. Salve

### **Passo 2: Fazer Push das Alterações**

No terminal, execute:

```bash
git add .
git commit -m "Configurar deploy automático para GitHub Pages"
git push origin main
```

### **Passo 3: Aguardar Deploy**

1. Vá em **Actions** no repositório
2. Você verá um workflow rodando chamado "Deploy to GitHub Pages"
3. Aguarde finalizar (leva ~2-3 minutos)
4. Quando aparecer ✅ verde, está pronto!

### **Passo 4: Acessar o Sistema**

Acesse: `https://SEU-USUARIO.github.io/carcare/`

---

## 🎯 Como Funciona

### Deploy Automático
Toda vez que você fizer `git push` na branch `main`:
1. GitHub Actions detecta a mudança
2. Instala dependências (`npm ci`)
3. Builda o projeto (`npm run build`)
4. Faz deploy automático da pasta `dist/`
5. Sistema fica disponível em minutos!

### Arquivos Importantes

- **`.github/workflows/deploy.yml`**: Configuração do deploy automático
- **`vite.config.ts`**: Base path `/carcare/` para URLs corretas
- **`public/.nojekyll`**: Evita que GitHub tente processar como Jekyll

---

## 🐛 Resolução de Problemas

### Tela branca após deploy?

**1. Verifique se configurou GitHub Actions:**
   - Settings → Pages → Source = **GitHub Actions**

**2. Aguarde o workflow finalizar:**
   - Ações → Deploy to GitHub Pages → Deve estar ✅

**3. Limpe cache do navegador:**
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

### Workflow falhou?

Execute localmente para testar:
```bash
npm install
npm run build
```

Se der erro, corrija antes de fazer push.

### CSS/JS não carregam?

Isso foi resolvido com o `base: '/carcare/'` no Vite!

---

## 🔄 Deploy Manual (Alternativa)

Se preferir deploy manual sem GitHub Actions:

```bash
# 1. Instale gh-pages
npm install -D gh-pages

# 2. Build e deploy
npm run deploy
```

Depois configure:
- Settings → Pages → Source: **gh-pages branch**

---

## 📝 Manutenção Futura

### Atualizar o sistema:
1. Faça suas alterações
2. Teste localmente: `npm run dev`
3. Commit e push: `git push origin main`
4. Deploy automático acontece!

### Testar antes do deploy:
```bash
npm run build
npm run preview
```

Abre preview local em `http://localhost:4173`

---

## ✨ Próximos Passos

Após o deploy funcionar:

1. **Adicione domínio customizado** (opcional)
   - Settings → Pages → Custom domain
   - Ex: `autolar.meusistema.com.br`

2. **Configure variáveis de ambiente** (se necessário)
   - Para APIs externas
   - Criar arquivo `.env.production`

3. **Monitore analytics** (opcional)
   - Google Analytics
   - Vercel Analytics

---

## 🎉 Resultado Final

Seu sistema estará disponível em:
**`https://SEU-USUARIO.github.io/carcare/`**

Deploy automático toda vez que fizer push! 🚀

---

**Última atualização:** 07/02/2026
