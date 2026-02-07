// ============================================
// CARCARE - SISTEMA DE CONTROLE DE MANUTENÇÃO
// JavaScript Principal
// ============================================

// DADOS GLOBAIS
let meuVeiculo = null; // Será carregado do sistema de múltiplos veículos
let manutencoes = [];
let manutencoesFiltered = []; // Manutenções filtradas
let categorias = [];
let activeFilters = {
    dateFrom: null,
    dateTo: null,
    category: null,
    search: null
};

// ELEMENTOS DO DOM
const elements = {
    vehicleModel: null,
    vehiclePlate: null,
    vehicleYear: null,
    vehicleKm: null,
    nextMaintenance: null,
    maintenanceList: null,
    emptyState: null,
    totalSpent: null,
    avgPerKm: null,
    lastMaintenance: null,
    totalServices: null,
    notificationBadge: null,
    notificationCount: null
};

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    if (Auth.isLoggedIn()) {
        initApp();
    }
});

function initApp() {
    initializeElements();
    carregarDados();
    atualizarInterface();
    configurarEventos();
    verificarNotificacoes();
}

function initializeElements() {
    elements.vehicleModel = document.getElementById('vehicleModel');
    elements.vehiclePlate = document.getElementById('vehiclePlate');
    elements.vehicleYear = document.getElementById('vehicleYear');
    elements.vehicleKm = document.getElementById('vehicleKm');
    elements.nextMaintenance = document.getElementById('nextMaintenance');
    elements.maintenanceList = document.getElementById('maintenanceList');
    elements.emptyState = document.getElementById('emptyState');
    elements.totalSpent = document.getElementById('totalSpent');
    elements.avgPerKm = document.getElementById('avgPerKm');
    elements.lastMaintenance = document.getElementById('lastMaintenance');
    elements.totalServices = document.getElementById('totalServices');
    elements.notificationBadge = document.getElementById('notificationBadge');
    elements.notificationCount = document.getElementById('notificationCount');
}

// ============================================
// GERENCIAMENTO DE DADOS
// ============================================

function carregarDados() {
    // Carregar veículo atual do sistema de múltiplos veículos
    meuVeiculo = Vehicles.getCurrent();
    
    // Carregar manutenções do veículo atual
    const todasManutencoes = JSON.parse(localStorage.getItem('carCareManutencoes') || '[]');
    if (meuVeiculo) {
        manutencoes = todasManutencoes.filter(m => m.veiculoId === meuVeiculo.id);
    } else {
        manutencoes = [];
    }
    
    // Carregar categorias
    const categoriasSalvas = localStorage.getItem('carCareCategorias');
    if (categoriasSalvas) {
        categorias = JSON.parse(categoriasSalvas);
    } else {
        categorias = Categories.getDefaultCategories();
        salvarCategorias();
    }
}

function salvarDados() {
    // Salvar todas as manutenções (não apenas do veículo atual)
    const todasManutencoes = JSON.parse(localStorage.getItem('carCareManutencoes') || '[]');
    
    // Remover manutenções antigas do veículo atual
    const outrasManutencoes = todasManutencoes.filter(m => m.veiculoId !== (meuVeiculo ? meuVeiculo.id : null));
    
    // Adicionar manutenções atualizadas do veículo atual
    const manutencoesAtualizadas = [...outrasManutencoes, ...manutencoes];
    
    localStorage.setItem('carCareManutencoes', JSON.stringify(manutencoesAtualizadas));
}

function salvarCategorias() {
    localStorage.setItem('carCareCategorias', JSON.stringify(categorias));
}

// ============================================
// ATUALIZAÇÃO DE INTERFACE
// ============================================

function atualizarInterface() {
    // Recarregar dados do veículo atual
    carregarDados();
    
    atualizarInfoVeiculo();
    atualizarListaManutencoes();
    atualizarResumoCustos();
}

function atualizarInfoVeiculo() {
    if (!elements.vehicleModel) return;
    
    // Verificar se há veículo selecionado
    if (!meuVeiculo) {
        elements.vehicleModel.textContent = 'Nenhum veículo cadastrado';
        elements.vehiclePlate.textContent = '-';
        elements.vehicleYear.textContent = '-';
        elements.vehicleKm.textContent = '-';
        elements.nextMaintenance.textContent = '-';
        return;
    }
    
    elements.vehicleModel.textContent = `${meuVeiculo.marca} ${meuVeiculo.modelo} ${meuVeiculo.ano}`;
    elements.vehiclePlate.textContent = meuVeiculo.placa;
    elements.vehicleYear.textContent = meuVeiculo.ano;
    elements.vehicleKm.textContent = `${meuVeiculo.quilometragem.toLocaleString('pt-BR')} km`;
    
    // Calcular próxima manutenção
    let proximaKm = 0;
    if (manutencoes.length > 0) {
        const manutencoesComProxima = manutencoes.filter(m => m.proximaTroca);
        if (manutencoesComProxima.length > 0) {
            proximaKm = Math.min(...manutencoesComProxima.map(m => m.proximaTroca));
        }
    }
    
    elements.nextMaintenance.textContent = proximaKm > 0 ? 
        `${proximaKm.toLocaleString('pt-BR')} km` : 'Não definida';
}

function atualizarListaManutencoes() {
    if (!elements.maintenanceList) return;
    
    elements.maintenanceList.innerHTML = '';
    
    // Usar manutenções filtradas ou todas
    const listToShow = manutencoesFiltered.length > 0 || hasActiveFilters() ? manutencoesFiltered : manutencoes;
    
    if (listToShow.length === 0) {
        if (hasActiveFilters()) {
            elements.emptyState.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Nenhum resultado encontrado</h3>
                <p class="mt-2">Tente ajustar os filtros de pesquisa</p>
            `;
        } else {
            elements.emptyState.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <h3>Nenhuma manutenção registrada</h3>
                <p class="mt-2">Clique em "Nova" para adicionar sua primeira manutenção</p>
            `;
        }
        elements.emptyState.style.display = 'block';
        return;
    }
    
    elements.emptyState.style.display = 'none';
    
    // Ordenar por data (mais recente primeiro)
    const manutencoesOrdenadas = [...listToShow].sort((a, b) => 
        new Date(b.data) - new Date(a.data)
    );
    
    manutencoesOrdenadas.forEach(manutencao => {
        const item = createMaintenanceItem(manutencao);
        elements.maintenanceList.appendChild(item);
    });
    
    // Atualizar contador de resultados
    updateFilterResults(listToShow.length, manutencoes.length);
}

function createMaintenanceItem(manutencao) {
    const item = document.createElement('div');
    item.className = 'maintenance-item';
    
    // Formatar data
    const dataObj = new Date(manutencao.data + 'T00:00:00');
    const dataFormatada = dataObj.toLocaleDateString('pt-BR');
    
    // Formatar valor
    const valorFormatado = manutencao.valor ? 
        `R$ ${manutencao.valor.toFixed(2).replace('.', ',')}` : 'Não informado';
    
    // Buscar categoria
    const categoria = categorias.find(c => c.id === manutencao.categoriaId);
    const categoriaNome = categoria ? categoria.nome : 'Sem categoria';
    const categoriaColor = categoria ? categoria.cor : '#64748b';
    
    // Foto
    const fotoHTML = manutencao.foto ? 
        `<img src="${manutencao.foto}" alt="Foto da manutenção" class="maintenance-photo">` : '';
    
    item.innerHTML = `
        <div class="maintenance-header">
            <div class="maintenance-type">
                ${manutencao.tipo}
            </div>
            <div class="maintenance-date">${dataFormatada}</div>
        </div>
        <div class="maintenance-category badge" style="background-color: ${categoriaColor}20; color: ${categoriaColor}">
            ${categoriaNome}
        </div>
        ${manutencao.descricao ? `<p style="margin-top: 12px; color: var(--gray);">${manutencao.descricao}</p>` : ''}
        ${fotoHTML}
        <div class="maintenance-details">
            <div class="info-item">
                <span class="info-label">Quilometragem</span>
                <span class="info-value">${manutencao.quilometragem.toLocaleString('pt-BR')} km</span>
            </div>
            <div class="info-item">
                <span class="info-label">Local</span>
                <span class="info-value">${manutencao.local || 'Não informado'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Valor</span>
                <span class="info-value currency">${valorFormatado}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Próxima</span>
                <span class="info-value">${manutencao.proximaTroca ? manutencao.proximaTroca.toLocaleString('pt-BR') + ' km' : 'Não definida'}</span>
            </div>
        </div>
        <div class="maintenance-actions">
            <button class="btn btn-sm btn-primary" onclick="editarManutencao(${manutencao.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="excluirManutencao(${manutencao.id})">
                <i class="fas fa-trash"></i> Excluir
            </button>
        </div>
    `;
    
    return item;
}

function atualizarResumoCustos() {
    if (!elements.totalSpent) return;
    
    if (!meuVeiculo || manutencoes.length === 0) {
        elements.totalSpent.textContent = 'R$ 0,00';
        elements.avgPerKm.textContent = 'R$ 0,00/km';
        elements.lastMaintenance.textContent = 'Nenhuma';
        elements.totalServices.textContent = '0';
        return;
    }
    
    // Calcular total gasto
    const total = manutencoes.reduce((soma, item) => soma + (item.valor || 0), 0);
    elements.totalSpent.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Calcular média por km
    const kmInicial = Math.min(...manutencoes.map(m => m.quilometragem));
    const kmAtual = meuVeiculo.quilometragem;
    const kmPercorridos = kmAtual - kmInicial;
    const mediaPorKm = kmPercorridos > 0 ? total / kmPercorridos : 0;
    elements.avgPerKm.textContent = `R$ ${mediaPorKm.toFixed(3).replace('.', ',')}/km`;
    
    // Última manutenção
    const ultimaData = manutencoes.reduce((maisRecente, item) => 
        new Date(item.data) > new Date(maisRecente.data) ? item : maisRecente
    );
    const dataFormatada = new Date(ultimaData.data + 'T00:00:00').toLocaleDateString('pt-BR');
    elements.lastMaintenance.textContent = dataFormatada;
    
    // Total de serviços
    elements.totalServices.textContent = manutencoes.length.toString();
}

// ============================================
// NOTIFICAÇÕES
// ============================================

function verificarNotificacoes() {
    if (!elements.notificationBadge) return;
    
    let notificacoes = 0;
    
    if (meuVeiculo) {
        // Verificar manutenções próximas
        manutencoes.forEach(manutencao => {
            if (manutencao.proximaTroca && manutencao.proximaTroca <= meuVeiculo.quilometragem + 500) {
                notificacoes++;
            }
        });
    }
    
    if (notificacoes > 0) {
        elements.notificationBadge.classList.remove('hidden');
        elements.notificationCount.textContent = notificacoes > 9 ? '9+' : notificacoes;
    } else {
        elements.notificationBadge.classList.add('hidden');
    }
}

function mostrarNotificacoes() {
    const notificacoesPendentes = [];
    
    manutencoes.forEach(manutencao => {
        if (manutencao.proximaTroca && manutencao.proximaTroca <= meuVeiculo.quilometragem + 500) {
            notificacoesPendentes.push({
                tipo: manutencao.tipo,
                km: manutencao.proximaTroca,
                diferenca: manutencao.proximaTroca - meuVeiculo.quilometragem
            });
        }
    });
    
    if (notificacoesPendentes.length === 0) {
        showToast('Nenhuma notificação', 'info');
        return;
    }
    
    let mensagem = 'Manutenções próximas:\n\n';
    notificacoesPendentes.forEach(notif => {
        if (notif.diferenca <= 0) {
            mensagem += `⚠️ ${notif.tipo} - ATRASADA (${notif.km.toLocaleString('pt-BR')} km)\n`;
        } else {
            mensagem += `🔔 ${notif.tipo} - Em ${notif.diferenca} km (${notif.km.toLocaleString('pt-BR')} km)\n`;
        }
    });
    
    alert(mensagem);
}

// ============================================
// CRUD DE MANUTENÇÕES
// ============================================

function adicionarManutencao(dados) {
    if (!meuVeiculo) {
        showToast('Selecione um veículo primeiro!', 'warning');
        return;
    }
    
    const novaManutencao = {
        id: manutencoes.length > 0 ? Math.max(...manutencoes.map(m => m.id)) + 1 : 1,
        veiculoId: meuVeiculo.id,
        tipo: dados.tipo,
        data: dados.data,
        quilometragem: parseInt(dados.quilometragem),
        descricao: dados.descricao,
        local: dados.local,
        valor: dados.valor ? parseFloat(dados.valor) : 0,
        proximaTroca: dados.proximaTroca ? parseInt(dados.proximaTroca) : null,
        categoriaId: dados.categoriaId || null,
        foto: dados.foto || null,
        criadoEm: new Date().toISOString()
    };
    
    manutencoes.push(novaManutencao);
    salvarDados();
    atualizarInterface();
    verificarNotificacoes();
    showToast('Manutenção registrada com sucesso!', 'success');
}

function editarManutencao(id) {
    const manutencao = manutencoes.find(m => m.id === id);
    if (!manutencao) return;
    
    // Preencher formulário
    document.getElementById('inputTipo').value = manutencao.tipo;
    document.getElementById('inputData').value = manutencao.data;
    document.getElementById('inputQuilometragem').value = manutencao.quilometragem;
    document.getElementById('inputDescricao').value = manutencao.descricao || '';
    document.getElementById('inputLocal').value = manutencao.local || '';
    document.getElementById('inputValor').value = manutencao.valor || '';
    document.getElementById('inputProximaTroca').value = manutencao.proximaTroca || '';
    document.getElementById('inputCategoria').value = manutencao.categoriaId || '';
    
    // Mostrar foto se existir
    if (manutencao.foto) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${manutencao.foto}" alt="Foto atual">`;
        preview.classList.remove('hidden');
    }
    
    // Guardar ID para atualização
    document.getElementById('maintenanceForm').dataset.editId = id;
    
    // Abrir modal
    document.getElementById('maintenanceModal').classList.add('active');
}

function atualizarManutencao(id, dados) {
    const index = manutencoes.findIndex(m => m.id === id);
    if (index === -1) return;
    
    manutencoes[index] = {
        ...manutencoes[index],
        tipo: dados.tipo,
        data: dados.data,
        quilometragem: parseInt(dados.quilometragem),
        descricao: dados.descricao,
        local: dados.local,
        valor: dados.valor ? parseFloat(dados.valor) : 0,
        proximaTroca: dados.proximaTroca ? parseInt(dados.proximaTroca) : null,
        categoriaId: dados.categoriaId || null,
        foto: dados.foto !== undefined ? dados.foto : manutencoes[index].foto,
        veiculoId: manutencoes[index].veiculoId || (meuVeiculo ? meuVeiculo.id : null),
        atualizadoEm: new Date().toISOString()
    };
    
    salvarDados();
    atualizarInterface();
    verificarNotificacoes();
    showToast('Manutenção atualizada com sucesso!', 'success');
}

function excluirManutencao(id) {
    if (!confirm('Tem certeza que deseja excluir esta manutenção?')) return;
    
    manutencoes = manutencoes.filter(m => m.id !== id);
    salvarDados();
    atualizarInterface();
    verificarNotificacoes();
    showToast('Manutenção excluída com sucesso!', 'success');
}

// ============================================
// GERENCIAMENTO DE FOTOS
// ============================================

function handleImageUpload(file, callback) {
    if (!file) {
        callback(null);
        return;
    }
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        showToast('Por favor, selecione um arquivo de imagem', 'warning');
        callback(null);
        return;
    }
    
    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('A imagem deve ter no máximo 2MB', 'warning');
        callback(null);
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        
        img.onload = function() {
            // Redimensionar para 256x256
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            
            const ctx = canvas.getContext('2d');
            
            // Calcular dimensões para manter proporção
            let sx, sy, sWidth, sHeight;
            if (img.width > img.height) {
                sHeight = img.height;
                sWidth = img.height;
                sx = (img.width - img.height) / 2;
                sy = 0;
            } else {
                sWidth = img.width;
                sHeight = img.width;
                sx = 0;
                sy = (img.height - img.width) / 2;
            }
            
            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 256, 256);
            
            // Converter para base64
            const resizedImage = canvas.toDataURL('image/jpeg', 0.9);
            callback(resizedImage);
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// ============================================
// BACKUP E RESTAURAÇÃO
// ============================================

function fazerBackup() {
    const allVehicles = Vehicles.getAll();
    const allMaintenances = JSON.parse(localStorage.getItem('manutencoes') || '[]');
    const allIPVA = JSON.parse(localStorage.getItem('ipva_registros') || '[]');
    
    const dadosCompletos = {
        vehicles: allVehicles,
        manutencoes: allMaintenances,
        ipva: allIPVA,
        categorias: categorias,
        currentVehicleId: localStorage.getItem('currentVehicleId'),
        dataBackup: new Date().toISOString(),
        versao: '3.0'
    };
    
    const dadosString = JSON.stringify(dadosCompletos, null, 2);
    const blob = new Blob([dadosString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_carcare_v3_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Backup realizado com sucesso!', 'success');
}

function restaurarBackup(file) {
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            
            if (dados.veiculo) meuVeiculo = dados.veiculo;
            if (dados.manutencoes) manutencoes = dados.manutencoes;
            if (dados.categorias) categorias = dados.categorias;
            
            salvarDados();
            salvarCategorias();
            atualizarInterface();
            verificarNotificacoes();
            
            showToast('Backup restaurado com sucesso!', 'success');
        } catch (error) {
            showToast('Erro ao restaurar backup. Arquivo inválido.', 'danger');
        }
    };
    
    reader.readAsText(file);
}

// ============================================
// UTILITÁRIOS
// ============================================

function showToast(message, type = 'info') {
    // Criar elemento de toast
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '10000';
    toast.style.minWidth = '300px';
    toast.style.animation = 'fadeInUp 0.3s ease';
    
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ============================================
// CONFIGURAÇÃO DE EVENTOS
// ============================================

function configurarEventos() {
    // Inicializar filtros
    initializeFilters();
    
    // Botão editar veículo
    const btnEditVehicle = document.getElementById('btnEditVehicle');
    if (btnEditVehicle) {
        btnEditVehicle.addEventListener('click', () => {
            document.getElementById('inputMarca').value = meuVeiculo.marca;
            document.getElementById('inputModelo').value = meuVeiculo.modelo;
            document.getElementById('inputAno').value = meuVeiculo.ano;
            document.getElementById('inputPlaca').value = meuVeiculo.placa;
            document.getElementById('inputKm').value = meuVeiculo.quilometragem;
            document.getElementById('vehicleModal').classList.add('active');
        });
    }
    
    // Formulário de veículo
    const vehicleForm = document.getElementById('vehicleForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            meuVeiculo = {
                marca: document.getElementById('inputMarca').value,
                modelo: document.getElementById('inputModelo').value,
                ano: parseInt(document.getElementById('inputAno').value),
                placa: document.getElementById('inputPlaca').value.toUpperCase(),
                quilometragem: parseInt(document.getElementById('inputKm').value)
            };
            
            salvarDados();
            atualizarInterface();
            document.getElementById('vehicleModal').classList.remove('active');
            showToast('Veículo salvo com sucesso!', 'success');
        });
    }
    
    // Botão adicionar manutenção
    const btnAddMaintenance = document.getElementById('btnAddMaintenance');
    if (btnAddMaintenance) {
        btnAddMaintenance.addEventListener('click', abrirModalManutencao);
    }
    
    const navAdd = document.getElementById('navAdd');
    if (navAdd) {
        navAdd.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalManutencao();
        });
    }
    
    // Formulário de manutenção
    const maintenanceForm = document.getElementById('maintenanceForm');
    if (maintenanceForm) {
        maintenanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dados = {
                tipo: document.getElementById('inputTipo').value,
                data: document.getElementById('inputData').value,
                quilometragem: document.getElementById('inputQuilometragem').value,
                descricao: document.getElementById('inputDescricao').value,
                local: document.getElementById('inputLocal').value,
                valor: document.getElementById('inputValor').value,
                proximaTroca: document.getElementById('inputProximaTroca').value,
                categoriaId: document.getElementById('inputCategoria').value
            };
            
            const editId = maintenanceForm.dataset.editId;
            
            // Processar foto se houver
            const fotoInput = document.getElementById('inputFoto');
            if (fotoInput.files && fotoInput.files[0]) {
                handleImageUpload(fotoInput.files[0], (foto) => {
                    dados.foto = foto;
                    finalizarSalvarManutencao(editId, dados);
                });
            } else {
                finalizarSalvarManutencao(editId, dados);
            }
        });
    }
    
    // Upload de foto
    const inputFoto = document.getElementById('inputFoto');
    if (inputFoto) {
        inputFoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file, (foto) => {
                    if (foto) {
                        const preview = document.getElementById('imagePreview');
                        preview.innerHTML = `<img src="${foto}" alt="Preview">`;
                        preview.classList.remove('hidden');
                    }
                });
            }
        });
    }
    
    // Botão de notificações
    const btnNotification = document.getElementById('btnNotification');
    if (btnNotification) {
        btnNotification.addEventListener('click', mostrarNotificacoes);
    }
    
    // Botão de seletor de veículos
    const btnVehicleSelector = document.getElementById('btnVehicleSelector');
    if (btnVehicleSelector) {
        btnVehicleSelector.addEventListener('click', () => {
            Vehicles.showVehiclesList();
        });
    }
    
    // Botão de gerenciamento de usuários
    const btnUserManagement = document.getElementById('btnUserManagement');
    const currentUser = Auth.getCurrentUser();
    if (btnUserManagement && currentUser && currentUser.role === 'admin') {
        btnUserManagement.style.display = 'block';
        btnUserManagement.addEventListener('click', () => {
            UserManagement.showManagement();
        });
    }
    
    // Botão de modo escuro
    const btnDarkMode = document.getElementById('btnDarkMode');
    if (btnDarkMode) {
        // Verificar se modo escuro está ativo
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            btnDarkMode.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        btnDarkMode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkNow = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkNow);
            btnDarkMode.innerHTML = isDarkNow ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            showToast(isDarkNow ? 'Modo escuro ativado' : 'Modo claro ativado', 'info');
        });
    }
    
    // Botão IPVA
    const btnIPVA = document.getElementById('btnIPVA');
    if (btnIPVA) {
        btnIPVA.addEventListener('click', () => {
            if (!meuVeiculo) {
                showToast('Selecione um veículo primeiro!', 'warning');
                Vehicles.showVehiclesList();
                return;
            }
            IPVA.showIPVAModal(meuVeiculo.id);
        });
    }
    
    // Botão backup
    const btnBackup = document.getElementById('btnBackup');
    if (btnBackup) {
        btnBackup.addEventListener('click', fazerBackup);
    }
    
    // Navegação
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const page = this.getAttribute('data-page');
            
            if (page === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (page === 'history') {
                document.getElementById('maintenanceSection')?.scrollIntoView({ behavior: 'smooth' });
            } else if (page === 'vehicles') {
                Vehicles.showVehiclesList();
            } else if (page === 'categories') {
                Categories.showCategoriesModal();
            } else if (page === 'about') {
                mostrarSobre();
            } else if (page === 'settings') {
                mostrarConfiguracoes();
            }
        });
    });
    
    // Fechar modais
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

function abrirModalManutencao() {
    if (!meuVeiculo) {
        showToast('Selecione um veículo primeiro!', 'warning');
        Vehicles.showVehiclesList();
        return;
    }
    
    const form = document.getElementById('maintenanceForm');
    form.reset();
    delete form.dataset.editId;
    
    // Definir valores padrão
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('inputData').value = hoje;
    document.getElementById('inputQuilometragem').value = meuVeiculo.quilometragem;
    
    // Limpar preview de imagem
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.innerHTML = '';
        preview.classList.add('hidden');
    }
    
    // Atualizar select de categorias
    const selectCategoria = document.getElementById('inputCategoria');
    if (selectCategoria) {
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria...</option>';
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nome;
            selectCategoria.appendChild(option);
        });
    }
    
    document.getElementById('maintenanceModal').classList.add('active');
}

function finalizarSalvarManutencao(editId, dados) {
    if (editId) {
        atualizarManutencao(parseInt(editId), dados);
    } else {
        adicionarManutencao(dados);
    }
    
    document.getElementById('maintenanceModal').classList.remove('active');
    document.getElementById('maintenanceForm').reset();
    delete document.getElementById('maintenanceForm').dataset.editId;
}

function mostrarConfiguracoes() {
    const currentUser = Auth.getCurrentUser();
    let menu = 'Configurações\n\n';
    
    menu += '1. Alterar senha\n';
    menu += '2. Fazer backup\n';
    
    if (currentUser && currentUser.role === 'admin') {
        menu += '3. Gerenciar usuários\n';
    }
    
    menu += '\n0. Cancelar';
    
    const opcao = prompt(menu);
    
    switch(opcao) {
        case '1':
            const senhaAtual = prompt('Senha atual:');
            const novaSenha = prompt('Nova senha:');
            const confirmaSenha = prompt('Confirme a nova senha:');
            
            if (novaSenha !== confirmaSenha) {
                showToast('As senhas não coincidem!', 'error');
                return;
            }
            
            if (Auth.changePassword(senhaAtual, novaSenha)) {
                showToast('Senha alterada com sucesso!', 'success');
            } else {
                showToast('Senha atual incorreta!', 'error');
            }
            break;
            
        case '2':
            fazerBackup();
            break;
            
        case '3':
            if (currentUser && currentUser.role === 'admin') {
                UserManagement.showManagement();
            }
            break;
    }
}

function mostrarSobre() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'aboutModal';
    
    const version = '3.0.0';
    const year = new Date().getFullYear();
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> Sobre o CarCare</h2>
                <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="about-content">
                    <div class="about-logo">
                        <i class="fas fa-car" style="font-size: 80px; color: var(--primary);"></i>
                        <h1 style="margin: 20px 0 10px 0;">CarCare</h1>
                        <p style="color: var(--gray); margin-bottom: 30px;">Versão ${version}</p>
                    </div>
                    
                    <div class="about-section">
                        <h3><i class="fas fa-code"></i> Sistema de Gestão Veicular</h3>
                        <p>Sistema completo para controle de manutenções, múltiplos veículos, IPVA/Licenciamento e gerenciamento de usuários.</p>
                    </div>
                    
                    <div class="about-section">
                        <h3><i class="fas fa-star"></i> Funcionalidades</h3>
                        <ul style="list-style: none; padding-left: 0;">
                            <li><i class="fas fa-check" style="color: var(--secondary);"></i> Múltiplos veículos</li>
                            <li><i class="fas fa-check" style="color: var(--secondary);"></i> Controle de manutenções</li>
                            <li><i class="fas fa-check" style="color: var(--secondary);"></i> IPVA e Licenciamento</li>
                            <li><i class="fas fa-check" style="color: var(--secondary);"></i> Gerenciamento de usuários</li>
                            <li><i class="fas fa-check" style="color: var(--secondary);"></i> Modo escuro</li>
                            <li><i class="fas fa-check" style="color: var(--secondary);"></i> Backup completo</li>
                        </ul>
                    </div>
                    
                    <div class="about-section">
                        <h3><i class="fas fa-user-tie"></i> Desenvolvedor</h3>
                        <div class="developer-info">
                            <div class="developer-avatar">
                                <i class="fas fa-user-circle" style="font-size: 60px; color: var(--primary);"></i>
                            </div>
                            <div class="developer-details">
                                <h4 style="margin: 10px 0 5px 0;">Leandro Yata</h4>
                                <p style="color: var(--gray); margin: 0;">Desenvolvedor Full Stack</p>
                                <p style="color: var(--gray); margin: 5px 0 0 0; font-size: 14px;">
                                    <i class="fas fa-envelope"></i> leandro.yata@example.com
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="about-section">
                        <h3><i class="fas fa-layer-group"></i> Tecnologias</h3>
                        <div class="tech-badges">
                            <span class="tech-badge">HTML5</span>
                            <span class="tech-badge">CSS3</span>
                            <span class="tech-badge">JavaScript ES6+</span>
                            <span class="tech-badge">LocalStorage API</span>
                            <span class="tech-badge">Canvas API</span>
                        </div>
                    </div>
                    
                    <div class="about-section">
                        <h3><i class="fas fa-heart"></i> Agradecimentos</h3>
                        <p>Desenvolvido com dedicação para facilitar o controle de manutenção veicular.</p>
                        <p style="text-align: center; margin-top: 20px; color: var(--gray);">
                            © ${year} Leandro Yata. Todos os direitos reservados.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ============================================
// SISTEMA DE FILTROS
// ============================================

function initializeFilters() {
    // Atualizar select de categorias
    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
        filterCategory.innerHTML = '<option value="">Todas as categorias</option>';
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nome;
            filterCategory.appendChild(option);
        });
    }
    
    // Botão aplicar filtros
    const btnApplyFilters = document.getElementById('btnApplyFilters');
    if (btnApplyFilters) {
        btnApplyFilters.addEventListener('click', applyFilters);
    }
    
    // Botão limpar filtros
    const btnClearFilters = document.getElementById('btnClearFilters');
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', clearFilters);
    }
    
    // Enter nos campos de filtro
    ['filterDateFrom', 'filterDateTo', 'filterCategory', 'filterSearch'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    applyFilters();
                }
            });
            // Aplicar filtro ao mudar categoria
            if (id === 'filterCategory') {
                element.addEventListener('change', applyFilters);
            }
        }
    });
    
    // Auto-filtro para busca (debounced)
    const filterSearch = document.getElementById('filterSearch');
    if (filterSearch) {
        let searchTimeout;
        filterSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 500);
        });
    }
}

function applyFilters() {
    const dateFrom = document.getElementById('filterDateFrom')?.value;
    const dateTo = document.getElementById('filterDateTo')?.value;
    const category = document.getElementById('filterCategory')?.value;
    const search = document.getElementById('filterSearch')?.value.toLowerCase().trim();
    
    // Atualizar filtros ativos
    activeFilters.dateFrom = dateFrom || null;
    activeFilters.dateTo = dateTo || null;
    activeFilters.category = category || null;
    activeFilters.search = search || null;
    
    // Filtrar manutenções
    manutencoesFiltered = manutencoes.filter(m => {
        // Filtro de data inicial
        if (dateFrom && m.data < dateFrom) {
            return false;
        }
        
        // Filtro de data final
        if (dateTo && m.data > dateTo) {
            return false;
        }
        
        // Filtro de categoria
        if (category && m.categoriaId !== parseInt(category)) {
            return false;
        }
        
        // Filtro de busca textual
        if (search) {
            const searchText = [
                m.tipo,
                m.descricao,
                m.local,
                m.quilometragem?.toString(),
                m.valor?.toString()
            ].filter(Boolean).join(' ').toLowerCase();
            
            if (!searchText.includes(search)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Atualizar interface
    atualizarListaManutencoes();
    
    // Feedback visual
    if (hasActiveFilters()) {
        showToast(`Filtros aplicados: ${manutencoesFiltered.length} resultado(s)`, 'info');
    }
}

function clearFilters() {
    // Limpar campos
    const filterDateFrom = document.getElementById('filterDateFrom');
    const filterDateTo = document.getElementById('filterDateTo');
    const filterCategory = document.getElementById('filterCategory');
    const filterSearch = document.getElementById('filterSearch');
    
    if (filterDateFrom) filterDateFrom.value = '';
    if (filterDateTo) filterDateTo.value = '';
    if (filterCategory) filterCategory.value = '';
    if (filterSearch) filterSearch.value = '';
    
    // Resetar filtros
    activeFilters = {
        dateFrom: null,
        dateTo: null,
        category: null,
        search: null
    };
    
    manutencoesFiltered = [];
    
    // Atualizar interface
    atualizarListaManutencoes();
    
    showToast('Filtros limpos', 'info');
}

function hasActiveFilters() {
    return activeFilters.dateFrom || activeFilters.dateTo || 
           activeFilters.category || activeFilters.search;
}

function updateFilterResults(filtered, total) {
    const filterResults = document.getElementById('filterResults');
    if (!filterResults) return;
    
    if (hasActiveFilters()) {
        filterResults.textContent = `Mostrando ${filtered} de ${total} manutenções`;
        filterResults.classList.add('active');
    } else {
        filterResults.textContent = `Total: ${total} manutenções`;
        filterResults.classList.remove('active');
    }
}

// Adicionar estilos de animação fadeOut se não existir
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
}
