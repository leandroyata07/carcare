// ============================================
// CARCARE - MÓDULO DE GERENCIAMENTO DE VEÍCULOS
// ============================================

const Vehicles = {
    STORAGE_KEY: 'carCareVehicles',
    CURRENT_KEY: 'carCareCurrentVehicle',
    
    // Obter todos os veículos
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    // Salvar veículos
    saveAll(vehicles) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(vehicles));
    },
    
    // Obter veículo atual
    getCurrent() {
        const currentId = localStorage.getItem(this.CURRENT_KEY);
        if (!currentId) {
            // Se não houver veículo atual, pegar o primeiro
            const vehicles = this.getAll();
            if (vehicles.length > 0) {
                this.setCurrent(vehicles[0].id);
                return vehicles[0];
            }
            return null;
        }
        return this.getById(parseInt(currentId));
    },
    
    // Definir veículo atual
    setCurrent(vehicleId) {
        localStorage.setItem(this.CURRENT_KEY, vehicleId.toString());
        // Atualizar interface
        if (window.atualizarInterface) {
            window.atualizarInterface();
        }
    },
    
    // Obter veículo por ID
    getById(id) {
        const vehicles = this.getAll();
        return vehicles.find(v => v.id === id);
    },
    
    // Adicionar novo veículo
    add(vehicleData) {
        const vehicles = this.getAll();
        
        const newVehicle = {
            id: vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
            tipo: vehicleData.tipo, // carro, moto, caminhão, etc
            marca: vehicleData.marca,
            modelo: vehicleData.modelo,
            ano: parseInt(vehicleData.ano),
            placa: vehicleData.placa.toUpperCase(),
            cor: vehicleData.cor || '',
            quilometragem: parseInt(vehicleData.quilometragem),
            renavam: vehicleData.renavam || '',
            chassi: vehicleData.chassi || '',
            combustivel: vehicleData.combustivel || 'Gasolina',
            foto: vehicleData.foto || null,
            criadoEm: new Date().toISOString()
        };
        
        vehicles.push(newVehicle);
        this.saveAll(vehicles);
        
        // Se for o primeiro veículo, definir como atual
        if (vehicles.length === 1) {
            this.setCurrent(newVehicle.id);
        }
        
        return newVehicle;
    },
    
    // Atualizar veículo
    update(id, vehicleData) {
        const vehicles = this.getAll();
        const index = vehicles.findIndex(v => v.id === id);
        
        if (index === -1) return false;
        
        vehicles[index] = {
            ...vehicles[index],
            tipo: vehicleData.tipo,
            marca: vehicleData.marca,
            modelo: vehicleData.modelo,
            ano: parseInt(vehicleData.ano),
            placa: vehicleData.placa.toUpperCase(),
            cor: vehicleData.cor || vehicles[index].cor,
            quilometragem: parseInt(vehicleData.quilometragem),
            renavam: vehicleData.renavam || vehicles[index].renavam,
            chassi: vehicleData.chassi || vehicles[index].chassi,
            combustivel: vehicleData.combustivel || vehicles[index].combustivel,
            foto: vehicleData.foto !== undefined ? vehicleData.foto : vehicles[index].foto,
            atualizadoEm: new Date().toISOString()
        };
        
        this.saveAll(vehicles);
        
        // Se for o veículo atual, atualizar interface
        const current = this.getCurrent();
        if (current && current.id === id) {
            if (window.atualizarInterface) {
                window.atualizarInterface();
            }
        }
        
        return true;
    },
    
    // Excluir veículo
    delete(id) {
        const vehicles = this.getAll();
        const filtered = vehicles.filter(v => v.id !== id);
        
        if (filtered.length === vehicles.length) return false;
        
        this.saveAll(filtered);
        
        // Se excluir o veículo atual, definir outro
        const current = this.getCurrent();
        if (!current || current.id === id) {
            if (filtered.length > 0) {
                this.setCurrent(filtered[0].id);
            } else {
                localStorage.removeItem(this.CURRENT_KEY);
            }
        }
        
        // Excluir manutenções do veículo
        this.deleteVehicleMaintenances(id);
        // Excluir IPVA do veículo
        this.deleteVehicleIPVA(id);
        
        return true;
    },
    
    // Excluir manutenções de um veículo
    deleteVehicleMaintenances(vehicleId) {
        const data = localStorage.getItem('carCareManutencoes');
        if (!data) return;
        
        const manutencoes = JSON.parse(data);
        const filtered = manutencoes.filter(m => m.veiculoId !== vehicleId);
        localStorage.setItem('carCareManutencoes', JSON.stringify(filtered));
    },
    
    // Excluir IPVA de um veículo
    deleteVehicleIPVA(vehicleId) {
        const data = localStorage.getItem('carCareIPVA');
        if (!data) return;
        
        const ipvaList = JSON.parse(data);
        const filtered = ipvaList.filter(i => i.veiculoId !== vehicleId);
        localStorage.setItem('carCareIPVA', JSON.stringify(filtered));
    },
    
    // Migrar veículo único para sistema de múltiplos
    migrateOldVehicle() {
        const vehicles = this.getAll();
        if (vehicles.length > 0) return; // Já migrado
        
        const oldVehicle = localStorage.getItem('carCareVeiculo');
        if (!oldVehicle) return;
        
        const data = JSON.parse(oldVehicle);
        const newVehicle = {
            id: 1,
            tipo: 'Carro',
            marca: data.marca,
            modelo: data.modelo,
            ano: data.ano,
            placa: data.placa,
            cor: '',
            quilometragem: data.quilometragem,
            renavam: '',
            chassi: '',
            combustivel: 'Gasolina',
            foto: null,
            criadoEm: new Date().toISOString()
        };
        
        this.saveAll([newVehicle]);
        this.setCurrent(1);
        
        // Migrar manutenções
        const manutencoes = JSON.parse(localStorage.getItem('carCareManutencoes') || '[]');
        manutencoes.forEach(m => {
            if (!m.veiculoId) m.veiculoId = 1;
        });
        localStorage.setItem('carCareManutencoes', JSON.stringify(manutencoes));
        
        // Remover chave antiga
        localStorage.removeItem('carCareVeiculo');
        
        showToast('Sistema atualizado para múltiplos veículos!', 'success');
    },
    
    // Interface: Mostrar lista de veículos
    showVehiclesList() {
        const vehicles = this.getAll();
        const current = this.getCurrent();
        
        let html = `
            <div class="modal" id="vehiclesListModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-cars"></i> Meus Veículos</h2>
                        <button class="close-modal" onclick="Vehicles.closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <button class="btn btn-primary btn-block mb-3" onclick="Vehicles.showAddForm()">
                            <i class="fas fa-plus"></i> Adicionar Veículo
                        </button>
                        
                        <div class="vehicles-grid">
        `;
        
        if (vehicles.length === 0) {
            html += `
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <h3>Nenhum veículo cadastrado</h3>
                    <p>Adicione seu primeiro veículo para começar</p>
                </div>
            `;
        } else {
            vehicles.forEach(vehicle => {
                const isActive = current && current.id === vehicle.id;
                const icon = this.getVehicleIcon(vehicle.tipo);
                
                html += `
                    <div class="vehicle-card-item ${isActive ? 'active' : ''}" onclick="Vehicles.setCurrent(${vehicle.id})">
                        <div class="vehicle-card-icon" style="color: ${isActive ? 'var(--primary)' : 'var(--gray)'}">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div class="vehicle-card-info">
                            <h3>${vehicle.marca} ${vehicle.modelo}</h3>
                            <p>${vehicle.placa} • ${vehicle.ano}</p>
                            <span class="badge badge-info">${vehicle.tipo}</span>
                        </div>
                        <div class="vehicle-card-actions">
                            <button class="btn btn-sm btn-primary btn-icon" onclick="event.stopPropagation(); Vehicles.showEditForm(${vehicle.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-icon" onclick="event.stopPropagation(); Vehicles.deleteWithConfirm(${vehicle.id})" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        ${isActive ? '<div class="vehicle-card-badge">ATIVO</div>' : ''}
                    </div>
                `;
            });
        }
        
        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente
        const existingModal = document.getElementById('vehiclesListModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('vehiclesListModal').classList.add('active');
    },
    
    // Interface: Formulário de adicionar/editar
    showAddForm() {
        this.showForm(null);
    },
    
    showEditForm(id) {
        const vehicle = this.getById(id);
        if (!vehicle) return;
        this.showForm(vehicle);
    },
    
    showForm(vehicle = null) {
        const isEdit = vehicle !== null;
        const title = isEdit ? 'Editar Veículo' : 'Adicionar Veículo';
        
        let html = `
            <div class="modal" id="vehicleFormModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-car"></i> ${title}</h2>
                        <button class="close-modal" onclick="Vehicles.closeFormModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="vehicleFormNew">
                            <div class="form-group">
                                <label>Tipo de Veículo *</label>
                                <select id="inputTipoVeiculo" required>
                                    <option value="">Selecione...</option>
                                    <option value="Carro" ${vehicle?.tipo === 'Carro' ? 'selected' : ''}>🚗 Carro</option>
                                    <option value="Moto" ${vehicle?.tipo === 'Moto' ? 'selected' : ''}>🏍️ Moto</option>
                                    <option value="Caminhão" ${vehicle?.tipo === 'Caminhão' ? 'selected' : ''}>🚚 Caminhão</option>
                                    <option value="Van" ${vehicle?.tipo === 'Van' ? 'selected' : ''}>🚐 Van</option>
                                    <option value="SUV" ${vehicle?.tipo === 'SUV' ? 'selected' : ''}>🚙 SUV</option>
                                    <option value="Pickup" ${vehicle?.tipo === 'Pickup' ? 'selected' : ''}>🛻 Pickup</option>
                                    <option value="Outro" ${vehicle?.tipo === 'Outro' ? 'selected' : ''}>🚗 Outro</option>
                                </select>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Marca *</label>
                                    <input type="text" id="inputMarcaVeiculo" value="${vehicle?.marca || ''}" placeholder="Ex: Ford" required>
                                </div>
                                
                                <div class="form-group">
                                    <label>Modelo *</label>
                                    <input type="text" id="inputModeloVeiculo" value="${vehicle?.modelo || ''}" placeholder="Ex: Focus" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Ano *</label>
                                    <input type="number" id="inputAnoVeiculo" value="${vehicle?.ano || ''}" min="1900" max="2030" required>
                                </div>
                                
                                <div class="form-group">
                                    <label>Placa *</label>
                                    <input type="text" id="inputPlacaVeiculo" value="${vehicle?.placa || ''}" placeholder="ABC-1234" required>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Cor</label>
                                    <input type="text" id="inputCorVeiculo" value="${vehicle?.cor || ''}" placeholder="Ex: Prata">
                                </div>
                                
                                <div class="form-group">
                                    <label>Combustível</label>
                                    <select id="inputCombustivel">
                                        <option value="Gasolina" ${vehicle?.combustivel === 'Gasolina' ? 'selected' : ''}>Gasolina</option>
                                        <option value="Etanol" ${vehicle?.combustivel === 'Etanol' ? 'selected' : ''}>Etanol</option>
                                        <option value="Flex" ${vehicle?.combustivel === 'Flex' ? 'selected' : ''}>Flex</option>
                                        <option value="Diesel" ${vehicle?.combustivel === 'Diesel' ? 'selected' : ''}>Diesel</option>
                                        <option value="GNV" ${vehicle?.combustivel === 'GNV' ? 'selected' : ''}>GNV</option>
                                        <option value="Elétrico" ${vehicle?.combustivel === 'Elétrico' ? 'selected' : ''}>Elétrico</option>
                                        <option value="Híbrido" ${vehicle?.combustivel === 'Híbrido' ? 'selected' : ''}>Híbrido</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Quilometragem Atual *</label>
                                <input type="number" id="inputKmVeiculo" value="${vehicle?.quilometragem || ''}" placeholder="Em km" required>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>RENAVAM</label>
                                    <input type="text" id="inputRenavam" value="${vehicle?.renavam || ''}" placeholder="Opcional">
                                </div>
                                
                                <div class="form-group">
                                    <label>Chassi</label>
                                    <input type="text" id="inputChassi" value="${vehicle?.chassi || ''}" placeholder="Opcional">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Foto do Veículo</label>
                                <div class="file-input-wrapper">
                                    <input type="file" id="inputFotoVeiculo" accept="image/*">
                                    <label for="inputFotoVeiculo" class="file-input-label">
                                        <i class="fas fa-camera"></i>
                                        <span>Selecionar foto</span>
                                    </label>
                                </div>
                                <div id="vehicleImagePreview" class="image-preview ${vehicle?.foto ? '' : 'hidden'}">
                                    ${vehicle?.foto ? `<img src="${vehicle.foto}" alt="Foto do veículo">` : ''}
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-save"></i> ${isEdit ? 'Atualizar' : 'Adicionar'} Veículo
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('vehicleFormModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('vehicleFormModal');
        modal.classList.add('active');
        
        // Event listeners
        document.getElementById('vehicleFormNew').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveForm(vehicle ? vehicle.id : null);
        });
        
        document.getElementById('inputFotoVeiculo').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file, (foto) => {
                    if (foto) {
                        const preview = document.getElementById('vehicleImagePreview');
                        preview.innerHTML = `<img src="${foto}" alt="Preview">`;
                        preview.classList.remove('hidden');
                    }
                });
            }
        });
    },
    
    saveForm(editId = null) {
        const data = {
            tipo: document.getElementById('inputTipoVeiculo').value,
            marca: document.getElementById('inputMarcaVeiculo').value,
            modelo: document.getElementById('inputModeloVeiculo').value,
            ano: document.getElementById('inputAnoVeiculo').value,
            placa: document.getElementById('inputPlacaVeiculo').value,
            cor: document.getElementById('inputCorVeiculo').value,
            combustivel: document.getElementById('inputCombustivel').value,
            quilometragem: document.getElementById('inputKmVeiculo').value,
            renavam: document.getElementById('inputRenavam').value,
            chassi: document.getElementById('inputChassi').value
        };
        
        const fotoInput = document.getElementById('inputFotoVeiculo');
        if (fotoInput.files && fotoInput.files[0]) {
            handleImageUpload(fotoInput.files[0], (foto) => {
                data.foto = foto;
                this.finalizeSave(editId, data);
            });
        } else {
            this.finalizeSave(editId, data);
        }
    },
    
    finalizeSave(editId, data) {
        if (editId) {
            this.update(editId, data);
            showToast('Veículo atualizado com sucesso!', 'success');
        } else {
            this.add(data);
            showToast('Veículo adicionado com sucesso!', 'success');
        }
        
        this.closeFormModal();
        
        // Atualizar lista se estiver aberta
        const listModal = document.getElementById('vehiclesListModal');
        if (listModal && listModal.classList.contains('active')) {
            this.showVehiclesList();
        }
        
        // Atualizar interface principal
        if (window.atualizarInterface) {
            window.atualizarInterface();
        }
    },
    
    deleteWithConfirm(id) {
        const vehicle = this.getById(id);
        if (!vehicle) return;
        
        const msg = `Tem certeza que deseja excluir o veículo ${vehicle.marca} ${vehicle.modelo}?\n\nTodas as manutenções e registros de IPVA deste veículo também serão excluídos.`;
        
        if (confirm(msg)) {
            this.delete(id);
            showToast('Veículo excluído com sucesso!', 'success');
            this.showVehiclesList();
        }
    },
    
    getVehicleIcon(tipo) {
        const icons = {
            'Carro': 'fa-car',
            'Moto': 'fa-motorcycle',
            'Caminhão': 'fa-truck',
            'Van': 'fa-van-shuttle',
            'SUV': 'fa-truck-pickup',
            'Pickup': 'fa-truck-pickup',
            'Outro': 'fa-car'
        };
        return icons[tipo] || 'fa-car';
    },
    
    closeModal() {
        const modal = document.getElementById('vehiclesListModal');
        if (modal) modal.remove();
    },
    
    closeFormModal() {
        const modal = document.getElementById('vehicleFormModal');
        if (modal) modal.remove();
    }
};

// Inicializar e migrar dados antigos
document.addEventListener('DOMContentLoaded', () => {
    if (Auth.isLoggedIn()) {
        Vehicles.migrateOldVehicle();
    }
});
