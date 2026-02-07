# 🚀 Guia Rápido - CarCare v3.0

## 📋 Início Rápido (5 minutos)

### 1. Primeiro Acesso

1. Abra `login.html` no navegador
2. Use as credenciais padrão:
   - **Usuário:** admin
   - **Senha:** admin123
3. Clique em "Entrar"

### 2. Cadastrar Seu Primeiro Veículo

1. Clique em **"Veículos"** no menu inferior
2. Clique no botão **"Adicionar Novo Veículo"**
3. Preencha os dados:
   - **Tipo:** Selecione (Carro, Moto, etc.)
   - **Marca:** Ex: Toyota
   - **Modelo:** Ex: Corolla
   - **Ano:** Ex: 2020
   - **Placa:** Ex: ABC-1234
   - **Quilometragem:** Ex: 50000
   - **Foto:** (Opcional) Clique e selecione uma imagem
4. Clique em **"Salvar Veículo"**

### 3. Adicionar Primeira Manutenção

1. Certifique-se que seu veículo está selecionado
2. Clique no botão **"+"** (Adicionar) no menu inferior
3. Preencha os dados:
   - **Categoria:** Selecione (ex: Troca de Óleo)
   - **Tipo de Serviço:** Descreva (ex: Troca de óleo 5W30)
   - **Data:** Selecione a data
   - **Quilometragem:** Ex: 50000
   - **Descrição:** (Opcional) Detalhes do serviço
   - **Local/Oficina:** Ex: Auto Center São Paulo
   - **Valor:** Ex: 150.00
   - **Próxima troca em:** (Opcional) Ex: 55000
   - **Foto:** (Opcional) Foto do serviço
4. Clique em **"Salvar Manutenção"**

### 4. Registrar IPVA/Licenciamento

1. Com o veículo selecionado
2. Clique no botão **"IPVA"** no card do veículo
3. Clique em **"Adicionar Registro"**
4. Preencha:
   - **Ano:** Ex: 2024
   - **Tipo:** Selecione (IPVA, Licenciamento ou Ambos)
   - **Valor IPVA:** Ex: 1500.00
   - **Valor Licenciamento:** Ex: 100.00
   - **Data de Vencimento:** Ex: 31/03/2024
   - **Observações:** (Opcional)
5. Clique em **"Salvar"**

### 5. Marcar IPVA como Pago

1. Abra o modal de IPVA
2. Localize o registro do ano
3. Clique em **"Marcar como Pago"**
4. Preencha:
   - **Data do Pagamento:** Quando pagou
   - **Local/Método:** Ex: Banco Itaú - PIX
   - **Observações:** (Opcional) Ex: Pago em 3 parcelas
5. Clique em **"Confirmar Pagamento"**

## 🎯 Funcionalidades Principais

### 🚗 Gerenciar Múltiplos Veículos

**Adicionar Veículo:**
- Menu inferior → Veículos → Adicionar Novo

**Alternar Veículo:**
- Header → Botão "Veículos" → Selecione o veículo

**Editar Veículo:**
- Menu Veículos → Botão "Editar" no card

**Excluir Veículo:**
- Menu Veículos → Botão "Excluir" no card
- ⚠️ Isso excluirá TODAS as manutenções do veículo!

### 🔧 Gerenciar Manutenções

**Adicionar:**
- Botão "+" no menu inferior

**Editar:**
- Clique em "Editar" na manutenção

**Excluir:**
- Clique em "Excluir" na manutenção

**Ver Histórico:**
- Role a página até "Histórico de Manutenções"
- Ou clique em "Início" para voltar ao topo

### 💰 Controle de IPVA

**Adicionar Registro:**
- Card do veículo → Botão "IPVA" → Adicionar

**Marcar como Pago:**
- Modal IPVA → Localizar registro → "Marcar como Pago"

**Ver Status:**
- Status é atualizado automaticamente:
  - **🔴 Atrasado:** Vencimento passou
  - **🟡 Próximo:** Vence em menos de 30 dias
  - **🟢 Pago:** Pagamento registrado
  - **⚪ Pendente:** Ainda tem tempo

### 👥 Gerenciar Usuários (Admin)

**Acessar Gestão:**
- Menu inferior → Config (⚙️) → Opção 3 → Gerenciar usuários

**Adicionar Usuário:**
1. Clique em "Adicionar Usuário"
2. Preencha:
   - Nome completo
   - Nome de usuário (login)
   - Senha inicial
   - Perfil (Admin ou Usuário)
3. Salvar

**Editar Usuário:**
- Clique em "Editar" na linha do usuário
- Altere os dados
- Salvar

**Redefinir Senha:**
- Clique em "Senha" na linha do usuário
- Digite a nova senha
- Confirmar

**Excluir Usuário:**
- Clique em "Excluir"
- Confirme a exclusão
- ⚠️ Você não pode excluir a si mesmo

### 🏷️ Gerenciar Categorias

**Abrir Gestão:**
- Menu inferior → Categorias

**Adicionar Categoria:**
1. Clique em "Nova Categoria"
2. Preencha:
   - Nome (ex: Troca de Filtro)
   - Ícone (código FontAwesome, ex: fa-filter)
   - Cor (hexadecimal, ex: #FF5733)
3. Salvar

**Editar Categoria:**
- Clique no ícone de lápis
- Altere os dados
- Salvar

**Excluir Categoria:**
- Clique no ícone de lixeira
- Confirme

### 🔔 Notificações

**Ver Notificações:**
- Clique no ícone de sino (🔔) no header
- Verá:
  - Manutenções próximas (500 km antes)
  - Manutenções atrasadas
  - IPVA vencendo
  - IPVA atrasado

**Badge de Notificações:**
- Número vermelho no sino indica quantas notificações

### 💾 Backup e Restauração

**Fazer Backup:**
1. Menu Config → Opção 2 → Fazer backup
2. Arquivo JSON será baixado
3. Nome: `backup_carcare_v3_YYYY-MM-DD.json`

**O backup inclui:**
- Todos os veículos
- Todas as manutenções
- Registros de IPVA
- Categorias personalizadas

**Restaurar Backup:**
1. Abra DevTools (F12)
2. Vá para Console
3. Cole o script de restauração (veja MIGRACAO_V3.md)
4. Recarregue a página

### ⚙️ Configurações

**Alterar Senha:**
1. Menu Config → Opção 1
2. Digite senha atual
3. Digite nova senha
4. Confirme nova senha

**Gerenciar Usuários (Admin apenas):**
- Menu Config → Opção 3

**Fazer Backup:**
- Menu Config → Opção 2

## 🔄 Alternar Entre Veículos

### Método 1: Header
1. Clique no botão **"Veículos"** no header
2. Modal abrirá mostrando todos os veículos
3. Clique no veículo desejado
4. Interface atualiza automaticamente

### Método 2: Menu Inferior
1. Clique em **"Veículos"** no menu inferior
2. Mesma lista aparece
3. Selecione o veículo

**Indicador de Veículo Ativo:**
- Veículo selecionado tem um ✓ verde
- Card fica destacado

## 📊 Estatísticas

### No Card do Veículo

- **Placa:** Identificação
- **Ano:** Ano de fabricação
- **Km Atual:** Quilometragem atual
- **Próxima Manutenção:** Baseada em registros

### No Resumo de Custos

- **Total Gasto:** Soma de todas as manutenções
- **Média por Km:** Custo por quilômetro rodado
- **Última Manutenção:** Data do último serviço
- **Total de Serviços:** Quantidade de manutenções

## 💡 Dicas e Truques

### 🎯 Organização

1. **Use Categorias:**
   - Crie categorias específicas para seu tipo de veículo
   - Moto: Lubrificação de corrente, Regulagem de válvulas
   - Carro: Limpeza de ar condicionado, Cambagem

2. **Fotos:**
   - Tire foto da nota fiscal
   - Foto do hodômetro
   - Foto do serviço realizado

3. **Descrições Detalhadas:**
   - Anote marcas e modelos de peças
   - Registre problemas encontrados
   - Nota sobre próxima revisão

### 💰 Controle de Custos

1. **Registre TUDO:**
   - Até pequenas manutenções
   - Lavagens regulares
   - Troca de palhetas

2. **Compare Veículos:**
   - Veja qual carro gasta mais
   - Compare custo/km entre veículos

3. **Planeje Gastos:**
   - Use "Próxima Troca" para estimar custos
   - Acompanhe tendências de gastos

### 🔔 Alertas

1. **Configure Próxima Troca:**
   - Sempre preencha este campo
   - Sistema alertará 500 km antes

2. **IPVA:**
   - Cadastre logo no início do ano
   - Receba alertas 30 dias antes

3. **Verificações Periódicas:**
   - Clique no sino regularmente
   - Não ignore alertas

### 📱 Mobile

1. **Adicione à Tela Inicial:**
   - Chrome: Menu → Adicionar à tela inicial
   - Safari: Compartilhar → Adicionar à Tela de Início

2. **Use em Viagens:**
   - Registre abastecimentos
   - Anote quilometragem
   - Fotos de recibos

## ⚠️ Avisos Importantes

### 🚫 O Que NÃO Fazer

1. **Não use modo anônimo:**
   - Dados não são salvos
   - Você perderá tudo ao fechar

2. **Não limpe dados do navegador:**
   - Faça backup antes
   - Dados ficam no LocalStorage

3. **Não exclua veículo sem pensar:**
   - Todas as manutenções serão perdidas
   - Não há "desfazer"

4. **Não compartilhe login:**
   - Cada pessoa deve ter seu usuário
   - Use gestão de usuários

### ✅ Boas Práticas

1. **Faça backup semanal:**
   - Ou após grandes alterações
   - Guarde em local seguro (Drive, Dropbox)

2. **Use senhas fortes:**
   - Mínimo 6 caracteres
   - Misture letras e números

3. **Organize categorias:**
   - Use cores consistentes
   - Ícones intuitivos

4. **Mantenha atualizado:**
   - Atualize quilometragem
   - Registre manutenções assim que fizer

## 🐛 Problemas Comuns

### "Nenhum veículo cadastrado"
**Solução:** Cadastre um veículo primeiro (Menu Veículos)

### "Selecione um veículo primeiro"
**Solução:** Vá em Veículos e clique em um veículo

### Fotos não aparecem
**Solução:** 
- Verifique tamanho (max 2MB)
- Formatos aceitos: JPG, PNG, GIF, WebP

### Dados sumiram
**Solução:**
- Restaurar backup
- Verificar se está no navegador correto
- Checar se não limpou cache

### Não consigo excluir categoria
**Causa:** Categoria está em uso
**Solução:** Remova manutenções que usam a categoria primeiro

## 📞 Precisa de Ajuda?

### Documentação Completa

- **README_V3.md** - Guia completo da v3.0
- **MIGRACAO_V3.md** - Migração da v2.0
- **IMPLEMENTACAO_V3.md** - Detalhes técnicos
- **GUIA_RAPIDO.md** - Este arquivo

### Debug

Se algo não funciona:
1. Abra DevTools (F12)
2. Vá para Console
3. Procure erros em vermelho
4. Consulte documentação

### Verificar Dados

```javascript
// Cole no Console (F12)
console.log('=== DADOS DO SISTEMA ===');
console.log('Veículos:', localStorage.getItem('vehicles'));
console.log('Veículo Atual:', localStorage.getItem('currentVehicleId'));
console.log('Manutenções:', localStorage.getItem('manutencoes'));
console.log('IPVA:', localStorage.getItem('ipva_registros'));
console.log('Usuários:', localStorage.getItem('users'));
```

## 🎉 Aproveite!

O **CarCare v3.0** está pronto para ajudar você a manter seus veículos sempre em dia!

**Principais benefícios:**
- ✅ Controle completo de múltiplos veículos
- ✅ Histórico detalhado de manutenções
- ✅ Alertas automáticos
- ✅ Controle de IPVA e licenciamento
- ✅ Gestão de usuários
- ✅ Backup completo

**Comece agora e nunca mais esqueça uma manutenção!** 🚗💙

---

**Dúvidas?** Consulte a documentação completa na pasta `/docs`
