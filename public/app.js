// Estado global de la aplicación
let currentUser = null;
let socket = null;
let questions = [];
let typingTimeout = null;

// Elementos del DOM
const elements = {
    oauthSection: document.getElementById('oauth-section'),
    appContainer: document.getElementById('app-container'),
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    logoutBtn: document.getElementById('logout-btn'),
    questionInput: document.getElementById('question-input'),
    charCount: document.getElementById('char-count'),
    submitBtn: document.getElementById('submit-question'),
    questionsContainer: document.getElementById('questions-container'),
    questionsCount: document.getElementById('questions-count'),
    typingIndicator: document.getElementById('typing-indicator'),
    statTotal: document.getElementById('stat-total'),
    statPending: document.getElementById('stat-pending'),
    statAnswered: document.getElementById('stat-answered'),
    activityFeed: document.getElementById('activity-feed'),
    notification: document.getElementById('notification')
};

// Configuración de la API
const API_BASE = '/api';

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Aplicación inicializada');
    
    // Verificar si hay token en la URL (OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const oauthStatus = urlParams.get('oauth');
    
    if (token) {
        console.log('✅ Token OAuth recibido');
        localStorage.setItem('authToken', token);
        
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Inicializar aplicación
        initializeApp();
    } else if (oauthStatus === 'error') {
        const errorMessage = urlParams.get('message') || 'Error en autenticación OAuth';
        showNotification(`Error: ${decodeURIComponent(errorMessage)}`, 'error');
    } else {
        // Verificar si hay token guardado
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            initializeApp();
        }
    }
    
    setupEventListeners();
});

// ===== CONFIGURACIÓN DE EVENTOS =====
function setupEventListeners() {
    // Contador de caracteres
    if (elements.questionInput) {
        elements.questionInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            elements.charCount.textContent = length;
            
            // Cambiar color según proximidad al límite
            if (length > 450) {
                elements.charCount.style.color = '#ef4444';
            } else if (length > 350) {
                elements.charCount.style.color = '#f59e0b';
            } else {
                elements.charCount.style.color = '#64748b';
            }
            
            // Habilitar/deshabilitar botón
            elements.submitBtn.disabled = length < 5 || length > 500;
            
            // Indicador de escritura para otros usuarios
            handleTypingIndicator();
        });
        
        // Enter para enviar (Ctrl+Enter)
        elements.questionInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                submitQuestion();
            }
        });
    }
    
    // Enviar pregunta
    if (elements.submitBtn) {
        elements.submitBtn.addEventListener('click', submitQuestion);
    }
    
    // Logout
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', logout);
    }
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
async function initializeApp() {
    try {
        console.log('🔄 Inicializando aplicación...');
        
        // Obtener perfil del usuario
        const response = await fetchWithAuth('/api/auth/profile');
        
        if (!response.ok) {
            throw new Error('Token inválido');
        }
        
        const data = await response.json();
        currentUser = data.user;
        
        console.log('👤 Usuario autenticado:', currentUser.name);
        
        // Mostrar aplicación
        showApp();
        
        // Configurar Socket.IO
        initializeSocket();
        
        // Cargar preguntas iniciales
        await loadQuestions();
        
        showNotification(`¡Bienvenido ${currentUser.name}!`, 'success');
        
    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        logout();
        showNotification('Error de autenticación. Por favor, inicia sesión nuevamente.', 'error');
    }
}

// ===== INTERFAZ DE USUARIO =====
function showApp() {
    if (elements.oauthSection) elements.oauthSection.style.display = 'none';
    if (elements.appContainer) elements.appContainer.style.display = 'block';
    
    // Configurar información del usuario
    if (elements.userName) elements.userName.textContent = currentUser.name;
    if (elements.userAvatar) {
        elements.userAvatar.src = currentUser.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name);
        elements.userAvatar.alt = currentUser.name;
    }
}

function showLogin() {
    if (elements.oauthSection) elements.oauthSection.style.display = 'flex';
    if (elements.appContainer) elements.appContainer.style.display = 'none';
}

// ===== SOCKET.IO =====
function initializeSocket() {
    const token = localStorage.getItem('authToken');
    
    socket = io({
        auth: {
            token: token
        }
    });
    
    socket.on('connect', () => {
        console.log('🔌 Conectado a Socket.IO');
        showNotification('Conectado al sistema en tiempo real', 'info');
    });
    
    socket.on('disconnect', () => {
        console.log('🔌 Desconectado de Socket.IO');
        showNotification('Conexión perdida. Reintentando...', 'error');
    });
    
    socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión Socket.IO:', error);
        showNotification('Error de conexión en tiempo real', 'error');
    });
    
    // Eventos de preguntas
    socket.on('question_created', handleQuestionCreated);
    socket.on('question_updated', handleQuestionUpdated);
    socket.on('question_answered', handleQuestionAnswered);
    socket.on('question_voted', handleQuestionVoted);
    socket.on('question_deleted', handleQuestionDeleted);
    
    // Eventos de usuarios
    socket.on('user_connected', (data) => {
        addActivity(`${data.user} se conectó`, 'info');
    });
    
    socket.on('user_disconnected', (data) => {
        addActivity(`${data.user} se desconectó`, 'info');
    });
    
    // Indicador de escritura
    socket.on('question:typing', handleUserTyping);
}

// ===== EVENTOS DE SOCKET.IO =====
function handleQuestionCreated(data) {
    console.log('📝 Nueva pregunta recibida:', data);
    addActivity(data.message, 'success');
    loadQuestions(); // Recargar lista
}

function handleQuestionUpdated(data) {
    console.log('✏️ Pregunta actualizada:', data);
    addActivity(data.message, 'info');
    loadQuestions();
}

function handleQuestionAnswered(data) {
    console.log('✅ Pregunta respondida:', data);
    addActivity(data.message, 'success');
    loadQuestions();
}

function handleQuestionVoted(data) {
    console.log('👍 Voto en pregunta:', data);
    addActivity(data.message, 'info');
    loadQuestions();
}

function handleQuestionDeleted(data) {
    console.log('🗑️ Pregunta eliminada:', data);
    addActivity(data.message, 'error');
    loadQuestions();
}

function handleUserTyping(data) {
    if (currentUser && data.userId !== currentUser.id && elements.typingIndicator) {
        if (data.isTyping) {
            elements.typingIndicator.textContent = `${data.user} está escribiendo una pregunta...`;
        } else {
            elements.typingIndicator.textContent = '';
        }
    }
}

// ===== MANEJO DE PREGUNTAS =====
async function loadQuestions() {
    try {
        const response = await fetchWithAuth('/api/questions');
        const data = await response.json();
        
        if (data.success) {
            questions = data.questions;
            renderQuestions();
            updateStats(data.stats);
        }
    } catch (error) {
        console.error('❌ Error cargando preguntas:', error);
        showNotification('Error cargando preguntas', 'error');
    }
}

function renderQuestions() {
    if (!elements.questionsContainer) return;
    
    if (questions.length === 0) {
        elements.questionsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-question-circle"></i>
                <p>No hay preguntas aún. ¡Sé el primero en preguntar!</p>
            </div>
        `;
        if (elements.questionsCount) elements.questionsCount.textContent = '(0)';
        return;
    }
    
    if (elements.questionsCount) elements.questionsCount.textContent = `(${questions.length})`;
    
    elements.questionsContainer.innerHTML = questions.map(question => `
        <div class="question-item ${question.answered ? 'answered' : ''}" data-id="${question._id}">
            <div class="question-meta">
                <span class="question-author">
                    <i class="fas fa-user"></i>
                    ${question.authorName}
                </span>
                <span>
                    ${formatTimeAgo(question.createdAt)}
                    ${question.answered ? '<i class="fas fa-check-circle" style="color: #10b981; margin-left: 8px;"></i>' : ''}
                </span>
            </div>
            <div class="question-content">${question.content}</div>
            <div class="question-actions">
                <button class="vote-btn ${question.voters && question.voters.includes(currentUser.id) ? 'voted' : ''}" onclick="voteQuestion('${question._id}')">
                    <i class="fas fa-thumbs-up"></i>
                    ${question.votes || 0}
                </button>
                
                ${!question.answered ? `
                    <button class="answer-btn" onclick="markAsAnswered('${question._id}')">
                        <i class="fas fa-check"></i>
                        Marcar como respondida
                    </button>
                ` : ''}
                
                ${question.author === currentUser.id ? `
                    <button class="delete-btn" onclick="deleteQuestion('${question._id}')">
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function submitQuestion() {
    if (!elements.questionInput || !elements.submitBtn) return;
    
    const content = elements.questionInput.value.trim();
    
    if (content.length < 5 || content.length > 500) {
        showNotification('La pregunta debe tener entre 5 y 500 caracteres', 'error');
        return;
    }
    
    try {
        elements.submitBtn.disabled = true;
        elements.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        const response = await fetchWithAuth('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        
        const data = await response.json();
        
        if (data.success) {
            elements.questionInput.value = '';
            if (elements.charCount) elements.charCount.textContent = '0';
            showNotification('Pregunta enviada exitosamente', 'success');
            
            // No necesitamos recargar manualmente, Socket.IO lo hará
        } else {
            throw new Error(data.message);
        }
        
    } catch (error) {
        console.error('❌ Error enviando pregunta:', error);
        showNotification('Error enviando pregunta: ' + error.message, 'error');
    } finally {
        elements.submitBtn.disabled = false;
        elements.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Pregunta';
    }
}

// ===== ACCIONES DE PREGUNTAS =====
async function voteQuestion(questionId) {
    try {
        const response = await fetchWithAuth(`/api/questions/${questionId}/vote`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            // Socket.IO actualizará automáticamente
        } else {
            throw new Error(data.message);
        }
        
    } catch (error) {
        console.error('❌ Error votando pregunta:', error);
        showNotification('Error al votar: ' + error.message, 'error');
    }
}

async function markAsAnswered(questionId) {
    try {
        const response = await fetchWithAuth(`/api/questions/${questionId}/answered`, {
            method: 'PATCH'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Pregunta marcada como respondida', 'success');
            // Socket.IO actualizará automáticamente
        } else {
            throw new Error(data.message);
        }
        
    } catch (error) {
        console.error('❌ Error marcando pregunta:', error);
        showNotification('Error al marcar como respondida: ' + error.message, 'error');
    }
}

async function deleteQuestion(questionId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`/api/questions/${questionId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Pregunta eliminada', 'success');
            // Socket.IO actualizará automáticamente
        } else {
            throw new Error(data.message);
        }
        
    } catch (error) {
        console.error('❌ Error eliminando pregunta:', error);
        showNotification('Error al eliminar: ' + error.message, 'error');
    }
}

// ===== UTILIDADES =====
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    return fetch(url, { ...options, headers: defaultOptions.headers });
}

function logout() {
    localStorage.removeItem('authToken');
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    currentUser = null;
    questions = [];
    showLogin();
    showNotification('Sesión cerrada', 'info');
}

function showNotification(message, type = 'info') {
    if (!elements.notification) return;
    
    elements.notification.textContent = message;
    elements.notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 4000);
}

function addActivity(message, type = 'info') {
    if (!elements.activityFeed) return;
    
    // Remover empty state si existe
    const emptyState = elements.activityFeed.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div>${message}</div>
        <div class="activity-time">${formatTimeAgo(new Date().toISOString())}</div>
    `;
    
    elements.activityFeed.insertBefore(activityItem, elements.activityFeed.firstChild);
    
    // Limitar a 10 elementos
    const items = elements.activityFeed.querySelectorAll('.activity-item');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
}

function updateStats(stats) {
    if (stats) {
        if (elements.statTotal) elements.statTotal.textContent = stats.total || 0;
        if (elements.statPending) elements.statPending.textContent = stats.pending || 0;
        if (elements.statAnswered) elements.statAnswered.textContent = stats.answered || 0;
    }
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
}

function handleTypingIndicator() {
    if (socket && currentUser) {
        // Emitir que el usuario está escribiendo
        socket.emit('question:typing', { isTyping: true });
        
        // Limpiar timeout anterior
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        // Configurar timeout para dejar de escribir
        typingTimeout = setTimeout(() => {
            socket.emit('question:typing', { isTyping: false });
        }, 1000);
    }
}

// ===== FUNCIONES GLOBALES PARA EVENTOS DE BOTONES =====
window.voteQuestion = voteQuestion;
window.markAsAnswered = markAsAnswered;
window.deleteQuestion = deleteQuestion;
