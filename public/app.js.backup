// ===== GESTIÓN DE ESTADO DE LA APLICACIÓN =====
class QuestionApp {
    constructor() {
        this.user = null;
        this.token = null;
        this.socket = null;
        this.questions = [];
        this.stats = { total: 0, pending: 0, answered: 0 };
        this.activityFeed = [];
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando aplicación Cola de Preguntas...');
        
        // Verificar si hay token en URL (OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const oauthStatus = urlParams.get('oauth');
        
        if (token) {
            console.log('✅ Token OAuth recibido');
            this.token = token;
            localStorage.setItem('auth_token', token);
            
            // Limpiar URL
            window.history.replaceState({}, document.title, '/');
            
            await this.loadUserProfile();
            this.showApp();
            this.showNotification(`Bienvenido! Sesión iniciada correctamente`, 'success');
        } else {
            // Verificar token en localStorage
            const storedToken = localStorage.getItem('auth_token');
            if (storedToken) {
                this.token = storedToken;
                try {
                    await this.loadUserProfile();
                    this.showApp();
                } catch (error) {
                    console.error('Token inválido:', error);
                    localStorage.removeItem('auth_token');
                    this.showLogin();
                }
            } else {
                this.showLogin();
            }
        }

        // Mostrar mensajes de OAuth si existen
        if (oauthStatus === 'error') {
            const message = urlParams.get('message') || 'Error en autenticación OAuth';
            this.showNotification(decodeURIComponent(message), 'error');
        } else if (oauthStatus === 'demo') {
            this.showNotification('Modo demo activado - OAuth simulado', 'info');
        }

        this.setupEventListeners();
    }

    async loadUserProfile() {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error cargando perfil');
            }

            const data = await response.json();
            this.user = data.user;
            console.log('👤 Usuario cargado:', this.user.name);
            
            this.updateUserDisplay();
            this.connectSocket();
            await this.loadQuestions();
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            throw error;
        }
    }

    showLogin() {
        document.getElementById('oauth-section').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
    }

    showApp() {
        document.getElementById('oauth-section').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
    }

    updateUserDisplay() {
        if (this.user) {
            document.getElementById('user-name').textContent = this.user.name;
            document.getElementById('user-avatar').src = this.user.avatar || '/default-avatar.png';
        }
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.logout();
        });

        // Envio de preguntas
        document.getElementById('submit-question')?.addEventListener('click', () => {
            this.submitQuestion();
        });

        // Enter para enviar (Ctrl+Enter)
        document.getElementById('question-input')?.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.submitQuestion();
            }
        });

        // Contador de caracteres
        document.getElementById('question-input')?.addEventListener('input', (e) => {
            this.updateCharCounter();
            this.handleTyping();
        });

        // Prevenir envío vacío
        document.getElementById('question-input')?.addEventListener('blur', () => {
            this.stopTyping();
        });
    }

    connectSocket() {
        if (!this.token) return;

        console.log('🔌 Conectando Socket.IO...');
        
        this.socket = io({
            auth: {
                token: this.token
            }
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket conectado');
            this.showNotification('Conectado en tiempo real', 'success');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket desconectado');
            this.showNotification('Conexión perdida - Reintentando...', 'error');
        });

        // Eventos de preguntas
        this.socket.on('question_created', (data) => {
            console.log('📩 Nueva pregunta recibida:', data);
            this.handleQuestionCreated(data);
        });

        this.socket.on('question_updated', (data) => {
            console.log('📝 Pregunta actualizada:', data);
            this.handleQuestionUpdated(data);
        });

        this.socket.on('question_answered', (data) => {
            console.log('✅ Pregunta respondida:', data);
            this.handleQuestionAnswered(data);
        });

        this.socket.on('question_voted', (data) => {
            console.log('👍 Pregunta votada:', data);
            this.handleQuestionVoted(data);
        });

        this.socket.on('question_deleted', (data) => {
            console.log('🗑️ Pregunta eliminada:', data);
            this.handleQuestionDeleted(data);
        });

        // Eventos de usuarios
        this.socket.on('user_connected', (data) => {
            this.addActivity(data.message, 'connect');
        });

        this.socket.on('user_disconnected', (data) => {
            this.addActivity(data.message, 'disconnect');
        });

        // Typing indicators
        this.socket.on('question:typing', (data) => {
            this.showTypingIndicator(data);
        });
    }

    async loadQuestions() {
        try {
            const response = await fetch('/api/questions', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error cargando preguntas');
            }

            const data = await response.json();
            this.questions = data.questions || [];
            this.stats = data.stats || { total: 0, pending: 0, answered: 0 };
            
            this.renderQuestions();
            this.updateStats();
            
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showNotification('Error cargando preguntas', 'error');
        }
    }

    async submitQuestion() {
        const input = document.getElementById('question-input');
        const content = input.value.trim();

        if (!content) {
            this.showNotification('Escribe una pregunta', 'error');
            return;
        }

        if (content.length > 500) {
            this.showNotification('La pregunta es muy larga', 'error');
            return;
        }

        try {
            const submitBtn = document.getElementById('submit-question');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            const response = await fetch('/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error enviando pregunta');
            }

            // Limpiar formulario
            input.value = '';
            this.updateCharCounter();
            this.showNotification('Pregunta enviada exitosamente', 'success');

        } catch (error) {
            console.error('Error submitting question:', error);
            this.showNotification(error.message, 'error');
        } finally {
            const submitBtn = document.getElementById('submit-question');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pregunta';
        }
    }

    async voteQuestion(questionId) {
        try {
            const response = await fetch(`/api/questions/${questionId}/vote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error votando pregunta');
            }

        } catch (error) {
            console.error('Error voting question:', error);
            this.showNotification(error.message, 'error');
        }
    }

    async markAsAnswered(questionId) {
        try {
            const response = await fetch(`/api/questions/${questionId}/answered`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error marcando como respondida');
            }

        } catch (error) {
            console.error('Error marking as answered:', error);
            this.showNotification(error.message, 'error');
        }
    }

    async deleteQuestion(questionId) {
        if (!confirm('¿Estás seguro de eliminar esta pregunta?')) {
            return;
        }

        try {
            const response = await fetch(`/api/questions/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error eliminando pregunta');
            }

        } catch (error) {
            console.error('Error deleting question:', error);
            this.showNotification(error.message, 'error');
        }
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');
        
        if (this.questions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-question-circle"></i>
                    <p>No hay preguntas aún. ¡Sé el primero en preguntar!</p>
                </div>
            `;
            return;
        }

        // Ordenar: pendientes primero, luego por votos y fecha
        const sortedQuestions = [...this.questions].sort((a, b) => {
            if (a.answered !== b.answered) return a.answered ? 1 : -1;
            if (a.votes !== b.votes) return b.votes - a.votes;
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        container.innerHTML = sortedQuestions.map(question => this.renderQuestion(question)).join('');
        
        // Update counter
        document.getElementById('questions-count').textContent = `(${this.questions.length})`;
    }

    renderQuestion(question) {
        const isAuthor = this.user && question.author && question.author._id === this.user._id;
        const hasVoted = question.voters && question.voters.includes(this.user._id);
        const createdDate = new Date(question.createdAt).toLocaleString();

        return `
            <div class="question-item ${question.answered ? 'answered' : ''}" data-id="${question._id}">
                <div class="question-meta">
                    <span class="question-author">
                        <i class="fas fa-user-circle"></i>
                        ${question.authorName || 'Anónimo'}
                    </span>
                    <span>${createdDate}</span>
                </div>
                
                <div class="question-content">
                    ${this.escapeHtml(question.content)}
                </div>
                
                <div class="question-actions">
                    <button class="vote-btn ${hasVoted ? 'voted' : ''}" onclick="app.voteQuestion('${question._id}')">
                        <i class="fas fa-thumbs-up"></i>
                        ${question.votes || 0}
                    </button>
                    
                    ${!question.answered ? `
                        <button class="answer-btn" onclick="app.markAsAnswered('${question._id}')">
                            <i class="fas fa-check"></i>
                            Marcar Respondida
                        </button>
                    ` : `
                        <span style="color: #10b981; font-weight: 600;">
                            <i class="fas fa-check-circle"></i>
                            Respondida
                        </span>
                    `}
                    
                    ${isAuthor ? `
                        <button class="delete-btn" onclick="app.deleteQuestion('${question._id}')">
                            <i class="fas fa-trash"></i>
                            Eliminar
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    updateStats() {
        document.getElementById('stat-total').textContent = this.stats.total || 0;
        document.getElementById('stat-pending').textContent = this.stats.pending || 0;
        document.getElementById('stat-answered').textContent = this.stats.answered || 0;
    }

    updateCharCounter() {
        const input = document.getElementById('question-input');
        const counter = document.getElementById('char-count');
        const submitBtn = document.getElementById('submit-question');
        
        if (input && counter) {
            const length = input.value.length;
            counter.textContent = length;
            
            if (submitBtn) {
                submitBtn.disabled = length === 0 || length > 500;
            }
        }
    }

    handleTyping() {
        if (!this.socket) return;

        if (!this.isTyping) {
            this.isTyping = true;
            this.socket.emit('question:typing', { isTyping: true });
        }

        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.stopTyping();
        }, 3000);
    }

    stopTyping() {
        if (this.isTyping && this.socket) {
            this.isTyping = false;
            this.socket.emit('question:typing', { isTyping: false });
        }
        clearTimeout(this.typingTimeout);
    }

    showTypingIndicator(data) {
        const indicator = document.getElementById('typing-indicator');
        if (!indicator) return;

        if (data.isTyping && data.user !== this.user.name) {
            indicator.textContent = `${data.user} está escribiendo una pregunta...`;
            indicator.style.display = 'block';
        } else {
            indicator.style.display = 'none';
        }
    }

    // Event handlers para Socket.IO
    handleQuestionCreated(data) {
        // Actualizar lista local
        if (data.question) {
            this.questions.unshift(data.question);
            this.stats.total++;
            this.stats.pending++;
        }
        
        this.renderQuestions();
        this.updateStats();
        this.addActivity(data.message, 'question');
        
        if (data.user !== this.user.name) {
            this.showNotification(`Nueva pregunta de ${data.user}`, 'info');
        }
    }

    handleQuestionUpdated(data) {
        this.updateQuestionInList(data.question);
        this.addActivity(data.message, 'update');
    }

    handleQuestionAnswered(data) {
        if (data.question) {
            this.updateQuestionInList(data.question);
            this.stats.pending--;
            this.stats.answered++;
        }
        
        this.renderQuestions();
        this.updateStats();
        this.addActivity(data.message, 'answer');
        this.showNotification(data.message, 'success');
    }

    handleQuestionVoted(data) {
        this.updateQuestionInList(data.question);
        this.addActivity(data.message, 'vote');
    }

    handleQuestionDeleted(data) {
        // Remover de lista local
        this.questions = this.questions.filter(q => q._id !== data.questionId);
        this.stats.total--;
        
        this.renderQuestions();
        this.updateStats();
        this.addActivity(data.message, 'delete');
        
        if (data.user !== this.user.name) {
            this.showNotification(`${data.user} eliminó una pregunta`, 'info');
        }
    }

    updateQuestionInList(updatedQuestion) {
        const index = this.questions.findIndex(q => q._id === updatedQuestion._id);
        if (index !== -1) {
            this.questions[index] = updatedQuestion;
            this.renderQuestions();
        }
    }

    addActivity(message, type = 'info') {
        const activity = {
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.activityFeed.unshift(activity);
        
        // Mantener solo las últimas 10 actividades
        if (this.activityFeed.length > 10) {
            this.activityFeed = this.activityFeed.slice(0, 10);
        }
        
        this.renderActivityFeed();
    }

    renderActivityFeed() {
        const container = document.getElementById('activity-feed');
        
        if (this.activityFeed.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <p>No hay actividad reciente</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.activityFeed.map(activity => `
            <div class="activity-item">
                <div>${this.escapeHtml(activity.message)}</div>
                <div class="activity-time">${activity.timestamp}</div>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    logout() {
        if (this.socket) {
            this.socket.disconnect();
        }
        
        localStorage.removeItem('auth_token');
        this.token = null;
        this.user = null;
        this.questions = [];
        this.stats = { total: 0, pending: 0, answered: 0 };
        this.activityFeed = [];
        
        this.showLogin();
        this.showNotification('Sesión cerrada exitosamente', 'success');
        
        // Recargar la página después de un momento
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Inicializar aplicación cuando el DOM esté listo
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new QuestionApp();
});

// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
    if (app) {
        app.showNotification('Error inesperado en la aplicación', 'error');
    }
});

// Manejar errores de promesas no capturadas
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection no manejada:', event.reason);
    if (app) {
        app.showNotification('Error de conexión', 'error');
    }
});

console.log('📱 Cliente de Cola de Preguntas cargado');
