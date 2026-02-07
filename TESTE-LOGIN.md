# 🔐 Guia de Teste - Tela de Login

## ✅ O que foi configurado:

1. **Rota inicial sempre verifica autenticação**
   - Se não estiver logado → redireciona para `/login`
   - Se já estiver logado → vai para dashboard

2. **Proteção de rotas**
   - Todas as rotas do dashboard verificam autenticação
   - Login verifica se já está autenticado (evita ver login estando logado)

---

## 🧪 Como Testar o Fluxo de Login

### Opção 1: Limpar dados pelo DevTools (Recomendado)
1. Abra o navegador (Chrome/Edge/Firefox)
2. Pressione `F12` ou `Ctrl+Shift+I`
3. Vá na aba **Application** (ou **Armazenamento**)
4. Clique em **Local Storage** → selecione seu domínio
5. Delete as chaves:
   - `carcare-auth`
   - `carcare-vehicles`
   - `carcare-maintenances`
   - (ou clique em "Clear All")
6. Recarregue a página (`F5`)

### Opção 2: Console JavaScript (Rápido)
1. Abra o DevTools (`F12`)
2. Vá na aba **Console**
3. Digite e pressione Enter:
```javascript
localStorage.clear()
location.reload()
```

### Opção 3: Navegação Anônima
- Chrome/Edge: `Ctrl+Shift+N`
- Firefox: `Ctrl+Shift+P`
- Sempre abre "limpo" sem dados salvos

---

## 🎯 Fluxo Esperado

### 1. Primeira Vez / Sem Login:
```
Acessa http://localhost:5173/
         ↓
   Redireciona para /login
         ↓
    Tela de Login aparece
```

### 2. Após Fazer Login:
```
Faz login com sucesso
         ↓
   Redireciona para /
         ↓
    Dashboard aparece
         ↓
  Dados salvos no localStorage
```

### 3. Próxima Visita (com sessão):
```
Acessa http://localhost:5173/
         ↓
  Verifica localStorage
         ↓
   Encontra sessão ativa
         ↓
   Vai direto pro Dashboard
```

### 4. Após Fazer Logout:
```
Clica em "Sair"
         ↓
  Limpa sessão do localStorage
         ↓
   Redireciona para /login
         ↓
  Precisa logar novamente
```

---

## 🔑 Credenciais Padrão

**Usuário:** `admin`  
**Senha:** `admin123`

---

## ⚡ Atalho Rápido para Testes

Adicione este bookmark no seu navegador para limpar e recarregar:

```javascript
javascript:(function(){localStorage.clear();location.reload();})()
```

**Como usar:**
1. Crie um novo bookmark/favorito
2. Cole o código acima no campo URL
3. Nomeie como "🔄 Limpar CarCare"
4. Clique nele sempre que quiser testar o login do zero
