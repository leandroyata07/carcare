// ============================================
// CARCARE - MÓDULO DE AUTENTICAÇÃO
// ============================================

const Auth = {
    // Chave para armazenamento
    STORAGE_KEY: 'carCareAuth',
    USERS_KEY: 'carCareUsers',
    
    // Inicializar usuário padrão
    init() {
        const users = this.getUsers();
        if (users.length === 0) {
            // Criar usuário padrão
            this.createUser('admin', 'admin123', 'Administrador');
        }
    },
    
    // Obter todos os usuários
    getUsers() {
        const usersData = localStorage.getItem(this.USERS_KEY);
        return usersData ? JSON.parse(usersData) : [];
    },
    
    // Salvar usuários
    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },
    
    // Criar novo usuário
    createUser(username, password, name) {
        const users = this.getUsers();
        
        // Verificar se usuário já existe
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'Usuário já existe' };
        }
        
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username: username,
            password: this.hashPassword(password),
            name: name,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        this.saveUsers(users);
        
        return { success: true, message: 'Usuário criado com sucesso' };
    },
    
    // Hash simples de senha (em produção, use bcrypt ou similar)
    hashPassword(password) {
        // Nota: Este é um hash muito simples apenas para demonstração
        // Em produção, use uma biblioteca adequada de criptografia
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },
    
    // Fazer login
    login(username, password) {
        const users = this.getUsers();
        const hashedPassword = this.hashPassword(password);
        
        const user = users.find(u => 
            u.username === username && u.password === hashedPassword
        );
        
        if (user) {
            const authData = {
                userId: user.id,
                username: user.username,
                name: user.name,
                loginAt: new Date().toISOString()
            };
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
            return { success: true, user: authData };
        }
        
        return { success: false, message: 'Usuário ou senha inválidos' };
    },
    
    // Fazer logout
    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.location.reload();
    },
    
    // Verificar se está logado
    isLoggedIn() {
        const authData = localStorage.getItem(this.STORAGE_KEY);
        return authData !== null;
    },
    
    // Obter usuário atual
    getCurrentUser() {
        const authData = localStorage.getItem(this.STORAGE_KEY);
        return authData ? JSON.parse(authData) : null;
    },
    
    // Alterar senha
    changePassword(oldPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Usuário não autenticado' };
        }
        
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.userId);
        
        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }
        
        const hashedOldPassword = this.hashPassword(oldPassword);
        if (users[userIndex].password !== hashedOldPassword) {
            return { success: false, message: 'Senha atual incorreta' };
        }
        
        users[userIndex].password = this.hashPassword(newPassword);
        this.saveUsers(users);
        
        return { success: true, message: 'Senha alterada com sucesso' };
    }
};

// Inicializar autenticação ao carregar
Auth.init();

// ============================================
// INTERFACE DE LOGIN
// ============================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = Auth.login(username, password);
            
            if (result.success) {
                // Redirecionar para a aplicação principal
                window.location.href = 'index.html';
            } else {
                showLoginError(result.message);
            }
        });
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

function handleLogout() {
    if (confirm('Deseja realmente sair?')) {
        Auth.logout();
    }
}

// Inicializar página de login se estiver na página de login
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        initLoginPage();
    }
});
