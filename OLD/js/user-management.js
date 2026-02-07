// ============================================
// CARCARE - MÓDULO DE GERENCIAMENTO DE USUÁRIOS
// ============================================

const UserManagement = {
    // Mostrar interface de gerenciamento
    showManagement() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            showToast('Você precisa estar logado', 'danger');
            return;
        }
        
        const users = Auth.getUsers();
        
        let html = `
            <div class="modal" id="userManagementModal">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h2><i class="fas fa-users-cog"></i> Gerenciamento de Usuários</h2>
                        <button class="close-modal" onclick="UserManagement.closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="user-management-header">
                            <button class="btn btn-primary" onclick="UserManagement.showAddUserForm()">
                                <i class="fas fa-user-plus"></i> Adicionar Usuário
                            </button>
                            <button class="btn btn-secondary" onclick="UserManagement.showChangePasswordForm()">
                                <i class="fas fa-key"></i> Alterar Minha Senha
                            </button>
                        </div>
                        
                        <div class="users-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuário</th>
                                        <th>Nome</th>
                                        <th>Criado em</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
        `;
        
        if (users.length === 0) {
            html += `
                <tr>
                    <td colspan="5" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <p>Nenhum usuário cadastrado</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            users.forEach(user => {
                const dataCriacao = new Date(user.createdAt).toLocaleDateString('pt-BR');
                const isCurrentUser = user.id === currentUser.userId;
                
                html += `
                    <tr${isCurrentUser ? ' class="current-user"' : ''}>
                        <td>${user.id}</td>
                        <td>
                            <strong>${user.username}</strong>
                            ${isCurrentUser ? '<span class="badge badge-success ml-1">Você</span>' : ''}
                        </td>
                        <td>${user.name}</td>
                        <td>${dataCriacao}</td>
                        <td>
                            <div class="user-actions">
                                <button class="btn btn-sm btn-primary btn-icon" onclick="UserManagement.showEditUserForm(${user.id})" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary btn-icon" onclick="UserManagement.showResetPasswordForm(${user.id})" title="Redefinir Senha">
                                    <i class="fas fa-key"></i>
                                </button>
                                ${!isCurrentUser ? `
                                    <button class="btn btn-sm btn-danger btn-icon" onclick="UserManagement.deleteUser(${user.id})" title="Excluir">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
        
        html += `
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="user-stats mt-3">
                            <div class="stat-card">
                                <i class="fas fa-users"></i>
                                <div>
                                    <strong>${users.length}</strong>
                                    <span>Usuários Cadastrados</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-user-check"></i>
                                <div>
                                    <strong>1</strong>
                                    <span>Usuário Ativo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('userManagementModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById('userManagementModal').classList.add('active');
    },
    
    // Formulário: Adicionar usuário
    showAddUserForm() {
        this.showUserForm(null);
    },
    
    // Formulário: Editar usuário
    showEditUserForm(userId) {
        const users = Auth.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        this.showUserForm(user);
    },
    
    showUserForm(user = null) {
        const isEdit = user !== null;
        const title = isEdit ? 'Editar Usuário' : 'Adicionar Usuário';
        
        let html = `
            <div class="modal" id="userFormModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-user-${isEdit ? 'edit' : 'plus'}"></i> ${title}</h2>
                        <button class="close-modal" onclick="UserManagement.closeUserFormModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="userForm">
                            ${isEdit ? `<input type="hidden" id="userFormId" value="${user.id}">` : ''}
                            
                            <div class="form-group">
                                <label for="userFormUsername">Nome de Usuário *</label>
                                <input 
                                    type="text" 
                                    id="userFormUsername" 
                                    value="${user?.username || ''}" 
                                    placeholder="Ex: joao.silva"
                                    ${isEdit ? 'readonly' : ''}
                                    required>
                                ${isEdit ? '<small>O nome de usuário não pode ser alterado</small>' : ''}
                            </div>
                            
                            <div class="form-group">
                                <label for="userFormName">Nome Completo *</label>
                                <input 
                                    type="text" 
                                    id="userFormName" 
                                    value="${user?.name || ''}" 
                                    placeholder="Ex: João Silva"
                                    required>
                            </div>
                            
                            ${!isEdit ? `
                                <div class="form-group">
                                    <label for="userFormPassword">Senha *</label>
                                    <input 
                                        type="password" 
                                        id="userFormPassword" 
                                        placeholder="Mínimo 6 caracteres"
                                        minlength="6"
                                        required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="userFormPasswordConfirm">Confirmar Senha *</label>
                                    <input 
                                        type="password" 
                                        id="userFormPasswordConfirm" 
                                        placeholder="Digite a senha novamente"
                                        minlength="6"
                                        required>
                                </div>
                            ` : ''}
                            
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-save"></i> ${isEdit ? 'Atualizar' : 'Criar'} Usuário
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('userFormModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('userFormModal');
        modal.classList.add('active');
        
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser(isEdit);
        });
    },
    
    saveUser(isEdit) {
        const username = document.getElementById('userFormUsername').value.trim();
        const name = document.getElementById('userFormName').value.trim();
        
        if (!username || !name) {
            showToast('Preencha todos os campos obrigatórios', 'warning');
            return;
        }
        
        if (isEdit) {
            // Editar usuário existente
            const userId = parseInt(document.getElementById('userFormId').value);
            const users = Auth.getUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                showToast('Usuário não encontrado', 'danger');
                return;
            }
            
            users[userIndex].name = name;
            Auth.saveUsers(users);
            
            showToast('Usuário atualizado com sucesso!', 'success');
            document.getElementById('userFormModal').remove();
            this.showManagement();
        } else {
            // Criar novo usuário
            const password = document.getElementById('userFormPassword').value;
            const passwordConfirm = document.getElementById('userFormPasswordConfirm').value;
            
            if (password !== passwordConfirm) {
                showToast('As senhas não coincidem', 'warning');
                return;
            }
            
            if (password.length < 6) {
                showToast('A senha deve ter no mínimo 6 caracteres', 'warning');
                return;
            }
            
            const result = Auth.createUser(username, password, name);
            
            if (result.success) {
                showToast('Usuário criado com sucesso!', 'success');
                document.getElementById('userFormModal').remove();
                this.showManagement();
            } else {
                showToast(result.message, 'danger');
            }
        }
    },
    
    // Alterar senha do usuário atual
    showChangePasswordForm() {
        let html = `
            <div class="modal" id="changePasswordModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-key"></i> Alterar Minha Senha</h2>
                        <button class="close-modal" onclick="UserManagement.closeChangePasswordModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="changePasswordForm">
                            <div class="form-group">
                                <label for="currentPassword">Senha Atual *</label>
                                <input 
                                    type="password" 
                                    id="currentPassword" 
                                    placeholder="Digite sua senha atual"
                                    required
                                    autocomplete="current-password">
                            </div>
                            
                            <div class="form-group">
                                <label for="newPassword">Nova Senha *</label>
                                <input 
                                    type="password" 
                                    id="newPassword" 
                                    placeholder="Mínimo 6 caracteres"
                                    minlength="6"
                                    required
                                    autocomplete="new-password">
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmNewPassword">Confirmar Nova Senha *</label>
                                <input 
                                    type="password" 
                                    id="confirmNewPassword" 
                                    placeholder="Digite a nova senha novamente"
                                    minlength="6"
                                    required
                                    autocomplete="new-password">
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-check"></i> Alterar Senha
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('changePasswordModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('changePasswordModal');
        modal.classList.add('active');
        
        document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });
    },
    
    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        
        if (newPassword !== confirmPassword) {
            showToast('As senhas não coincidem', 'warning');
            return;
        }
        
        if (newPassword.length < 6) {
            showToast('A senha deve ter no mínimo 6 caracteres', 'warning');
            return;
        }
        
        const result = Auth.changePassword(currentPassword, newPassword);
        
        if (!result.success) {
            showToast(result.message, 'danger');
            return;
        }
        
        showToast('Senha alterada com sucesso!', 'success');
        this.closeChangePasswordModal();
    },
    
    // Redefinir senha de outro usuário
    showResetPasswordForm(userId) {
        const users = Auth.getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        let html = `
            <div class="modal" id="resetPasswordModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-key"></i> Redefinir Senha</h2>
                        <button class="close-modal" onclick="UserManagement.closeResetPasswordModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Redefinir senha do usuário: <strong>${user.name} (${user.username})</strong></p>
                        
                        <form id="resetPasswordForm">
                            <input type="hidden" id="resetUserId" value="${userId}">
                            
                            <div class="form-group">
                                <label for="resetNewPassword">Nova Senha *</label>
                                <input 
                                    type="password" 
                                    id="resetNewPassword" 
                                    placeholder="Mínimo 6 caracteres"
                                    minlength="6"
                                    required>
                            </div>
                            
                            <div class="form-group">
                                <label for="resetConfirmPassword">Confirmar Nova Senha *</label>
                                <input 
                                    type="password" 
                                    id="resetConfirmPassword" 
                                    placeholder="Digite a nova senha novamente"
                                    minlength="6"
                                    required>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-block">
                                <i class="fas fa-check"></i> Redefinir Senha
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('resetPasswordModal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', html);
        const modal = document.getElementById('resetPasswordModal');
        modal.classList.add('active');
        
        document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.resetPassword();
        });
    },
    
    resetPassword() {
        const userId = parseInt(document.getElementById('resetUserId').value);
        const newPassword = document.getElementById('resetNewPassword').value;
        const confirmPassword = document.getElementById('resetConfirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showToast('As senhas não coincidem', 'warning');
            return;
        }
        
        if (newPassword.length < 6) {
            showToast('A senha deve ter no mínimo 6 caracteres', 'warning');
            return;
        }
        
        const users = Auth.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            showToast('Usuário não encontrado', 'danger');
            return;
        }
        
        users[userIndex].password = Auth.hashPassword(newPassword);
        Auth.saveUsers(users);
        
        showToast('Senha redefinida com sucesso!', 'success');
        this.closeResetPasswordModal();
        this.showManagement();
    },
    
    // Excluir usuário
    deleteUser(userId) {
        const currentUser = Auth.getCurrentUser();
        if (currentUser.userId === userId) {
            showToast('Você não pode excluir seu próprio usuário', 'warning');
            return;
        }
        
        const users = Auth.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;
        
        const msg = `Tem certeza que deseja excluir o usuário "${user.name}"?\n\nEsta ação não pode ser desfeita.`;
        
        if (!confirm(msg)) return;
        
        const filtered = users.filter(u => u.id !== userId);
        Auth.saveUsers(filtered);
        
        showToast('Usuário excluído com sucesso!', 'success');
        this.showManagement();
    },
    
    // Fechar modais
    closeModal() {
        const modal = document.getElementById('userManagementModal');
        if (modal) modal.remove();
    },
    
    closeUserFormModal() {
        const modal = document.getElementById('userFormModal');
        if (modal) modal.remove();
    },
    
    closeChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) modal.remove();
    },
    
    closeResetPasswordModal() {
        const modal = document.getElementById('resetPasswordModal');
        if (modal) modal.remove();
    }
};
