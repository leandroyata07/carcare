# 📊 Manual de Relatórios - CarCare

## Visão Geral

O módulo de **Relatórios** permite gerar análises detalhadas e personalizadas de todas as manutenções registradas no sistema, com diversos filtros e opções de exportação em PDF.

---

## 🎯 Funcionalidades Principais

### 1. **Filtros Avançados**

#### 📅 **Por Data**
- **Data Início**: Define o período inicial do relatório
- **Data Fim**: Define o período final do relatório
- Útil para relatórios mensais, trimestrais ou anuais

#### 🚗 **Por Veículo**
- Filtre manutenções de um veículo específico
- Opção "Todos os veículos" para visão geral
- Ideal para comparar custos entre veículos

#### 🔧 **Por Categoria**
- Troca de óleo
- Pneus
- Freios
- Suspensão
- E todas as categorias personalizadas

#### 📝 **Por Tipo de Serviço**
- Busca por palavra-chave no tipo de serviço
- Exemplo: "troca", "revisão", "alinhamento"

#### 📍 **Por Local/Oficina**
- Filtre por oficina específica
- Útil para comparar valores entre prestadores de serviço

#### 💰 **Por Valor**
- **Valor Mínimo**: Exibe apenas manutenções acima deste valor
- **Valor Máximo**: Exibe apenas manutenções abaixo deste valor
- Ideal para identificar manutenções mais caras

#### 🛣️ **Por Quilometragem**
- **KM Mínimo**: Manutenções a partir desta quilometragem
- **KM Máximo**: Manutenções até esta quilometragem
- Perfeito para análise de desgaste por uso

---

## 📈 Estatísticas Exibidas

### Cards de Resumo
1. **Total de Manutenções**: Quantidade de serviços no período filtrado
2. **Valor Total**: Soma de todos os gastos
3. **Valor Médio**: Custo médio por manutenção
4. **KM Percorridos**: Distância total entre as manutenções
5. **Custo por KM**: Quanto você gasta por quilômetro rodado

### Gráfico de Categorias
- Distribuição percentual dos gastos por categoria
- Barra de progresso visual colorida
- Quantidade de manutenções por categoria

### Tabela Detalhada
Exibe todas as manutenções filtradas com:
- Data da manutenção
- Veículo (modelo e placa)
- Categoria
- Tipo de serviço
- Local/oficina
- Quilometragem
- Valor

---

## 🖨️ Exportação e Impressão

### **Botão Imprimir**
- Abre o diálogo de impressão do navegador
- Permite salvar como PDF diretamente
- Layout otimizado para papel A4
- Remove elementos desnecessários (botões, menus)

### **Botão Exportar PDF**
- Gera um arquivo PDF do relatório
- Nome automático: `relatorio-manutencoes-YYYY-MM-DD.pdf`
- Mantém cores e formatação
- Ideal para arquivamento ou envio por e-mail

---

## 💡 Casos de Uso Práticos

### 1. **Relatório Anual para Imposto de Renda**
```
Filtros sugeridos:
- Data Início: 01/01/2025
- Data Fim: 31/12/2025
- Veículo: Todos
```

### 2. **Análise de Custos por Veículo**
```
Filtros sugeridos:
- Veículo: Selecione um veículo específico
- Data: Último ano
```

### 3. **Comparação de Oficinas**
```
Filtros sugeridos:
- Local: Nome da oficina
- Comparar valores médios
```

### 4. **Manutenções Preventivas vs Corretivas**
```
Filtros sugeridos:
- Tipo: "preventiva" ou "corretiva"
- Analisar frequência e custos
```

### 5. **Controle de Gastos Mensais**
```
Filtros sugeridos:
- Data Início: Primeiro dia do mês
- Data Fim: Último dia do mês
```

---

## 🎨 Personalização

### Limpar Filtros
- Clique no botão "Limpar" para resetar todos os filtros
- Retorna à visão completa de todas as manutenções

### Múltiplos Filtros
- Combine diversos filtros para análises específicas
- Exemplo: Veículo X + Categoria Pneus + Último ano

---

## 📱 Responsividade

- **Desktop**: Visualização completa com todos os recursos
- **Tablet**: Layout adaptado com filtros em grid
- **Mobile**: Interface otimizada para telas pequenas
- **Impressão**: Layout profissional em A4

---

## 🔐 Segurança e Privacidade

- Dados armazenados localmente no navegador
- Nenhuma informação é enviada para servidores externos
- Relatórios gerados no dispositivo do usuário
- Backup recomendado via exportação regular

---

## 🚀 Dicas de Produtividade

1. **Exporte relatórios mensalmente** para ter histórico offline
2. **Use filtros de data** para comparar períodos
3. **Salve PDFs com nomes descritivos**: Ex: "Relatorio-Fusca-Jan2025.pdf"
4. **Compare custos entre oficinas** usando o filtro de local
5. **Monitore o custo por KM** para identificar veículos mais econômicos

---

## ❓ Perguntas Frequentes

### Como gerar um relatório anual?
- Defina Data Início como 01/01 e Data Fim como 31/12 do ano desejado

### Posso filtrar várias categorias ao mesmo tempo?
- No momento, apenas uma categoria por vez. Use "Todas as categorias" e depois filtre manualmente o PDF

### O PDF não está sendo gerado
- Verifique se há manutenções no período filtrado
- Desative bloqueadores de pop-up
- Aguarde a geração completa (pode levar alguns segundos)

### Como comparar dois veículos?
- Gere dois relatórios separados, um para cada veículo
- Compare os valores totais e custos por KM

### Os dados são salvos no PDF?
- Sim, o PDF captura exatamente o que está na tela
- Certifique-se de que todos os dados estão visíveis antes de exportar

---

## 🛠️ Solução de Problemas

| Problema | Solução |
|----------|---------|
| Nenhuma manutenção aparece | Verifique os filtros ou clique em "Limpar" |
| PDF sai cortado | Use o botão "Exportar PDF" ao invés de "Imprimir" |
| Cores não aparecem na impressão | Ative "Gráficos em segundo plano" nas configurações da impressora |
| Tabela muito grande | Use filtros para reduzir o período ou quantidade de dados |

---

## 📞 Suporte

Para mais informações, acesse:
- **Menu**: Relatórios → ícone 📊
- **Dashboard**: Card "Relatórios Personalizados"
- **Atalho**: `/reports` na URL

---

## 🎉 Atualizações Futuras

Recursos planejados:
- [ ] Exportação para Excel/CSV
- [ ] Gráficos interativos
- [ ] Comparação lado a lado de veículos
- [ ] Envio de relatório por e-mail
- [ ] Agendamento de relatórios recorrentes
- [ ] Filtros salvos (favoritos)

---

**Versão**: 3.0.0  
**Última atualização**: Fevereiro 2026
