# 🔄 Guia de Migração - CarCare v2.0 → v3.0

Guia completo para migrar seus dados da versão 2.0 para a versão 3.0 do CarCare.

## 📋 O que Muda?

### Estrutura de Dados

#### v2.0 (Antes)
```javascript
// Um único veículo
meuVeiculo = {
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2020,
    placa: "ABC1234",
    quilometragem: 50000
}

// Manutenções sem veiculoId
manutencoes = [{
    id: 1,
    tipo: "Troca de Óleo",
    data: "2024-01-15",
    quilometragem: 50000,
    // ...
}]
```

#### v3.0 (Depois)
```javascript
// Múltiplos veículos com ID
vehicles = [{
    id: 1,
    tipo: "Carro",
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2020,
    placa: "ABC1234",
    quilometragem: 50000,
    foto: null,
    criadoEm: "2024-01-01T00:00:00.000Z"
}]

// Manutenções com veiculoId
manutencoes = [{
    id: 1,
    veiculoId: 1,  // NOVO! Associação com veículo
    tipo: "Troca de Óleo",
    data: "2024-01-15",
    quilometragem: 50000,
    // ...
}]

// NOVO! Registros de IPVA
ipva_registros = [{
    id: 1,
    veiculoId: 1,
    ano: 2024,
    tipo: "Ambos",
    valorIPVA: 1500.00,
    valorLicenciamento: 100.00,
    dataVencimento: "2024-03-31",
    status: "Pendente",
    // ...
}]
```

## 🚀 Migração Automática

### Como Funciona

A migração acontece **automaticamente** ao abrir a v3.0 pela primeira vez:

1. ✅ Sistema detecta dados da v2.0 em `localStorage`
2. ✅ Converte o veículo único para formato de múltiplos veículos
3. ✅ Adiciona campo `veiculoId` em todas as manutenções
4. ✅ Preserva todas as categorias personalizadas
5. ✅ Cria backup dos dados antigos
6. ✅ Define o veículo migrado como veículo atual

### Passo a Passo

#### Antes de Migrar

1. **Fazer Backup da v2.0:**
   ```javascript
   // Na v2.0, clique no botão "Backup"
   // Ou execute no console:
   const backup = {
       veiculo: JSON.parse(localStorage.getItem('meuVeiculo')),
       manutencoes: JSON.parse(localStorage.getItem('manutencoes')),
       categorias: JSON.parse(localStorage.getItem('categorias'))
   };
   console.log(JSON.stringify(backup));
   // Copie e salve em arquivo
   ```

2. **Verificar Dados:**
   - Abra DevTools (F12)
   - Vá para Application → Local Storage
   - Verifique se existem:
     - `meuVeiculo`
     - `manutencoes`
     - `categorias`

#### Durante a Migração

1. **Abrir v3.0:**
   - Substitua os arquivos da v2.0 pelos da v3.0
   - Ou abra a v3.0 em nova pasta

2. **Primeira Abertura:**
   - Faça login normalmente
   - A migração acontece automaticamente
   - Você verá uma mensagem de confirmação

3. **Verificar Migração:**
   - Vá em "Veículos" no menu
   - Verifique se seu veículo aparece
   - Abra o histórico de manutenções
   - Confirme que os dados estão corretos

## 🔧 Migração Manual

Se a automática falhar, faça manualmente:

### Método 1: Via Interface

1. **Cadastrar Veículo:**
   ```
   - Vá em "Veículos" → "Adicionar Novo"
   - Preencha com os dados da v2.0
   - Anote o veículo criado
   ```

2. **Recriar Manutenções:**
   - Consulte backup da v2.0
   - Recadastre uma por uma
   - Ou use o método de console abaixo

### Método 2: Via Console

```javascript
// 1. Abra o DevTools (F12) na v3.0
// 2. Execute este script:

// Carregar dados antigos
const oldVehicle = JSON.parse(localStorage.getItem('meuVeiculo'));
const oldMaintenances = JSON.parse(localStorage.getItem('manutencoes') || '[]');

if (oldVehicle && !localStorage.getItem('vehicles')) {
    // Criar veículo no novo formato
    const newVehicle = {
        id: 1,
        tipo: 'Carro',  // Ajuste conforme necessário
        marca: oldVehicle.marca,
        modelo: oldVehicle.modelo,
        ano: oldVehicle.ano,
        placa: oldVehicle.placa,
        quilometragem: oldVehicle.quilometragem,
        foto: null,
        criadoEm: new Date().toISOString()
    };
    
    // Salvar veículo
    localStorage.setItem('vehicles', JSON.stringify([newVehicle]));
    localStorage.setItem('currentVehicleId', '1');
    
    // Adicionar veiculoId às manutenções
    const updatedMaintenances = oldMaintenances.map(m => ({
        ...m,
        veiculoId: 1
    }));
    
    // Salvar manutenções atualizadas
    localStorage.setItem('manutencoes', JSON.stringify(updatedMaintenances));
    
    console.log('Migração manual concluída!');
    location.reload();
} else {
    console.log('Dados já migrados ou não encontrados.');
}
```

## 🆕 Novos Recursos

### 1. Adicionar Mais Veículos

```
- Clique em "Veículos"
- Clique em "Adicionar Novo Veículo"
- Preencha:
  - Tipo (Carro, Moto, etc.)
  - Marca, Modelo, Ano
  - Placa
  - Quilometragem
  - Foto (opcional)
- Salve
```

### 2. Alternar Entre Veículos

```
Opção 1: Header
- Clique em "Veículos" no header
- Selecione o veículo desejado

Opção 2: Menu Inferior
- Clique no ícone "Veículos"
- Clique no veículo desejado
```

### 3. Cadastrar IPVA

```
- Selecione o veículo
- Clique no botão "IPVA" no card do veículo
- Clique em "Adicionar Registro"
- Preencha:
  - Ano (ex: 2024)
  - Tipo (IPVA, Licenciamento ou Ambos)
  - Valor IPVA
  - Valor Licenciamento
  - Data de Vencimento
  - Observações (opcional)
- Salve
```

### 4. Marcar IPVA como Pago

```
- Abra o modal de IPVA
- Localize o registro
- Clique em "Marcar como Pago"
- Preencha:
  - Data do pagamento
  - Local/Método
  - Observações
- Confirme
```

### 5. Gerenciar Usuários (Admin)

```
- Vá em Configurações (⚙️)
- Selecione "Gerenciar Usuários"
- Adicionar: "Adicionar Usuário"
- Editar: Clique em "Editar" na linha do usuário
- Excluir: Clique em "Excluir" (não pode excluir a si mesmo)
```

## 📊 Compatibilidade de Dados

### O que é Preservado

✅ **Veículos:**
- Marca, modelo, ano
- Placa
- Quilometragem

✅ **Manutenções:**
- Todos os campos
- Fotos
- Datas
- Valores
- Associação ao veículo

✅ **Categorias:**
- Todas as categorias customizadas
- Ícones e cores

✅ **Usuários:**
- Login e senha
- Permissões

### O que é Adicionado

🆕 **Veículos:**
- Campo `id`
- Campo `tipo`
- Campo `foto`
- Campo `criadoEm`

🆕 **Manutenções:**
- Campo `veiculoId` (associação)

🆕 **Sistema:**
- Suporte a múltiplos veículos
- Registros de IPVA
- Gestão de usuários expandida

## ⚠️ Problemas Comuns

### Problema 1: Veículo não Aparece

**Solução:**
```javascript
// Verifique no console
const vehicles = JSON.parse(localStorage.getItem('vehicles'));
console.log('Veículos:', vehicles);

// Se vazio, force migração
Vehicles.migrateOldVehicle();
```

### Problema 2: Manutenções sem Veículo

**Solução:**
```javascript
// Adicione veiculoId manualmente
const maintenances = JSON.parse(localStorage.getItem('manutencoes'));
const fixed = maintenances.map(m => ({
    ...m,
    veiculoId: m.veiculoId || 1  // ID do seu veículo
}));
localStorage.setItem('manutencoes', JSON.stringify(fixed));
location.reload();
```

### Problema 3: Dados Duplicados

**Solução:**
```javascript
// Limpar dados antigos (CUIDADO: faça backup antes!)
localStorage.removeItem('meuVeiculo');
// Manutenções e categorias continuam válidas
```

### Problema 4: Fotos não Aparecem

**Causa:** Fotos são strings base64 grandes  
**Solução:** As fotos devem migrar automaticamente. Se não:
```javascript
// Verifique tamanho do localStorage
let total = 0;
for (let key in localStorage) {
    total += localStorage[key].length + key.length;
}
console.log('Total localStorage:', (total / 1024 / 1024).toFixed(2), 'MB');
// Limite: ~5-10MB
```

## 🔄 Rollback (Voltar para v2.0)

Se precisar voltar:

### Método 1: Restaurar Backup

```javascript
// 1. Carregar backup da v2.0
const backup = { /* seu backup */ };

// 2. Restaurar
localStorage.setItem('meuVeiculo', JSON.stringify(backup.veiculo));
localStorage.setItem('manutencoes', JSON.stringify(backup.manutencoes));
localStorage.setItem('categorias', JSON.stringify(backup.categorias));

// 3. Limpar dados v3.0
localStorage.removeItem('vehicles');
localStorage.removeItem('currentVehicleId');
localStorage.removeItem('ipva_registros');

// 4. Reabrir v2.0
```

### Método 2: Exportar Dados v3.0

```javascript
// Se quiser converter v3.0 → v2.0
const vehicles = JSON.parse(localStorage.getItem('vehicles'));
const maintenances = JSON.parse(localStorage.getItem('manutencoes'));

// Pegar primeiro veículo
const firstVehicle = vehicles[0];
const vehicleMaintenances = maintenances.filter(m => m.veiculoId === firstVehicle.id);

// Remover veiculoId
const v2Maintenances = vehicleMaintenances.map(({veiculoId, ...rest}) => rest);

// Formato v2.0
const v2Data = {
    veiculo: {
        marca: firstVehicle.marca,
        modelo: firstVehicle.modelo,
        ano: firstVehicle.ano,
        placa: firstVehicle.placa,
        quilometragem: firstVehicle.quilometragem
    },
    manutencoes: v2Maintenances
};

console.log(JSON.stringify(v2Data));
// Copie e use na v2.0
```

## 📝 Checklist de Migração

Antes de começar:
- [ ] Fazer backup completo da v2.0
- [ ] Anotar quantidade de manutenções
- [ ] Verificar espaço no localStorage
- [ ] Fechar todas as abas da v2.0

Durante:
- [ ] Abrir v3.0
- [ ] Fazer login
- [ ] Verificar veículo migrado
- [ ] Conferir manutenções
- [ ] Testar navegação

Depois:
- [ ] Adicionar foto ao veículo (se desejar)
- [ ] Cadastrar IPVA do ano atual
- [ ] Explorar novos recursos
- [ ] Fazer backup da v3.0
- [ ] Adicionar mais veículos (se aplicável)

## 🎯 Próximos Passos

Após migração bem-sucedida:

1. **Explore Múltiplos Veículos:**
   - Adicione moto, carro extra, etc.
   - Compare custos entre veículos

2. **Configure IPVA:**
   - Registre IPVA de todos os veículos
   - Configure alertas de vencimento

3. **Gerencie Usuários:**
   - Adicione familiares (se Admin)
   - Defina permissões

4. **Personalize:**
   - Adicione fotos aos veículos
   - Customize categorias
   - Ajuste configurações

## 📞 Suporte

### Problemas na Migração?

1. **Verifique a documentação:**
   - README_V3.md
   - Este arquivo

2. **Console do Navegador:**
   - Abra DevTools (F12)
   - Procure por erros em vermelho
   - Copie mensagens de erro

3. **Dados de Debug:**
   ```javascript
   console.log('=== DEBUG MIGRAÇÃO ===');
   console.log('v2.0 Vehicle:', localStorage.getItem('meuVeiculo'));
   console.log('v3.0 Vehicles:', localStorage.getItem('vehicles'));
   console.log('Maintenances:', localStorage.getItem('manutencoes'));
   console.log('Current Vehicle:', localStorage.getItem('currentVehicleId'));
   ```

## ✅ Conclusão

A migração v2.0 → v3.0 é:
- ✅ Automática na maioria dos casos
- ✅ Segura (preserva todos os dados)
- ✅ Reversível (pode voltar)
- ✅ Testada em diversos cenários

**Dica Final:** Sempre faça backup antes de qualquer migração!

---

**Boa migração! 🚀**

Aproveite os novos recursos da v3.0!
