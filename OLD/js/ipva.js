// ============================================
// CARCARE - MÓDULO DE IPVA E LICENCIAMENTO
// ============================================

const IPVA = {
    STORAGE_KEY: 'carCareIPVA',
    
    // Obter todos os registros
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    // Salvar todos
    saveAll(ipvaList) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ipvaList));
    },
    
    // Obter registros de um veículo
    getByVehicle(vehicleId) {
        const all = this.getAll();
        return all.filter(i => i.veiculoId === vehicleId);
    },
    
    // Obter registro por ID
    getById(id) {
        const all = this.getAll();
        return all.find(i => i.id === id);
    },
    
    // Adicionar novo registro
    add(data) {
        const all = this.getAll();
        
        const newRecord = {
            id: all.length > 0 ? Math.max(...all.map(i => i.id)) + 1 : 1,
            veiculoId: data.veiculoId,
            ano: parseInt(data.ano),
            tipo: data.tipo, // 'IPVA', 'Licenciamento', 'Ambos'
            valorIPVA: data.valorIPVA ? parseFloat(data.valorIPVA) : 0,
            valorLicenciamento: data.valorLicenciamento ? parseFloat(data.valorLicenciamento) : 0,
            valorTotal: (data.valorIPVA ? parseFloat(data.valorIPVA) : 0) + 
                       (data.valorLicenciamento ? parseFloat(data.valorLicenciamento) : 0),
            dataVencimento: data.dataVencimento,
            status: data.status || 'Pendente', // Pendente, Pago, Atrasado
            dataPagamento: data.dataPagamento || null,
            localPagamento: data.localPagamento || '',
            formaPagamento: data.formaPagamento || '',
            numeroRecibo: data.numeroRecibo || '',
            parcelas: data.parcelas || 1,
            parcelaAtual: data.parcelaAtual || 1,
            observacoes: data.observacoes || '',
            documentos: data.documentos || [], // Array de fotos/documentos
            criadoEm: new Date().toISOString()
        };
        
        all.push(newRecord);
        this.saveAll(all);
        
        return newRecord;
    },
    
    // Atualizar registro
    update(id, data) {
        const all = this.getAll();
        const index = all.findIndex(i => i.id === id);
        
        if (index === -1) return false;
        
        all[index] = {
            ...all[index],
            ano: parseInt(data.ano),
            tipo: data.tipo,
            valorIPVA: data.valorIPVA ? parseFloat(data.valorIPVA) : 0,
            valorLicenciamento: data.valorLicenciamento ? parseFloat(data.valorLicenciamento) : 0,
            valorTotal: (data.valorIPVA ? parseFloat(data.valorIPVA) : 0) + 
                       (data.valorLicenciamento ? parseFloat(data.valorLicenciamento) : 0),
            dataVencimento: data.dataVencimento,
            status: data.status,
            dataPagamento: data.dataPagamento || null,
            localPagamento: data.localPagamento || '',
            formaPagamento: data.formaPagamento || '',
            numeroRecibo: data.numeroRecibo || '',
            parcelas: data.parcelas || 1,
            parcelaAtual: data.parcelaAtual || 1,
            observacoes: data.observacoes || '',
            documentos: data.documentos !== undefined ? data.documentos : all[index].documentos,
            atualizadoEm: new Date().toISOString()
        };
        
        this.saveAll(all);
        return true;
    },
    
    // Excluir registro
    delete(id) {
        const all = this.getAll();
        const filtered = all.filter(i => i.id !== id);
        
        if (filtered.length === all.length) return false;
        
        this.saveAll(filtered);
        return true;
    },
    
    // Marcar como pago
    markAsPaid(id, dataPagamento, localPagamento, formaPagamento, numeroRecibo) {
        const all = this.getAll();
        const index = all.findIndex(i => i.id === id);
        
        if (index === -1) return false;
        
        all[index].status = 'Pago';
        all[index].dataPagamento = dataPagamento;
        all[index].localPagamento = localPagamento;
        all[index].formaPagamento = formaPagamento;
        all[index].numeroRecibo = numeroRecibo;
        all[index].atualizadoEm = new Date().toISOString();
        
        this.saveAll(all);
        return true;
    },
    
    // Verificar vencimentos próximos
    getUpcoming(dias = 30) {
        const all = this.getAll();
        const hoje = new Date();
        const limite = new Date();
        limite.setDate(limite.getDate() + dias);
        
        return all.filter(i => {
            if (i.status === 'Pago') return false;
            
            const vencimento = new Date(i.dataVencimento + 'T00:00:00');
            return vencimento >= hoje && vencimento <= limite;
        });
    },
    
    // Verificar atrasados
    getOverdue() {
        const all = this.getAll();
        const hoje = new Date();
        
        return all.filter(i => {
            if (i.status === 'Pago') return false;
            
            const vencimento = new Date(i.dataVencimento + 'T00:00:00');
            return vencimento < hoje;
        });
    },
    
    // Interface: Mostrar modal de IPVA
    showIPVAModal(vehicleId = null) {
        const vehicle = vehicleId ? Vehicles.getById(vehicleId) : Vehicles.getCurrent();
        if (!vehicle) {
            showToast('Selecione um veículo primeiro', 'warning');
            return;
        }
        
        const registros = this.getByVehicle(vehicle.id);
        
        let html = `
            <div class="modal" id="ipvaModal">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-file-invoice-dollar"></i> IPVA/Licenciamento - ${vehicle.marca} ${vehicle.modelo}</h2>
                        <button class="close-modal" onclick="IPVA.closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <button class="btn btn-primary btn-block mb-3" onclick="IPVA.showForm(${vehicle.id})">
                            <i class="fas fa-plus"></i> Adicionar Registro
                        </button>
                        
                        <div class="ipva-list">
        `;
        
        if (registros.length === 0) {
            html += `
                <div class="empty-state">
                    <i class="fas fa-file-invoice"></i>
                    <h3>Nenhum registro de IPVA/Licenciamento</h3>
                    <p>Adicione os registros para manter o controle</p>
                </div>
            `;
        } else {
            // Ordenar por ano (mais recente primeiro)
            registros.sort((a, b) => b.ano - a.ano);
            
            registros.forEach(registro => {
                const statusClass = this.getStatusClass(registro.status);
                const statusIcon = this.getStatusIcon(registro.status);
                const vencimento = new Date(registro.dataVencimento + 'T00:00:00');
                const vencimentoFormatado = vencimento.toLocaleDateString('pt-BR');
                
                html += `
                    <div class="ipva-item">
                        <div class="ipva-header">
                            <div>
                                <h3>Ano ${registro.ano} - ${registro.tipo}</h3>
                                <span class="badge ${statusClass}">
                                    <i class="fas ${statusIcon}"></i> ${registro.status}
                                </span>
                            </div>
                            <div class="ipva-actions">
                                ${registro.status !== 'Pago' ? `
                                    <button class="btn btn-sm btn-secondary" onclick="IPVA.showPaymentForm(${registro.id})">
                                        <i class="fas fa-check"></i> Marcar como Pago
                                    </button>
                                ` : ''}
                                <button class="btn btn-sm btn-primary btn-icon" onclick="IPVA.showForm(${vehicle.id}, ${registro.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger btn-icon" onclick="IPVA.deleteWithConfirm(${registro.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="ipva-details">
                            <div class="ipva-detail-item">
                                <span class="label">Vencimento</span>
                                <span class="value">${vencimentoFormatado}</span>
                            </div>
                            ${registro.tipo !== 'Licenciamento' ? `
                                <div class="ipva-detail-item">
                                    <span class="label">Valor IPVA</span>
                                    <span class="value">R$ ${registro.valorIPVA.toFixed(2).replace('.', ',')}</span>
                                </div>
                            ` : ''}
                            ${registro.tipo !== 'IPVA' ? `
                                <div class="ipva-detail-item">
                                    <span class="label">Licenciamento</span>
                                    <span class="value">R$ ${registro.valorLicenciamento.toFixed(2).replace('.', ',')}</span>
                                </div>
                            ` : ''}
                            <div class="ipva-detail-item">
                                <span class="label">Total</span>
                                <span class="value currency">R$ ${registro.valorTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            ${registro.parcelas > 1 ? `
                                <div class="ipva-detail-item">
                                    <span class="label">Parcelas</span>
                                    <span class="value">${registro.parcelaAtual}/${registro.parcelas}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${registro.status === 'Pago' && registro.dataPagamento ? `
                            <div class="ipva-payment-info">
                                <i class="fas fa-check-circle"></i>
                                <div>
                                    <strong>Pago em:</strong> ${new Date(registro.dataPagamento + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    ${registro.localPagamento ? `<br><strong>Local:</strong> ${registro.localPagamento}` : ''}
                                    ${registro.formaPagamento ? `<br><strong>Forma:</strong> ${registro.formaPagamento}` : ''}
                                    ${registro.numeroRecibo ? `<br><strong>Recibo:</strong> ${registro.numeroRecibo}` : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${registro.observacoes ? `
                            <div class="ipva-observations">
                                <i class="fas fa-comment"></i> ${registro.observacoes}
                            </div>
                        ` : ''}
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
        
        const existingModal = document.getElementById('ipvaModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('ipvaModal').classList.add('active');
    },
    
    // Interface: Formulário
    showForm(vehicleId, editId = null) {
        const vehicle = Vehicles.getById(vehicleId);
        if (!vehicle) return;
        
        const registro = editId ? this.getById(editId) : null;
        const isEdit = registro !== null;
        const title = isEdit ? 'Editar Registro' : 'Novo Registro';
        
        const anoAtual = new Date().getFullYear();
        
        let html = `
            <div class="modal" id="ipvaFormModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-file-invoice-dollar"></i> ${title}</h2>
                        <button class="close-modal" onclick="IPVA.closeFormModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="ipvaForm">
                            <input type="hidden" id="ipvaVehicleId" value="${vehicleId}">
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Ano do Exercício *</label>
                                    <input type="number" id="ipvaAno" value="${registro?.ano || anoAtual}" min="2000" max="2050" required>
                                </div>
                                
                                <div class="form-group">
                                    <label>Tipo *</label>
                                    <select id="ipvaTipo" required>
                                        <option value="Ambos" ${registro?.tipo === 'Ambos' ? 'selected' : ''}>IPVA + Licenciamento</option>
                                        <option value="IPVA" ${registro?.tipo === 'IPVA' ? 'selected' : ''}>Apenas IPVA</option>
                                        <option value="Licenciamento" ${registro?.tipo === 'Licenciamento' ? 'selected' : ''}>Apenas Licenciamento</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row" id="ipvaValoresRow">
                                <div class="form-group" id="ipvaValorIPVAGroup">
                                    <label>Valor IPVA (R$)</label>
                                    <input type="number" step="0.01" id="ipvaValorIPVA" value="${registro?.valorIPVA || ''}" placeholder="0,00">
                                </div>
                                
                                <div class="form-group" id="ipvaValorLicGroup">
                                    <label>Valor Licenciamento (R$)</label>
                                    <input type="number" step="0.01" id="ipvaValorLic" value="${registro?.valorLicenciamento || ''}" placeholder="0,00">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Data de Vencimento *</label>
                                    <input type="date" id="ipvaVencimento" value="${registro?.dataVencimento || ''}" required>
                                </div>
                                
                                <div class="form-group">
                                    <label>Status *</label>
                                    <select id="ipvaStatus" required>
                                        <option value="Pendente" ${registro?.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                                        <option value="Pago" ${registro?.status === 'Pago' ? 'selected' : ''}>Pago</option>
                                        <option value="Atrasado" ${registro?.status === 'Atrasado' ? 'selected' : ''}>Atrasado</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div id="ipvaPagamentoFields" class="${registro?.status === 'Pago' ? '' : 'hidden'}">
                                <div class="form-group">
                                    <label>Data de Pagamento</label>
                                    <input type="date" id="ipvaDataPagamento" value="${registro?.dataPagamento || ''}">
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Local de Pagamento</label>
                                        <input type="text" id="ipvaLocalPagamento" value="${registro?.localPagamento || ''}" placeholder="Ex: Banco X">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Forma de Pagamento</label>
                                        <select id="ipvaFormaPagamento">
                                            <option value="">Selecione...</option>
                                            <option value="PIX" ${registro?.formaPagamento === 'PIX' ? 'selected' : ''}>PIX</option>
                                            <option value="Boleto" ${registro?.formaPagamento === 'Boleto' ? 'selected' : ''}>Boleto</option>
                                            <option value="Cartão de Crédito" ${registro?.formaPagamento === 'Cartão de Crédito' ? 'selected' : ''}>Cartão de Crédito</option>
                                            <option value="Débito Automático" ${registro?.formaPagamento === 'Débito Automático' ? 'selected' : ''}>Débito Automático</option>
                                            <option value="Dinheiro" ${registro?.formaPagamento === 'Dinheiro' ? 'selected' : ''}>Dinheiro</option>
                                            <option value="Outro" ${registro?.formaPagamento === 'Outro' ? 'selected' : ''}>Outro</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label>Número do Recibo/Protocolo</label>
                                    <input type="text" id="ipvaNumeroRecibo" value="${registro?.numeroRecibo || ''}" placeholder="Opcional">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Número de Parcelas</label>
                                    <input type="number" id="ipvaParcelas" value="${registro?.parcelas || 1}" min="1" max="12">
                                </div>
                                
                                <div class="form-group" id="ipvaParcelaAtualGroup" class="${(registro?.parcelas || 1) > 1 ? '' : 'hidden'}">
                                    <label>Parcela Atual</label>
                                    <input type="number" id="ipvaParcelaAtual" value="${registro?.parcelaAtual || 1}" min="1">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Observações</label>
                                <textarea id="ipvaObservacoes" rows="3" placeholder="Informações adicionais...">${registro?.observacoes || ''}</textarea>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-save"></i> ${isEdit ? 'Atualizar' : 'Adicionar'} Registro
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('ipvaFormModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('ipvaFormModal');
        modal.classList.add('active');
        
        // Event listeners
        document.getElementById('ipvaForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveForm(editId);
        });
        
        // Mostrar/esconder campos baseado no tipo
        document.getElementById('ipvaTipo').addEventListener('change', (e) => {
            const tipo = e.target.value;
            const ipvaGroup = document.getElementById('ipvaValorIPVAGroup');
            const licGroup = document.getElementById('ipvaValorLicGroup');
            
            if (tipo === 'IPVA') {
                ipvaGroup.style.display = 'block';
                licGroup.style.display = 'none';
            } else if (tipo === 'Licenciamento') {
                ipvaGroup.style.display = 'none';
                licGroup.style.display = 'block';
            } else {
                ipvaGroup.style.display = 'block';
                licGroup.style.display = 'block';
            }
        });
        
        // Mostrar/esconder campos de pagamento
        document.getElementById('ipvaStatus').addEventListener('change', (e) => {
            const fields = document.getElementById('ipvaPagamentoFields');
            fields.classList.toggle('hidden', e.target.value !== 'Pago');
        });
        
        // Mostrar/esconder parcela atual
        document.getElementById('ipvaParcelas').addEventListener('change', (e) => {
            const group = document.getElementById('ipvaParcelaAtualGroup');
            group.classList.toggle('hidden', parseInt(e.target.value) <= 1);
        });
    },
    
    saveForm(editId = null) {
        const data = {
            veiculoId: parseInt(document.getElementById('ipvaVehicleId').value),
            ano: document.getElementById('ipvaAno').value,
            tipo: document.getElementById('ipvaTipo').value,
            valorIPVA: document.getElementById('ipvaValorIPVA').value,
            valorLicenciamento: document.getElementById('ipvaValorLic').value,
            dataVencimento: document.getElementById('ipvaVencimento').value,
            status: document.getElementById('ipvaStatus').value,
            dataPagamento: document.getElementById('ipvaDataPagamento').value,
            localPagamento: document.getElementById('ipvaLocalPagamento').value,
            formaPagamento: document.getElementById('ipvaFormaPagamento').value,
            numeroRecibo: document.getElementById('ipvaNumeroRecibo').value,
            parcelas: document.getElementById('ipvaParcelas').value,
            parcelaAtual: document.getElementById('ipvaParcelaAtual').value,
            observacoes: document.getElementById('ipvaObservacoes').value
        };
        
        if (editId) {
            this.update(editId, data);
            showToast('Registro atualizado com sucesso!', 'success');
        } else {
            this.add(data);
            showToast('Registro adicionado com sucesso!', 'success');
        }
        
        this.closeFormModal();
        this.showIPVAModal(data.veiculoId);
    },
    
    showPaymentForm(id) {
        const registro = this.getById(id);
        if (!registro) return;
        
        const hoje = new Date().toISOString().split('T')[0];
        
        let html = `
            <div class="modal" id="ipvaPaymentModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-check-circle"></i> Registrar Pagamento</h2>
                        <button class="close-modal" onclick="IPVA.closePaymentModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="ipvaPaymentForm">
                            <input type="hidden" id="paymentRecordId" value="${id}">
                            
                            <div class="form-group">
                                <label>Data de Pagamento *</label>
                                <input type="date" id="paymentDate" value="${hoje}" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Local de Pagamento *</label>
                                <input type="text" id="paymentLocal" placeholder="Ex: Banco Bradesco, App Gov.br" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Forma de Pagamento *</label>
                                <select id="paymentForma" required>
                                    <option value="">Selecione...</option>
                                    <option value="PIX">PIX</option>
                                    <option value="Boleto">Boleto</option>
                                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                                    <option value="Débito Automático">Débito Automático</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Número do Recibo/Protocolo</label>
                                <input type="text" id="paymentRecibo" placeholder="Opcional">
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-check"></i> Confirmar Pagamento
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('ipvaPaymentModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('ipvaPaymentModal');
        modal.classList.add('active');
        
        document.getElementById('ipvaPaymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('paymentRecordId').value);
            const data = document.getElementById('paymentDate').value;
            const local = document.getElementById('paymentLocal').value;
            const forma = document.getElementById('paymentForma').value;
            const recibo = document.getElementById('paymentRecibo').value;
            
            this.markAsPaid(id, data, local, forma, recibo);
            this.closePaymentModal();
            
            const registro = this.getById(id);
            if (registro) {
                this.showIPVAModal(registro.veiculoId);
            }
            
            showToast('Pagamento registrado com sucesso!', 'success');
        });
    },
    
    deleteWithConfirm(id) {
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            const registro = this.getById(id);
            const vehicleId = registro ? registro.veiculoId : null;
            
            this.delete(id);
            showToast('Registro excluído com sucesso!', 'success');
            
            if (vehicleId) {
                this.showIPVAModal(vehicleId);
            }
        }
    },
    
    getStatusClass(status) {
        const classes = {
            'Pago': 'badge-success',
            'Pendente': 'badge-warning',
            'Atrasado': 'badge-danger'
        };
        return classes[status] || 'badge-info';
    },
    
    getStatusIcon(status) {
        const icons = {
            'Pago': 'fa-check-circle',
            'Pendente': 'fa-clock',
            'Atrasado': 'fa-exclamation-triangle'
        };
        return icons[status] || 'fa-info-circle';
    },
    
    closeModal() {
        const modal = document.getElementById('ipvaModal');
        if (modal) modal.remove();
    },
    
    closeFormModal() {
        const modal = document.getElementById('ipvaFormModal');
        if (modal) modal.remove();
    },
    
    closePaymentModal() {
        const modal = document.getElementById('ipvaPaymentModal');
        if (modal) modal.remove();
    }
};
