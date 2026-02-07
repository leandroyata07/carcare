# 📦 INSTALAÇÃO E USO - CarCare v2.0

## 🎯 Requisitos

### Navegador
- Google Chrome 90+ (Recomendado)
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+
- Opera 76+

### Sistema Operacional
- Windows 7 ou superior
- macOS 10.13 ou superior
- Linux (qualquer distribuição moderna)
- Android 7.0+ (navegador Chrome ou Firefox)
- iOS 12+ (Safari)

### Conexão
- Internet necessária apenas para:
  - Carregar ícones FontAwesome (primeira vez)
  - Após carregar, funciona 100% offline

## 📥 Instalação

### Opção 1: Download Direto
1. Os arquivos já estão na pasta: `D:\Desktop\Sisteminhas\CarCare`
2. Não é necessário instalar nada
3. Abra o arquivo `login.html` no navegador
4. Pronto para usar!

### Opção 2: Servidor Local (Opcional)
Se preferir usar um servidor local:

#### Python
```bash
cd D:\Desktop\Sisteminhas\CarCare
python -m http.server 8000
```
Acesse: http://localhost:8000/login.html

#### Node.js (http-server)
```bash
cd D:\Desktop\Sisteminhas\CarCare
npx http-server -p 8000
```
Acesse: http://localhost:8000/login.html

#### PHP
```bash
cd D:\Desktop\Sisteminhas\CarCare
php -S localhost:8000
```
Acesse: http://localhost:8000/login.html

**Nota**: Servidor local é opcional. O sistema funciona perfeitamente abrindo o arquivo HTML diretamente.

## 🚀 Primeiro Acesso

### Passo 1: Abrir o Sistema
1. Navegue até: `D:\Desktop\Sisteminhas\CarCare`
2. Clique duas vezes em `login.html`
3. O arquivo abrirá no navegador padrão

### Passo 2: Fazer Login
- **Usuário**: `admin`
- **Senha**: `admin123`
- Clique em "Entrar"

### Passo 3: Configurar Veículo
1. Na página principal, clique em "Editar" no card do veículo
2. Preencha os dados do seu veículo
3. Clique em "Salvar Veículo"

### Passo 4: Adicionar Primeira Manutenção
1. Clique no botão "Nova" ou no ícone "+" na navegação
2. Preencha os dados da manutenção
3. (Opcional) Adicione uma foto
4. Clique em "Salvar Manutenção"

## 📂 Estrutura de Arquivos

```
CarCare/
│
├── index.html              # Página principal (após login)
├── login.html              # Página de login (iniciar por aqui)
│
├── css/
│   └── style.css          # Estilos do sistema
│
├── js/
│   ├── app.js             # Lógica principal
│   ├── auth.js            # Sistema de autenticação
│   └── categories.js      # Gerenciamento de categorias
│
├── README.md              # Documentação completa
├── GUIA_RAPIDO.md        # Guia de uso rápido
├── MELHORIAS.md          # Lista de melhorias implementadas
├── exemplo_dados.json    # Dados de exemplo para testes
└── INSTALACAO.md         # Este arquivo
```

## 🔧 Configuração Inicial

### 1. Criar Novo Usuário (Opcional)
Abra o Console do navegador (F12) e execute:

```javascript
Auth.createUser('seu_usuario', 'sua_senha', 'Seu Nome');
```

### 2. Importar Dados de Exemplo
Para testar com dados pré-carregados:

1. Abra o Console (F12)
2. Cole o conteúdo de `exemplo_dados.json`
3. Execute:
```javascript
// Copie o conteúdo do arquivo exemplo_dados.json
const dados = { /* conteúdo aqui */ };

localStorage.setItem('carCareVeiculo', JSON.stringify(dados.veiculo));
localStorage.setItem('carCareManutencoes', JSON.stringify(dados.manutencoes));
localStorage.setItem('carCareCategorias', JSON.stringify(dados.categorias));

// Recarregue a página
location.reload();
```

### 3. Personalizar Categorias
1. Acesse o sistema
2. Clique em "Categorias" na navegação inferior
3. Adicione, edite ou remova categorias conforme necessário

## 💾 Backup e Segurança

### Fazer Backup
1. Clique no botão "Backup" na seção de Resumo de Custos
2. Um arquivo JSON será baixado automaticamente
3. Salve em local seguro (ex: Google Drive, OneDrive, pendrive)

### Restaurar Backup
**Método Console:**
1. Abra o Console (F12)
2. Limpe os dados atuais: `localStorage.clear()`
3. Abra o arquivo de backup em um editor de texto
4. Copie o conteúdo JSON
5. Execute no console:
```javascript
const backup = /* cole o JSON aqui */;

localStorage.setItem('carCareVeiculo', JSON.stringify(backup.veiculo));
localStorage.setItem('carCareManutencoes', JSON.stringify(backup.manutencoes));
localStorage.setItem('carCareCategorias', JSON.stringify(backup.categorias));

location.reload();
```

### Recomendações de Backup
- Faça backup semanalmente
- Mantenha múltiplas cópias
- Teste a restauração periodicamente
- Use nuvem para backups automáticos

## 🔒 Gerenciamento de Usuários

### Alterar Senha
No Console (F12):
```javascript
Auth.changePassword('senha_antiga', 'senha_nova');
```

### Adicionar Novos Usuários
No Console (F12):
```javascript
Auth.createUser('nome_usuario', 'senha', 'Nome Completo');
```

### Remover Usuário
No Console (F12):
```javascript
// Listar usuários
const users = Auth.getUsers();
console.log(users);

// Remover usuário específico
const users = Auth.getUsers();
const updatedUsers = users.filter(u => u.id !== ID_DO_USUARIO);
Auth.saveUsers(updatedUsers);
```

### Resetar Sistema (Limpar Tudo)
No Console (F12):
```javascript
// ATENÇÃO: Isso apagará TODOS os dados!
localStorage.clear();
location.reload();
```

## 📱 Uso em Dispositivos Móveis

### Android
1. Abra o Chrome ou Firefox
2. Navegue até o arquivo ou use servidor local
3. Adicione à tela inicial para acesso rápido:
   - Menu (⋮) → "Adicionar à tela inicial"
4. Use como aplicativo!

### iOS
1. Abra o Safari
2. Navegue até o arquivo ou use servidor local
3. Toque no ícone de compartilhar
4. Selecione "Adicionar à Tela de Início"
5. Use como aplicativo!

### Dicas Mobile
- Gire o dispositivo para melhor visualização
- Use zoom quando necessário
- Aproveite a câmera para fotos das manutenções
- Sincronize backups na nuvem

## 🆘 Solução de Problemas

### Sistema não carrega
**Problema**: Página em branco
**Solução**:
1. Verifique se o JavaScript está habilitado
2. Tente outro navegador
3. Abra o Console (F12) e verifique erros
4. Limpe o cache: Ctrl+Shift+Delete

### Não consigo fazer login
**Problema**: Credenciais não funcionam
**Solução**:
1. Use: `admin` / `admin123`
2. Verifique se não há espaços extras
3. Teste em modo anônimo do navegador
4. Resetar sistema: `localStorage.clear()` no Console

### Dados sumiram
**Problema**: Manutenções desapareceram
**Solução**:
1. Verifique se não limpou o cache do navegador
2. Restaure o backup mais recente
3. Verifique se está usando o mesmo navegador
4. Dados são por navegador e por perfil

### Foto não aparece
**Problema**: Imagem não é exibida
**Solução**:
1. Verifique o tamanho (máx 2MB)
2. Use formatos comuns (JPG, PNG)
3. Tire nova foto se necessário
4. Verifique se o LocalStorage não está cheio

### Sistema está lento
**Problema**: Demora para carregar
**Solução**:
1. Reduza o número de fotos
2. Faça backup e limpe dados antigos
3. Use navegador atualizado
4. Feche outras abas
5. Reinicie o navegador

### Não consigo fazer backup
**Problema**: Download não inicia
**Solução**:
1. Verifique permissões de download do navegador
2. Desative bloqueadores de popup
3. Tente outro navegador
4. Copie os dados manualmente do Console

## 🔄 Atualização do Sistema

### Quando há Nova Versão
1. Faça backup dos dados atuais
2. Substitua os arquivos antigos pelos novos
3. Abra o sistema
4. Seus dados serão preservados (ficam no navegador)

### Migração de Versões
- v1.0 → v2.0: Dados são compatíveis
- Backup e restauração preservam tudo
- Categorias serão criadas automaticamente

## 🎓 Aprendizado

### Para Desenvolvedores
Este projeto é excelente para aprender:
- JavaScript Vanilla puro
- LocalStorage API
- FileReader e Canvas API
- CSS moderno (Grid, Flexbox, Variáveis)
- Estruturação de projetos front-end
- Manipulação do DOM
- Event handling
- Modularização de código

### Customização
Sinta-se livre para modificar:
- Cores no arquivo `css/style.css`
- Adicionar novos campos nas manutenções
- Criar novos relatórios
- Adicionar gráficos
- Integrar com APIs externas

## 📞 Suporte

### Recursos Disponíveis
- `README.md`: Documentação completa
- `GUIA_RAPIDO.md`: Início rápido
- `MELHORIAS.md`: Histórico de mudanças
- Código comentado nos arquivos JS

### Debugging
1. Abra o Console (F12)
2. Vá para a aba "Console"
3. Verifique mensagens de erro
4. Use `console.log()` para debug

### Verificar Dados
No Console (F12):
```javascript
// Ver dados do veículo
console.log(JSON.parse(localStorage.getItem('carCareVeiculo')));

// Ver manutenções
console.log(JSON.parse(localStorage.getItem('carCareManutencoes')));

// Ver categorias
console.log(JSON.parse(localStorage.getItem('carCareCategorias')));

// Ver usuários
console.log(JSON.parse(localStorage.getItem('carCareUsers')));
```

## ✅ Checklist Pós-Instalação

- [ ] Sistema abre corretamente
- [ ] Login funciona
- [ ] Dados do veículo salvam
- [ ] Manutenções são registradas
- [ ] Fotos são carregadas
- [ ] Categorias são editáveis
- [ ] Notificações aparecem
- [ ] Backup é gerado
- [ ] Sistema é responsivo
- [ ] Navegação funciona

## 🎉 Pronto!

Seu sistema CarCare v2.0 está instalado e funcionando!

**Próximos passos:**
1. Configure seu veículo
2. Personalize as categorias
3. Registre suas manutenções
4. Faça seu primeiro backup
5. Aproveite o sistema!

---

**Dúvidas?** Consulte o `README.md` ou `GUIA_RAPIDO.md`

**Boa manutenção! 🚗💨**

*CarCare v2.0 - Sistema de Controle de Manutenção Veicular*
