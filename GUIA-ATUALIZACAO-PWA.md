# Guia de Atualização do Sistema

## ⚠️ IMPORTANTE: Como Forçar Atualização nos Dispositivos dos Usuários

### Problema
Os smartphones dos usuários fazem cache agressivo do PWA. Quando você faz uma atualização, eles continuam vendo a versão antiga.

### Solução Implementada

#### 1. Sistema de Versionamento Automático
Toda vez que fizer uma atualização e enviar para o GitHub, você PRECISA:

**Abrir o arquivo:** `public/service-worker.js`

**Linha 1 - Aumentar a versão:**
```javascript
const CACHE_VERSION = 'v2.1.0'; // AUMENTE ESTE NÚMERO A CADA ATUALIZAÇÃO
```

**Exemplos:**
- Mudança pequena (correção de bug): `v2.1.0` → `v2.1.1`
- Mudança média (nova feature): `v2.1.0` → `v2.2.0`
- Mudança grande (grande feature): `v2.1.0` → `v3.0.0`

#### 2. Como Funciona

1. **Você aumenta a versão** no `service-worker.js`
2. **Faz commit e push** para o GitHub
3. **GitHub Pages atualiza** automaticamente
4. **Usuários abrem o app:**
   - O service worker detecta a nova versão
   - Aparece um card no canto inferior direito: "Nova versão disponível!"
   - Usuário clica em "Atualizar agora"
   - Sistema recarrega com a nova versão
   - Cache antigo é limpo automaticamente

#### 3. Estratégia de Cache

**Network First** - Sempre busca do servidor primeiro:
- HTML, JavaScript, JSON
- Garante que usuários sempre pegam a versão mais recente

**Cache First** - Usa cache primeiro:
- Imagens, ícones
- Melhora performance

### Recursos Implementados

✅ **Detecção automática de atualizações**
- Verifica a cada 30 segundos se há nova versão
- Mostra prompt bonito para o usuário

✅ **Prompt de atualização**
- Card no canto direito com botão "Atualizar agora"
- Usuário pode adiar se quiser

✅ **Limpeza automática de cache**
- Remove versões antigas automaticamente
- Libera espaço no dispositivo

### Expiração de Sessão

✅ **Logout automático após 8 horas**
- Se o usuário ficar inativo por 8 horas, faz logout
- Verifica quando volta ao app (abre a aba/app)
- Verifica a cada 1 minuto enquanto está usando

✅ **Segurança aprimorada**
- Evita que outras pessoas usem o app se deixar aberto
- Requer nova autenticação após expiração

### Checklist de Deploy

Toda vez que fizer uma atualização:

1. ✅ Fazer suas alterações no código
2. ✅ **AUMENTAR versão em `public/service-worker.js`**
3. ✅ Testar localmente (`npm run dev`)
4. ✅ Fazer commit: `git commit -m "feat: descrição da mudança"`
5. ✅ Push: `git push`
6. ✅ Aguardar deploy (1-3 minutos)
7. ✅ Avisar usuários que há atualização disponível

### Para Usuários

**Como atualizar manualmente (se não aparecer o prompt):**

1. **Android Chrome:**
   - Menu (3 pontos) → Configurações → Privacidade
   - Limpar dados de navegação
   - Marcar apenas "Imagens e arquivos em cache"
   - Limpar

2. **iOS Safari:**
   - Configurações → Safari
   - Limpar Histórico e Dados
   - OU: Fechar app e reabrir

3. **Método universal:**
   - Remover o app da tela inicial
   - Abrir no navegador: https://leandroyata07.github.io/carcare/
   - Adicionar novamente à tela inicial

### Troubleshooting

**Problema:** Usuário não vê a atualização
**Solução:** Verificar se aumentou a versão no service-worker.js

**Problema:** Aparece erro ao atualizar
**Solução:** Limpar cache manualmente e recarregar

**Problema:** Sessão expira muito rápido
**Solução:** Aumentar `SESSION_TIMEOUT` em `src/stores/auth-store.ts` (padrão: 8 horas)

### Logs

Para debug, abra DevTools (F12) e veja:
- Console: `[ServiceWorker]` - mensagens do service worker
- Console: `[SessionManager]` - mensagens de sessão
- Application → Service Workers - status do service worker
- Application → Cache Storage - conteúdo do cache

### Versões

- **v2.1.0** - Sistema de atualização automática + expiração de sessão (10/02/2026)
- **v2.0.0** - Notificações completas + próxima troca por data
- **v1.0.0** - Versão inicial do sistema
