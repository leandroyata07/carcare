# 🚗 CarCare v3.0 - Sistema Completo de Gestão Veicular

Sistema profissional para gerenciamento de múltiplos veículos, manutenções, IPVA/Licenciamento e usuários.

## 🎉 Novidades da Versão 3.0

### 🚙 Múltiplos Veículos
- Cadastre quantos veículos quiser (carros, motos, caminhões, vans, SUVs)
- Alterne facilmente entre veículos
- Cada veículo mantém seu histórico independente
- Migração automática de dados da v2.0

### 💰 IPVA e Licenciamento
- Controle completo de IPVA e licenciamento anual
- Alertas de vencimento automáticos
- Registro de pagamentos com data, local e método
- Status em tempo real (pago/pendente/atrasado)
- Controle de parcelas e valores separados

### 👥 Gerenciamento de Usuários
- Sistema multi-usuário completo
- Perfis: Administrador e Usuário
- Controle de acesso por perfil
- Adicionar, editar, remover usuários (Admin)
- Redefinição de senhas
- Cada usuário visualiza apenas seus próprios dados

## 📋 Funcionalidades Completas

### Gestão de Veículos
- ✅ CRUD completo (Criar, Ler, Atualizar, Deletar)
- ✅ Tipos: Carro, Moto, Caminhão, Van, SUV, Outros
- ✅ Campos: Tipo, marca, modelo, ano, placa, quilometragem
- ✅ Upload de foto do veículo (256x256px)
- ✅ Seletor rápido de veículos no header
- ✅ Estatísticas por veículo

### Controle de Manutenções
- ✅ Registro detalhado de todas as manutenções
- ✅ Associação automática ao veículo selecionado
- ✅ 12 categorias pré-definidas (customizáveis)
- ✅ Upload de fotos com redimensionamento automático
- ✅ Cálculo automático de custos totais e médios
- ✅ Lembretes de próxima manutenção
- ✅ Histórico filtrado por veículo
- ✅ Campos: tipo, data, km, descrição, local, valor, próxima troca, foto

### Sistema IPVA/Licenciamento
- ✅ Registro de IPVA, Licenciamento ou Ambos
- ✅ Controle por ano
- ✅ Valores separados (IPVA + Licenciamento)
- ✅ Data de vencimento
- ✅ Status automático (Pago, Pendente, Atrasado)
- ✅ Informações de pagamento:
  - Data do pagamento
  - Local/método
  - Observações
- ✅ Dashboard com resumo e alertas
- ✅ Filtro por veículo

### Administração de Usuários
- ✅ Lista completa de usuários (Admin)
- ✅ Adicionar novos usuários
- ✅ Editar informações de usuários
- ✅ Alterar perfil (Admin/Usuário)
- ✅ Redefinir senha
- ✅ Excluir usuários (com proteção)
- ✅ Visualização de último acesso

### Interface e Usabilidade
- ✅ Design moderno e responsivo
- ✅ Navegação intuitiva com menu inferior
- ✅ Notificações em tempo real
- ✅ Sistema de toasts para feedback
- ✅ Modais para formulários
- ✅ Animações suaves
- ✅ Badges de status coloridos
- ✅ Funciona em desktop, tablet e mobile

## 🏗️ Estrutura do Projeto

```
CarCare/
├── index.html                 # Página principal (atualizada v3.0)
├── login.html                 # Tela de autenticação
├── css/
│   └── style.css             # Estilos completos (~1300 linhas)
├── js/
│   ├── app.js                # Lógica principal (~800 linhas)
│   ├── auth.js               # Sistema de autenticação
│   ├── categories.js         # Gestão de categorias
│   ├── vehicles.js           # Gestão de veículos (NOVO v3.0)
│   ├── ipva.js               # IPVA/Licenciamento (NOVO v3.0)
│   └── user-management.js    # Gestão de usuários (NOVO v3.0)
└── docs/
    ├── README.md             # Documentação v2.0
    ├── README_V3.md          # Este arquivo
    ├── GUIA_RAPIDO.md        # Guia de uso
    ├── MELHORIAS.md          # Histórico de versões
    └── INSTALACAO.md         # Instruções de instalação
```

## 🚀 Como Começar

### Instalação Rápida

**Opção 1: Uso Direto (Recomendado)**
1. Baixe todos os arquivos do projeto
2. Abra o arquivo `login.html` diretamente no navegador
3. Não requer instalação de servidor!

**Opção 2: Com Servidor Local**
```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server -p 8000

# Usando PHP
php -S localhost:8000
```
Acesse: `http://localhost:8000/login.html`

### Primeiro Acesso

1. **Login Inicial:**
   - Usuário: `admin`
   - Senha: `admin123`

2. **Cadastrar Primeiro Veículo:**
   - Clique em "Veículos" no menu
   - Clique em "Adicionar Novo Veículo"
   - Preencha os dados
   - Salve

3. **Adicionar Manutenção:**
   - Selecione o veículo (se tiver mais de um)
   - Clique no botão "+" ou "Nova Manutenção"
   - Preencha os detalhes
   - Adicione foto (opcional)
   - Salve

4. **Registrar IPVA:**
   - Selecione o veículo
   - Clique em "IPVA" no card do veículo
   - Adicione registro do ano
   - Preencha valores e vencimento
   - Marque como pago quando efetuar o pagamento

5. **Gerenciar Usuários (Admin):**
   - Vá em Configurações (engrenagem)
   - Selecione "Gerenciar Usuários"
   - Adicione, edite ou remova usuários

## 📱 Navegação

| Botão | Função | Descrição |
|-------|--------|-----------|
| 🏠 Início | Home | Exibe dashboard do veículo atual |
| 🚗 Veículos | Veículos | Lista e gerencia todos os veículos |
| ➕ Adicionar | Add | Adiciona nova manutenção |
| 🏷️ Categorias | Categorias | Gerencia categorias de manutenção |
| ⚙️ Config | Configurações | Alterar senha, backup, usuários |

### Botões do Header

- **Veículos:** Seletor rápido de veículos
- **🔔 Notificações:** Alertas de manutenções e IPVA
- **Usuário:** Informações e logout

## 💾 Armazenamento de Dados

O sistema usa LocalStorage do navegador:

| Chave | Conteúdo |
|-------|----------|
| `users` | Lista de usuários |
| `currentUser` | Sessão ativa |
| `vehicles` | Todos os veículos |
| `currentVehicleId` | Veículo selecionado |
| `manutencoes` | Todas as manutenções |
| `ipva_registros` | Registros de IPVA/Licenciamento |
| `categorias` | Categorias customizadas |

**⚠️ Importante:** Os dados ficam salvos localmente no navegador. Use a função de backup regularmente!

## 🔄 Migração Automática v2.0 → v3.0

Ao abrir a v3.0 pela primeira vez:

1. ✅ Sistema detecta dados da v2.0
2. ✅ Cria um veículo único com os dados antigos
3. ✅ Associa todas as manutenções ao veículo migrado
4. ✅ Adiciona campo `veiculoId` em todas as manutenções
5. ✅ Preserva categorias personalizadas
6. ✅ Mantém histórico intacto

**Nenhuma ação necessária** - a migração é transparente!

## 🔐 Sistema de Segurança

### Autenticação
- ✅ Login obrigatório para acesso
- ✅ Senhas com hash (SHA-256)
- ✅ Sessão persistente
- ✅ Proteção de rotas
- ✅ Logout seguro

### Controle de Acesso
- **Administrador:**
  - Todos os recursos
  - Gerenciamento de usuários
  - Acesso total ao sistema
  
- **Usuário:**
  - Gerenciamento de veículos próprios
  - Registro de manutenções
  - Controle de IPVA
  - Sem acesso à gestão de usuários

## 📊 Estatísticas e Relatórios

### Por Veículo
- Total gasto em manutenções
- Média de custo por km
- Data da última manutenção
- Total de serviços realizados
- Próxima manutenção prevista

### IPVA e Licenciamento
- Valor total do ano
- Status (Pago/Pendente/Atrasado)
- Dias até vencimento
- Histórico de pagamentos
- Alertas automáticos

### Geral
- Total de veículos cadastrados
- Gasto total (todos os veículos)
- Veículo mais econômico
- Veículo com mais manutenções

## 🎨 Personalização

### Categorias
1. Acesse "Categorias" no menu
2. Adicione novas categorias
3. Personalize nome, ícone (FontAwesome) e cor
4. As categorias são compartilhadas entre veículos

### Temas e Cores
Edite as variáveis CSS em `style.css`:
```css
:root {
    --primary: #2563eb;        /* Azul primário */
    --secondary: #10b981;      /* Verde secundário */
    --danger: #ef4444;         /* Vermelho */
    --warning: #f59e0b;        /* Laranja */
    /* Adicione suas cores */
}
```

## 💾 Backup e Restauração

### Fazer Backup

1. Vá em Configurações
2. Selecione "Fazer backup"
3. Arquivo JSON será baixado automaticamente
4. Nomeado como: `backup_carcare_v3_YYYY-MM-DD.json`

O backup inclui:
- Todos os veículos
- Todas as manutenções
- Registros de IPVA
- Categorias personalizadas
- Configurações

### Restaurar Backup

```javascript
// Abra o DevTools (F12) e vá para Console
// 1. Carregue o conteúdo do arquivo backup
const backup = { /* cole o conteúdo do arquivo JSON aqui */ };

// 2. Restaure os dados
localStorage.setItem('vehicles', JSON.stringify(backup.vehicles));
localStorage.setItem('manutencoes', JSON.stringify(backup.manutencoes));
localStorage.setItem('ipva_registros', JSON.stringify(backup.ipva));
localStorage.setItem('categorias', JSON.stringify(backup.categorias));
if (backup.currentVehicleId) {
    localStorage.setItem('currentVehicleId', backup.currentVehicleId);
}

// 3. Recarregue a página
location.reload();
```

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica moderna
- **CSS3:** 
  - Custom Properties (Variáveis CSS)
  - Grid Layout
  - Flexbox
  - Animations e Transitions
  - Responsive Design
- **JavaScript ES6+:**
  - Vanilla JS (sem frameworks)
  - Modules Pattern
  - LocalStorage API
  - FileReader API
  - Canvas API (processamento de imagens)
- **FontAwesome 6.4:** Biblioteca de ícones
- **LocalStorage:** Persistência de dados

## 📱 Responsividade

### Desktop (> 768px)
- Layout completo em grid
- Sidebar de navegação
- Modais centralizados
- Múltiplas colunas

### Mobile (≤ 768px)
- Layout em coluna única
- Navegação em menu inferior fixo
- Modais fullscreen
- Touch-friendly

## 🐛 Troubleshooting

### Dados não salvam
- ✅ Verifique se o navegador permite LocalStorage
- ✅ Não use modo anônimo/privado
- ✅ Limpe o cache se necessário

### Imagens não aparecem
- ✅ Tamanho máximo: 2MB por imagem
- ✅ Formatos: JPG, PNG, GIF, WebP
- ✅ Redimensionamento automático para 256x256px

### Login não funciona
- ✅ Limpe dados do site no navegador
- ✅ Verifique console (F12) para erros
- ✅ Redefinir: delete usuário no LocalStorage

### Migração não funcionou
```javascript
// Forçar migração manual
Vehicles.migrateOldVehicle();
location.reload();
```

### Performance lenta
- Limite recomendado: 500 manutenções por veículo
- Evite fotos muito grandes (use < 500KB)
- Faça backup e limpe dados antigos periodicamente

## 🎯 Casos de Uso

### Pessoa Física - 1 Veículo
- Controle completo do carro pessoal
- Histórico de manutenções
- Alertas de IPVA

### Pessoa Física - Múltiplos Veículos
- Família com carro e moto
- Alternar facilmente entre veículos
- Comparar custos

### Pequena Frota
- Até 10 veículos
- Controle individual
- Gestão de usuários
- Relatórios por veículo

## 📈 Roadmap Futuro

### v3.1 (Próxima versão)
- [ ] Gráficos de custos (Chart.js)
- [ ] Exportar relatórios em PDF
- [ ] Importar dados de CSV/Excel
- [ ] Lembretes por e-mail
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)

### v3.2 (Planejado)
- [ ] Sincronização em nuvem
- [ ] App mobile nativo (React Native)
- [ ] Compartilhamento de veículos
- [ ] Integração com oficinas
- [ ] Orçamentos online
- [ ] Histórico de combustível

### v4.0 (Futuro)
- [ ] Backend com Node.js
- [ ] Banco de dados (MongoDB/PostgreSQL)
- [ ] API REST
- [ ] Multi-tenant
- [ ] Notificações push
- [ ] Inteligência artificial (previsão de custos)

## 📞 Suporte e Documentação

### Documentos Disponíveis
- `README.md` - Documentação v2.0
- `README_V3.md` - Este arquivo (v3.0)
- `GUIA_RAPIDO.md` - Tutorial de uso
- `MELHORIAS.md` - Histórico de versões
- `INSTALACAO.md` - Instalação detalhada

### FAQ

**P: Posso usar em produção?**
R: Sim! O sistema é estável e testado.

**P: Preciso de servidor?**
R: Não! Funciona direto no navegador.

**P: Os dados são seguros?**
R: Sim, ficam no seu navegador. Faça backups!

**P: Funciona offline?**
R: Sim! Após carregar uma vez, funciona sem internet.

**P: Posso personalizar?**
R: Sim! Código aberto e documentado.

## 📄 Licença

Este projeto é de uso livre para fins:
- ✅ Pessoais
- ✅ Educacionais
- ✅ Comerciais (com créditos)

**Atribuição:** Mantenha os créditos ao autor original.

## 🤝 Contribuindo

Contribuições são bem-vindas!

### Como Contribuir
1. Documente a melhoria proposta
2. Teste em Chrome, Firefox e Safari
3. Mantenha o padrão de código
4. Atualize a documentação
5. Envie pull request

### Padrões de Código
- Indentação: 4 espaços
- Comentários em português
- Nomes descritivos de variáveis
- Funções pequenas e focadas

## 🙏 Créditos

**Desenvolvido com ❤️ por:** [Seu Nome]  
**Versão:** 3.0.0  
**Data:** 2024  
**Status:** ✅ Produção

### Agradecimentos
- FontAwesome pela biblioteca de ícones
- Comunidade JavaScript
- Todos os testadores e usuários

---

## 🎉 Conclusão

O **CarCare v3.0** é uma solução completa para gestão veicular, ideal para:
- 👤 Pessoas físicas com 1 ou mais veículos
- 👨‍👩‍👧‍👦 Famílias com frota pequena
- 🏢 Pequenas empresas (até 20 veículos)
- 🎓 Projetos educacionais

**Comece agora e tenha controle total do seu veículo!**

**Download:** [Link para o projeto]  
**Suporte:** [Seu contato]  
**Documentação:** Nesta pasta `/docs`

---

*"Mantenha seu veículo sempre em dia com CarCare!"* 🚗💙
