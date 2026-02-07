# 🚗 CarCare - Sistema de Controle de Manutenção Veicular

Sistema completo e moderno para gerenciamento de manutenções de veículos, desenvolvido com HTML5, CSS3 e JavaScript puro (Vanilla JS).

## ✨ Funcionalidades

### 🔐 Sistema de Login
- Autenticação segura com usuário e senha
- Usuário padrão: `admin` / Senha: `admin123`
- Gerenciamento de sessão com LocalStorage
- Proteção de rotas (redirecionamento automático)

### 🚘 Gerenciamento de Veículo
- Cadastro completo do veículo (marca, modelo, ano, placa)
- Controle de quilometragem atual
- Visualização de próxima manutenção programada
- Histórico completo de manutenções

### 🔧 Registro de Manutenções (CRUD Completo)
- **Criar** novas manutenções com detalhes completos
- **Ler** histórico de manutenções ordenado por data
- **Atualizar** informações de manutenções existentes
- **Excluir** manutenções com confirmação
- Campos disponíveis:
  - Tipo de serviço
  - Categoria (personalizável)
  - Data da manutenção
  - Quilometragem
  - Descrição detalhada
  - Local/Oficina
  - Valor (R$)
  - Próxima troca (km)
  - **Foto 256x256px** com redimensionamento automático

### 📂 Gerenciamento de Categorias (CRUD Completo)
- Criar categorias personalizadas
- Editar nomes de categorias
- Excluir categorias (com verificação de uso)
- 12 categorias pré-definidas:
  - Troca de óleo
  - Filtros
  - Freios
  - Pneus
  - Suspensão
  - Bateria
  - Ar Condicionado
  - Motor
  - Transmissão
  - Sistema Elétrico
  - Limpeza
  - Outros
- Cada categoria tem cor e ícone personalizáveis

### 📸 Upload de Fotos
- Suporte para imagens em manutenções
- Redimensionamento automático para 256x256px
- Preview instantâneo antes de salvar
- Armazenamento em base64 no LocalStorage
- Validação de tipo e tamanho de arquivo

### 🔔 Sistema de Notificações
- Ícone de notificação no header
- Badge com contador de alertas
- Alertas de manutenções próximas (500km de antecedência)
- Alertas de manutenções atrasadas
- Lista detalhada de notificações

### 📊 Resumo de Custos
- Total gasto em manutenções
- Média de custo por quilômetro rodado
- Data da última manutenção
- Quantidade total de serviços realizados

### 💾 Backup e Restauração
- Exportar todos os dados em formato JSON
- Backup inclui:
  - Dados do veículo
  - Todas as manutenções
  - Categorias personalizadas
  - Data e versão do backup
- Restaurar dados de backup anterior

### 🎨 Interface Moderna
- Design responsivo (mobile-first)
- Paleta de cores profissional
- Animações suaves
- Ícones FontAwesome
- Navegação intuitiva com bottom nav
- Modais para formulários
- Toasts para feedback de ações

## 📁 Estrutura de Arquivos

```
CarCare/
├── index.html          # Página principal da aplicação
├── login.html          # Página de login
├── css/
│   └── style.css      # Estilos CSS separados
├── js/
│   ├── app.js         # Lógica principal da aplicação
│   ├── auth.js        # Sistema de autenticação
│   └── categories.js  # Gerenciamento de categorias
└── README.md          # Documentação
```

## 🚀 Como Usar

### Instalação
1. Clone ou baixe os arquivos
2. Abra o arquivo `login.html` em um navegador moderno
3. Use as credenciais padrão para fazer login:
   - **Usuário**: `admin`
   - **Senha**: `admin123`

### Requisitos
- Navegador moderno com suporte a:
  - ES6+ JavaScript
  - LocalStorage
  - FileReader API
  - Canvas API (para redimensionamento de imagens)

### Primeiro Acesso
1. Faça login com as credenciais padrão
2. Edite as informações do seu veículo
3. Personalize as categorias conforme necessário
4. Comece a registrar suas manutenções

## 💡 Recursos Técnicos

### Armazenamento
- Todos os dados são armazenados localmente no navegador (LocalStorage)
- Não requer servidor ou banco de dados
- Dados persistem entre sessões
- Totalmente offline

### Segurança
- Hash de senhas (implementação básica para demonstração)
- Validação de sessão
- Proteção de rotas
- **Nota**: Para uso em produção, recomenda-se implementar autenticação backend

### Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Mobile-first design
- Touch-friendly
- Otimizado para tablets e desktops

### Performance
- Sem dependências externas (exceto FontAwesome para ícones)
- JavaScript Vanilla (sem frameworks)
- Carregamento rápido
- Animações otimizadas com CSS

## 🎯 Funcionalidades Avançadas

### Processamento de Imagens
- Upload de fotos nas manutenções
- Redimensionamento automático para 256x256px
- Crop centralizado mantendo proporção
- Compressão JPEG (90% de qualidade)
- Conversão para base64
- Validação de tipo e tamanho

### Cálculos Automáticos
- Média de custo por km
- Próxima manutenção baseada no histórico
- Contador de dias desde última manutenção
- Alertas baseados em quilometragem

### Interface Inteligente
- Preenchimento automático de campos
- Preview de imagens antes de salvar
- Validação de formulários em tempo real
- Mensagens de feedback (toasts)
- Confirmações para ações críticas

## 🔄 Atualizações e Melhorias

### Versão 2.0 - Recursos Implementados
- ✅ Sistema de login completo
- ✅ CRUD de categorias
- ✅ Upload de fotos (256x256px)
- ✅ Ícone de notificações
- ✅ Layout melhorado e moderno
- ✅ Separação de arquivos (HTML, CSS, JS)
- ✅ Sistema de backup/restauração
- ✅ Responsividade aprimorada

### Possíveis Melhorias Futuras
- 📱 PWA (Progressive Web App)
- 📧 Lembretes por e-mail
- 📈 Gráficos e estatísticas avançadas
- 🌙 Modo escuro
- 🌐 Múltiplos idiomas
- ☁️ Sincronização na nuvem
- 📄 Geração de relatórios PDF
- 🔗 Integração com APIs de oficinas

## 📝 Observações Importantes

### LocalStorage
- Os dados são armazenados apenas no navegador atual
- Limpar dados do navegador apagará as informações
- **Recomendação**: Faça backups regulares!

### Fotos
- As imagens são armazenadas em base64
- Arquivos muito grandes podem afetar a performance
- Limite recomendado: 2MB por imagem
- Redimensionamento automático para 256x256px

### Compatibilidade
- Testado em navegadores modernos:
  - Google Chrome 90+
  - Mozilla Firefox 88+
  - Microsoft Edge 90+
  - Safari 14+

## 👨‍💻 Desenvolvimento

### Tecnologias Utilizadas
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS e animações
- **JavaScript (ES6+)**: Lógica da aplicação
- **FontAwesome 6.4**: Ícones
- **LocalStorage API**: Armazenamento de dados
- **FileReader API**: Leitura de arquivos
- **Canvas API**: Processamento de imagens

### Boas Práticas Implementadas
- Código modular e organizado
- Comentários descritivos
- Nomenclatura consistente
- Separação de responsabilidades
- Feedback visual ao usuário
- Validações de entrada
- Tratamento de erros

## 📞 Suporte

Para dúvidas, sugestões ou relatar problemas:
- Verifique se está usando um navegador compatível
- Certifique-se de que o JavaScript está habilitado
- Faça backup dos dados antes de atualizar
- Teste em modo anônimo se houver problemas

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins pessoais e comerciais.

---

**Desenvolvido com ❤️ para facilitar o controle de manutenção do seu veículo!**

*CarCare v2.0 - 2026*
