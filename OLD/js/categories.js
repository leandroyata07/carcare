// ============================================
// CARCARE - MÓDULO DE CATEGORIAS
// ============================================

const Categories = {
    // Obter categorias padrão
    getDefaultCategories() {
        return [
            { id: 1, nome: 'Troca de óleo', cor: '#10b981', icone: 'fa-oil-can' },
            { id: 2, nome: 'Filtros', cor: '#3b82f6', icone: 'fa-filter' },
            { id: 3, nome: 'Freios', cor: '#ef4444', icone: 'fa-brake-warning' },
            { id: 4, nome: 'Pneus', cor: '#8b5cf6', icone: 'fa-tire' },
            { id: 5, nome: 'Suspensão', cor: '#f59e0b', icone: 'fa-car-crash' },
            { id: 6, nome: 'Bateria', cor: '#06b6d4', icone: 'fa-car-battery' },
            { id: 7, nome: 'Ar Condicionado', cor: '#14b8a6', icone: 'fa-snowflake' },
            { id: 8, nome: 'Motor', cor: '#dc2626', icone: 'fa-engine' },
            { id: 9, nome: 'Transmissão', cor: '#7c3aed', icone: 'fa-gears' },
            { id: 10, nome: 'Sistema Elétrico', cor: '#eab308', icone: 'fa-bolt' },
            { id: 11, nome: 'Limpeza', cor: '#22c55e', icone: 'fa-soap' },
            { id: 12, nome: 'Outros', cor: '#64748b', icone: 'fa-wrench' }
        ];
    },
    
    // Mostrar modal de categorias
    showCategoriesModal() {
        const modal = document.getElementById('categoriesModal');
        if (!modal) {
            this.createCategoriesModal();
        } else {
            this.updateCategoriesList();
            modal.classList.add('active');
        }
    },
    
    // Criar modal de categorias dinamicamente
    createCategoriesModal() {
        const modalHTML = `
            <div class="modal" id="categoriesModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-tags"></i> Gerenciar Categorias</h2>
                        <button class="close-modal" onclick="Categories.closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div style="margin-bottom: 20px;">
                            <button class="btn btn-primary" onclick="Categories.showAddCategoryForm()">
                                <i class="fas fa-plus"></i> Nova Categoria
                            </button>
                        </div>
                        
                        <div id="addCategoryForm" class="hidden" style="background: var(--light); padding: 20px; border-radius: var(--border-radius-sm); margin-bottom: 20px;">
                            <h3 style="margin-bottom: 16px;">Adicionar Nova Categoria</h3>
                            <div class="form-group">
                                <label>Nome da Categoria *</label>
                                <input type="text" id="newCategoryName" placeholder="Ex: Documentação">
                            </div>
                            <div class="form-group">
                                <label>Cor</label>
                                <input type="color" id="newCategoryColor" value="#3b82f6">
                            </div>
                            <div class="form-group">
                                <label>Ícone (FontAwesome)</label>
                                <input type="text" id="newCategoryIcon" placeholder="fa-file-alt" value="fa-tag">
                                <small style="color: var(--gray); font-size: 12px;">
                                    Visite <a href="https://fontawesome.com/icons" target="_blank">FontAwesome</a> para ver ícones disponíveis
                                </small>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn btn-primary" onclick="Categories.addCategory()">
                                    <i class="fas fa-save"></i> Salvar
                                </button>
                                <button class="btn btn-outline" onclick="Categories.hideAddCategoryForm()">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                        
                        <div id="categoriesList"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.updateCategoriesList();
        document.getElementById('categoriesModal').classList.add('active');
    },
    
    // Atualizar lista de categorias
    updateCategoriesList() {
        const container = document.getElementById('categoriesList');
        if (!container) return;
        
        container.innerHTML = '<div class="category-list"></div>';
        const list = container.querySelector('.category-list');
        
        categorias.forEach(categoria => {
            const item = document.createElement('div');
            item.className = 'category-item';
            item.style.borderColor = categoria.cor;
            
            item.innerHTML = `
                <div class="category-icon" style="color: ${categoria.cor}">
                    <i class="fas ${categoria.icone}"></i>
                </div>
                <div class="category-name">${categoria.nome}</div>
                <div class="category-count">
                    ${this.getCategoryCount(categoria.id)} manutenções
                </div>
                <div class="category-actions">
                    <button class="btn btn-sm btn-primary btn-icon" onclick="Categories.editCategory(${categoria.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="Categories.deleteCategory(${categoria.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    },
    
    // Contar quantas manutenções usam uma categoria
    getCategoryCount(categoryId) {
        return manutencoes.filter(m => m.categoriaId === categoryId).length;
    },
    
    // Mostrar formulário de adicionar categoria
    showAddCategoryForm() {
        document.getElementById('addCategoryForm').classList.remove('hidden');
        document.getElementById('newCategoryName').focus();
    },
    
    // Esconder formulário de adicionar categoria
    hideAddCategoryForm() {
        document.getElementById('addCategoryForm').classList.add('hidden');
        document.getElementById('newCategoryName').value = '';
        document.getElementById('newCategoryColor').value = '#3b82f6';
        document.getElementById('newCategoryIcon').value = 'fa-tag';
    },
    
    // Adicionar nova categoria
    addCategory() {
        const nome = document.getElementById('newCategoryName').value.trim();
        const cor = document.getElementById('newCategoryColor').value;
        const icone = document.getElementById('newCategoryIcon').value.trim();
        
        if (!nome) {
            showToast('Por favor, informe o nome da categoria', 'warning');
            return;
        }
        
        const novaCategoria = {
            id: categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1,
            nome: nome,
            cor: cor,
            icone: icone || 'fa-tag'
        };
        
        categorias.push(novaCategoria);
        salvarCategorias();
        this.updateCategoriesList();
        this.hideAddCategoryForm();
        showToast('Categoria adicionada com sucesso!', 'success');
    },
    
    // Editar categoria
    editCategory(id) {
        const categoria = categorias.find(c => c.id === id);
        if (!categoria) return;
        
        const novoNome = prompt('Nome da categoria:', categoria.nome);
        if (novoNome && novoNome.trim()) {
            categoria.nome = novoNome.trim();
            salvarCategorias();
            this.updateCategoriesList();
            atualizarInterface(); // Atualizar lista de manutenções
            showToast('Categoria atualizada com sucesso!', 'success');
        }
    },
    
    // Excluir categoria
    deleteCategory(id) {
        const count = this.getCategoryCount(id);
        
        let confirmMessage = 'Deseja realmente excluir esta categoria?';
        if (count > 0) {
            confirmMessage = `Esta categoria possui ${count} manutenção(ões) associada(s). Ao excluir, as manutenções ficarão sem categoria. Continuar?`;
        }
        
        if (!confirm(confirmMessage)) return;
        
        // Remover categoria das manutenções
        manutencoes.forEach(m => {
            if (m.categoriaId === id) {
                m.categoriaId = null;
            }
        });
        
        // Remover categoria
        categorias = categorias.filter(c => c.id !== id);
        
        salvarDados();
        salvarCategorias();
        this.updateCategoriesList();
        atualizarInterface();
        showToast('Categoria excluída com sucesso!', 'success');
    },
    
    // Fechar modal
    closeModal() {
        const modal = document.getElementById('categoriesModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // Obter categoria por ID
    getCategoryById(id) {
        return categorias.find(c => c.id === id);
    },
    
    // Obter nome da categoria
    getCategoryName(id) {
        const categoria = this.getCategoryById(id);
        return categoria ? categoria.nome : 'Sem categoria';
    },
    
    // Obter cor da categoria
    getCategoryColor(id) {
        const categoria = this.getCategoryById(id);
        return categoria ? categoria.cor : '#64748b';
    },
    
    // Resetar para categorias padrão
    resetToDefault() {
        if (!confirm('Tem certeza que deseja resetar para as categorias padrão? Esta ação não pode ser desfeita.')) {
            return;
        }
        
        categorias = this.getDefaultCategories();
        salvarCategorias();
        this.updateCategoriesList();
        showToast('Categorias resetadas com sucesso!', 'success');
    }
};
