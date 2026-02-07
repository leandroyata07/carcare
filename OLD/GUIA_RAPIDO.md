# 🚀 GUIA RÁPIDO - CarCare v2.0

## 📋 Começando

### 1. Acesso ao Sistema
- Abra o arquivo `login.html` no navegador
- Use as credenciais padrão:
  - **Usuário**: admin
  - **Senha**: admin123
- Clique em "Entrar"

### 2. Primeiros Passos

#### Configure seu Veículo
1. Na tela principal, clique em "Editar" no card do veículo
2. Preencha os dados:
   - Marca (ex: Ford)
   - Modelo (ex: Focus)
   - Ano (ex: 2020)
   - Placa (ex: ABC-1234)
   - Quilometragem atual
3. Clique em "Salvar Veículo"

#### Personalize as Categorias
1. Clique no ícone "Categorias" na navegação inferior
2. Visualize as 12 categorias pré-definidas
3. Para adicionar nova categoria:
   - Clique em "Nova Categoria"
   - Preencha nome, cor e ícone
   - Clique em "Salvar"
4. Para editar: clique no ícone de edição
5. Para excluir: clique no ícone de lixeira

#### Registre uma Manutenção
1. Clique em "Nova" ou no botão "+" na navegação inferior
2. Preencha os dados:
   - **Tipo de Serviço**: Nome da manutenção
   - **Categoria**: Selecione da lista
   - **Data**: Quando foi realizada
   - **Quilometragem**: Km no momento da manutenção
   - **Descrição**: Detalhes opcionais
   - **Local/Oficina**: Onde foi feito
   - **Valor**: Quanto custou
   - **Próxima troca em**: Para lembretes (opcional)
   - **Foto**: Anexe uma imagem (será redimensionada automaticamente para 256x256px)
3. Clique em "Salvar Manutenção"

## 🔧 Funcionalidades Principais

### 🔔 Notificações
- Ícone de sino no header
- Badge vermelho com número de alertas
- Clique para ver manutenções próximas ou atrasadas
- Alertas aparecem quando faltam 500km ou menos

### 📊 Resumo de Custos
- **Total Gasto**: Soma de todas as manutenções
- **Média por Km**: Custo dividido pela distância percorrida
- **Última Manutenção**: Data do último serviço
- **Total de Serviços**: Quantidade de manutenções registradas

### ✏️ Editar Manutenção
- Clique no botão "Editar" em qualquer manutenção
- Modifique os dados desejados
- A foto atual será exibida (pode ser alterada)
- Clique em "Salvar Manutenção"

### 🗑️ Excluir Manutenção
- Clique no botão "Excluir" em qualquer manutenção
- Confirme a exclusão
- A manutenção será removida permanentemente

### 💾 Backup dos Dados
1. Clique no botão "Backup" na seção de Resumo de Custos
2. Um arquivo JSON será baixado automaticamente
3. Nome do arquivo: `backup_carcare_AAAA-MM-DD.json`
4. Guarde este arquivo em local seguro

### 📥 Restaurar Backup
- Ainda não implementado na interface
- Para restaurar manualmente:
  1. Abra o Console do navegador (F12)
  2. Use: `localStorage.clear()` para limpar dados
  3. Copie o conteúdo do backup
  4. Atribua aos itens correspondentes do localStorage

## 🎨 Interface

### Navegação Inferior (Bottom Nav)
- **Início**: Rola para o topo da página
- **Histórico**: Rola até a seção de manutenções
- **+**: Abre formulário para nova manutenção
- **Categorias**: Abre gerenciador de categorias

### Header
- **Logo**: Identidade do sistema
- **Notificações**: Ícone de sino com badge
- **Menu do Usuário**: Nome e opção de sair

### Cores das Categorias
Cada categoria tem uma cor única:
- 🟢 Verde: Troca de óleo
- 🔵 Azul: Filtros, Ar Condicionado
- 🔴 Vermelho: Freios, Motor
- 🟣 Roxo: Pneus, Transmissão
- 🟠 Laranja: Suspensão
- 🟡 Amarelo: Sistema Elétrico
- ⚪ Cinza: Outros

## 📸 Trabalhando com Fotos

### Tipos de Arquivo Suportados
- JPG/JPEG
- PNG
- GIF
- WebP
- Qualquer formato de imagem do navegador

### Processo de Upload
1. Clique em "Selecionar foto"
2. Escolha a imagem do seu dispositivo
3. A imagem será automaticamente:
   - Redimensionada para 256x256px
   - Cortada centralmente (mantém proporção)
   - Convertida para JPEG (90% qualidade)
   - Armazenada em base64
4. Preview será exibido imediatamente
5. Ao salvar, a foto fica vinculada à manutenção

### Dicas para Fotos
- Tire fotos claras e focadas
- Prefira fotos em boa iluminação
- Capture detalhes relevantes da manutenção
- Fotos são redimensionadas automaticamente
- Limite: 2MB por arquivo

## 🔐 Segurança

### Alterando Credenciais
Atualmente, o sistema usa um usuário padrão. Para adicionar mais usuários ou alterar a senha:
1. Abra o Console do navegador (F12)
2. Use os métodos do objeto `Auth`:
```javascript
// Criar novo usuário
Auth.createUser('nome_usuario', 'senha', 'Nome Completo');

// Alterar senha do usuário atual
Auth.changePassword('senha_antiga', 'senha_nova');
```

### Logout
- Clique no ícone de saída no header
- Confirme a ação
- Você será redirecionado para a tela de login
- Sessão será encerrada

## 💡 Dicas e Truques

### Organização
- Use categorias para facilitar filtros futuros
- Adicione descrições detalhadas
- Tire fotos de comprovantes e peças
- Registre o local para referência futura

### Manutenções Preventivas
- Configure "Próxima troca" para lembretes
- Observe as notificações regularmente
- Mantenha a quilometragem atualizada

### Controle Financeiro
- Registre todos os valores
- Acompanhe a média por km
- Use as estatísticas para planejamento
- Faça backups mensais

### Performance
- Limite fotos a 10-15 por vez
- Faça limpeza periódica de manutenções antigas
- Exporte backups antes de grandes mudanças

## 🆘 Solução de Problemas

### Dados não aparecem
- Verifique se fez login corretamente
- Limpe o cache do navegador
- Restaure um backup se disponível

### Foto não carrega
- Verifique o tamanho do arquivo (máx 2MB)
- Use formatos comuns (JPG, PNG)
- Tente outro arquivo

### Sistema lento
- Reduza o número de fotos
- Limpe dados antigos
- Use um navegador atualizado
- Feche outras abas

### Esqueci a senha
- Usuário padrão: admin / admin123
- Ou limpe o localStorage para resetar

## 📱 Versão Mobile

O sistema é totalmente responsivo:
- Layout adaptado para telas pequenas
- Botões touch-friendly
- Navegação otimizada
- Formulários simplificados
- Fotos com upload facilitado

## 🎯 Próximos Passos

Depois de dominar o básico:
1. Registre todas as manutenções passadas
2. Configure lembretes de próximas trocas
3. Organize por categorias
4. Tire fotos de comprovantes
5. Faça backups regulares
6. Analise seus gastos mensalmente

---

**Aproveite o CarCare! 🚗💨**

*Mantenha seu veículo sempre em dia!*
