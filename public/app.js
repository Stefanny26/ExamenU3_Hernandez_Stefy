// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

// Estado global de la aplicación
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let tasks = [];
let currentFilter = 'all';
let socket = null;
let connectedUsers = [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando TodoApp OAuth Demo...');
    handleOAuthCallback();
    checkAuthStatus();
});

// ===== UTILIDADES =====
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i> ${message}`;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function showLoading(show = true) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

function makeAuthenticatedRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        }
    };
    
    return fetch(url, { ...defaultOptions, ...options });
}

// ===== GESTIÓN DE AUTENTICACIÓN =====
async function checkAuthStatus() {
    if (authToken) {
        try {
            const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/auth/profile`);
            if (response.ok) {
                const data = await response.json();
                console.log('📄 Datos del perfil recibidos:', data);
                currentUser = data.data.user; // Corregir la ruta de acceso
                showMainApp();
                loadTasks();
                return;
            } else {
                // Token inválido
                localStorage.removeItem('authToken');
                authToken = null;
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
            localStorage.removeItem('authToken');
            authToken = null;
        }
    }
    
    showOAuthLanding();
}

function showOAuthLanding() {
    console.log('📱 Mostrando página de OAuth...');
    document.getElementById('oauthLanding').style.display = 'flex';
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('mainHeader').style.display = 'none';
}

function showAuthSection() {
    document.getElementById('oauthLanding').style.display = 'none';
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('mainHeader').style.display = 'none';
}

function showMainApp() {
    console.log('✅ Mostrando aplicación principal...');
    document.getElementById('oauthLanding').style.display = 'none';
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('mainHeader').style.display = 'block';
    document.getElementById('userMenu').style.display = 'flex';
    
    // Inicializar Socket.IO cuando el usuario está autenticado
    initializeSocket();
    
    // Actualizar información del usuario
    updateUserWelcome();
}

function updateUserWelcome() {
    if (!currentUser) return;
    
    // Nombre del usuario
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('welcomeName').textContent = currentUser.name;
    
    // Email del usuario
    document.getElementById('userEmail').textContent = currentUser.email;
    
    // Proveedor de autenticación
    const providerElement = document.getElementById('userProvider');
    if (currentUser.provider === 'google') {
        providerElement.innerHTML = '<i class="fab fa-google"></i> Google OAuth';
        providerElement.style.background = '#4285f4';
    } else {
        providerElement.innerHTML = '<i class="fas fa-envelope"></i> Email/Password';
        providerElement.style.background = '#6366f1';
    }
    
    // Avatar del usuario
    const avatarImg = document.getElementById('userAvatar');
    const initialsDiv = document.getElementById('userInitials');
    
    if (currentUser.avatar) {
        avatarImg.src = currentUser.avatar;
        avatarImg.style.display = 'block';
        initialsDiv.style.display = 'none';
    } else {
        // Mostrar iniciales si no hay avatar
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        initialsDiv.textContent = initials;
        initialsDiv.style.display = 'flex';
        avatarImg.style.display = 'none';
    }
    
    // Subtitle personalizado
    const subtitleElement = document.getElementById('welcomeSubtitle');
    const hour = new Date().getHours();
    let greeting = 'Bienvenido';
    
    if (hour < 12) {
        greeting = 'Buenos días';
    } else if (hour < 18) {
        greeting = 'Buenas tardes';
    } else {
        greeting = 'Buenas noches';
    }
    
    subtitleElement.textContent = `${greeting}! Administra tus tareas de manera eficiente`;
}

function showTraditionalAuth() {
    console.log('📧 Mostrando autenticación tradicional...');
    showAuthSection();
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    
    // Actualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    
    // Actualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

// ===== AUTENTICACIÓN CON CREDENCIALES =====
async function login(event) {
    event.preventDefault();
    showLoading(true);
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('📄 Datos de login recibidos:', data);
            authToken = data.data.token; // Corregir la ruta de acceso
            localStorage.setItem('authToken', authToken);
            currentUser = data.data.user; // Corregir la ruta de acceso
            showAlert('¡Inicio de sesión exitoso!', 'success');
            showMainApp();
            loadTasks();
        } else {
            showAlert(data.message || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showAlert('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    } finally {
        showLoading(false);
    }
}

async function register(event) {
    event.preventDefault();
    showLoading(true);
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('📄 Datos de registro recibidos:', data);
            authToken = data.data.token; // Corregir la ruta de acceso
            localStorage.setItem('authToken', authToken);
            currentUser = data.data.user; // Corregir la ruta de acceso
            showAlert('¡Registro exitoso! Bienvenido!', 'success');
            showMainApp();
            loadTasks();
        } else {
            showAlert(data.message || 'Error al registrarse', 'error');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showAlert('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    } finally {
        showLoading(false);
    }
}

// ===== MANEJO DE CALLBACK OAUTH =====
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const oauthStatus = urlParams.get('oauth');

    if (token && (oauthStatus === 'success' || oauthStatus === 'demo')) {
        console.log('🔑 Procesando callback OAuth exitoso...');
        localStorage.setItem('authToken', token);
        authToken = token;
        const message = oauthStatus === 'demo' ? 
            '🧪 Demo OAuth exitoso! Usando datos simulados.' : 
            '✅ ¡Autenticación con Google exitosa!';
        showAlert(message, 'success');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (oauthStatus === 'error') {
        console.error('❌ Error en callback OAuth');
        const error = urlParams.get('message') || 'Error en autenticación OAuth';
        showAlert(`❌ ${decodeURIComponent(error)}`, 'error');
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// ===== AUTENTICACIÓN CON GOOGLE =====
function loginWithGoogle() {
    console.log('🔗 Iniciando autenticación con Google...');
    showAlert('🔗 Redirigiendo a Google...', 'warning');
    window.location.href = `${API_BASE_URL}/api/auth/google`;
}

async function demoOAuth() {
    console.log('🧪 Iniciando demo OAuth...');
    showAlert('🧪 Iniciando demo OAuth...', 'warning');
    // Redirigir directamente al endpoint demo (simula el flujo de Google)
    window.location.href = `${API_BASE_URL}/api/auth/google/demo`;
}

// ===== CERRAR SESIÓN =====
function logout() {
    // Desconectar Socket.IO antes de limpiar datos
    disconnectSocket();
    
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    tasks = [];
    connectedUsers = [];
    showAlert('Sesión cerrada correctamente', 'success');
    showAuthSection();
    
    // Limpiar formularios
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
}

// ===== GESTIÓN DE TAREAS =====
async function loadTasks() {
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/tasks`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('📄 Datos de tareas recibidos:', data);
            tasks = data.data || []; // Corregir la ruta de acceso
            renderTasks();
        } else {
            showAlert('Error al cargar las tareas', 'error');
        }
    } catch (error) {
        console.error('Error cargando tareas:', error);
        showAlert('Error de conexión al cargar tareas', 'error');
    }
}

async function addTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    
    if (!title) {
        showAlert('El título de la tarea es obligatorio', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/tasks`, {
            method: 'POST',
            body: JSON.stringify({ title, description })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('📄 Nueva tarea creada:', data);
            tasks.unshift(data.data); // Corregir la ruta de acceso
            renderTasks();
            showAlert('Tarea agregada correctamente', 'success');
            
            // Limpiar formulario
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
        } else {
            showAlert(data.message || 'Error al agregar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error agregando tarea:', error);
        showAlert('Error de conexión al agregar tarea', 'error');
    } finally {
        showLoading(false);
    }
}

async function toggleTask(taskId) {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify({ 
                title: task.title,
                description: task.description,
                completed: !task.completed 
            })
        });
        
        if (response.ok) {
            task.completed = !task.completed;
            renderTasks();
            showAlert(task.completed ? 'Tarea completada' : 'Tarea marcada como pendiente', 'success');
        } else {
            showAlert('Error al actualizar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error actualizando tarea:', error);
        showAlert('Error de conexión al actualizar tarea', 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            tasks = tasks.filter(t => t._id !== taskId);
            renderTasks();
            showAlert('Tarea eliminada correctamente', 'success');
        } else {
            showAlert('Error al eliminar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error eliminando tarea:', error);
        showAlert('Error de conexión al eliminar tarea', 'error');
    }
}

// ===== FILTROS DE TAREAS =====
function filterTasks(filter) {
    currentFilter = filter;
    
    // Actualizar botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// ===== RENDERIZADO =====
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const emptyState = document.getElementById('emptyState');
    const tasksCount = document.getElementById('tasksCount');
    const completedCount = document.getElementById('completedCount');
    
    const filteredTasks = getFilteredTasks();
    
    // Actualizar contadores
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    tasksCount.textContent = `${total} tarea${total !== 1 ? 's' : ''}`;
    completedCount.textContent = `${completed} completada${completed !== 1 ? 's' : ''}`;
    
    if (filteredTasks.length === 0) {
        tasksList.style.display = 'none';
        emptyState.style.display = 'block';
        
        // Personalizar mensaje según el filtro
        const emptyMessage = emptyState.querySelector('h3');
        const emptySubtext = emptyState.querySelector('p');
        
        switch (currentFilter) {
            case 'pending':
                emptyMessage.textContent = '¡Excelente! No tienes tareas pendientes';
                emptySubtext.textContent = 'Has completado todas tus tareas. ¡Buen trabajo!';
                break;
            case 'completed':
                emptyMessage.textContent = 'No tienes tareas completadas aún';
                emptySubtext.textContent = '¡Completa algunas tareas para verlas aquí!';
                break;
            default:
                emptyMessage.textContent = 'No tienes tareas aún';
                emptySubtext.textContent = '¡Agrega tu primera tarea para comenzar a organizarte!';
        }
    } else {
        tasksList.style.display = 'block';
        emptyState.style.display = 'none';
        
        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task._id}">
                <div class="task-checkbox ${task.completed ? 'completed' : ''}" 
                     onclick="toggleTask('${task._id}')"></div>
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                    <div class="task-meta">
                        <small style="color: var(--text-secondary);">
                            <i class="fas fa-calendar"></i>
                            ${new Date(task.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </small>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit" onclick="editTask('${task._id}')" title="Editar tarea">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete" onclick="deleteTask('${task._id}')" title="Eliminar tarea">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Función para editar tareas (nueva funcionalidad)
async function editTask(taskId) {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    
    const newTitle = prompt('Nuevo título de la tarea:', task.title);
    if (newTitle === null) return; // Usuario canceló
    
    if (!newTitle.trim()) {
        showAlert('El título de la tarea no puede estar vacío', 'warning');
        return;
    }
    
    const newDescription = prompt('Nueva descripción (opcional):', task.description || '');
    if (newDescription === null) return; // Usuario canceló
    
    try {
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify({ 
                title: newTitle.trim(),
                description: newDescription.trim(),
                completed: task.completed
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const taskIndex = tasks.findIndex(t => t._id === taskId);
            tasks[taskIndex] = data.data;
            renderTasks();
            showAlert('Tarea actualizada correctamente', 'success');
        } else {
            showAlert(data.message || 'Error al actualizar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error actualizando tarea:', error);
        showAlert('Error de conexión al actualizar tarea', 'error');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== SOCKET.IO CLIENT =====
function initializeSocket() {
    if (!authToken) {
        console.log('❌ No hay token de autenticación para Socket.IO');
        return;
    }

    console.log('🔌 Inicializando conexión Socket.IO...');
    
    socket = io(API_BASE_URL, {
        auth: {
            token: authToken
        },
        transports: ['websocket', 'polling']
    });

    // Eventos de conexión
    socket.on('connect', () => {
        console.log('✅ Conectado a Socket.IO server');
        updateConnectionStatus(true);
        showAlert('Conectado en tiempo real', 'success');
    });

    socket.on('disconnect', () => {
        console.log('❌ Desconectado de Socket.IO server');
        updateConnectionStatus(false);
        showAlert('Desconectado del servidor', 'warning');
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión Socket.IO:', error);
        updateConnectionStatus(false);
        showAlert('Error de conexión en tiempo real', 'error');
    });

    // Eventos de usuarios
    socket.on('user_connected', (data) => {
        console.log('👋 Usuario conectado:', data);
        showRealtimeNotification(data);
    });

    socket.on('user_disconnected', (data) => {
        console.log('🚪 Usuario desconectado:', data);
        showRealtimeNotification(data);
    });

    socket.on('connected_users', (data) => {
        console.log('👥 Usuarios conectados:', data);
        connectedUsers = data.users;
        updateConnectedUsersDisplay();
    });

    // Eventos de tareas
    socket.on('task_created', (data) => {
        console.log('📝 Nueva tarea creada:', data);
        showRealtimeNotification(data);
        // Recargar tareas para mostrar la nueva
        loadTasks();
    });

    socket.on('task_updated', (data) => {
        console.log('✏️ Tarea actualizada:', data);
        showRealtimeNotification(data);
        // Recargar tareas para mostrar los cambios
        loadTasks();
    });

    socket.on('task_deleted', (data) => {
        console.log('🗑️ Tarea eliminada:', data);
        showRealtimeNotification(data);
        // Recargar tareas para reflejar la eliminación
        loadTasks();
    });

    // Eventos de ping/pong para mantener conexión
    socket.on('pong', (data) => {
        console.log('🏓 Pong recibido:', data);
    });
}

function disconnectSocket() {
    if (socket) {
        console.log('🔌 Desconectando Socket.IO...');
        socket.disconnect();
        socket = null;
        updateConnectionStatus(false);
    }
}

function updateConnectionStatus(connected) {
    const statusIcon = document.getElementById('connectionStatus');
    const statusText = document.getElementById('connectionStatusText');
    
    if (connected) {
        statusIcon.className = 'fas fa-wifi connected';
        statusText.textContent = 'Conectado';
        statusText.style.color = 'var(--success-color)';
    } else {
        statusIcon.className = 'fas fa-wifi disconnected';
        statusText.textContent = 'Desconectado';
        statusText.style.color = 'var(--error-color)';
    }
}

function updateConnectedUsersDisplay() {
    const countElement = document.getElementById('connectedUsersCount');
    const listElement = document.getElementById('connectedUsersList');
    
    countElement.textContent = connectedUsers.length;
    
    if (connectedUsers.length === 0) {
        listElement.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">No hay otros usuarios conectados</p>';
        return;
    }
    
    const usersHTML = `
        <h4><i class="fas fa-users"></i> Usuarios Conectados</h4>
        <div class="connected-users-grid">
            ${connectedUsers.map(user => `
                <div class="connected-user">
                    <div class="user-avatar-small">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="connected-user-info">
                        <div class="connected-user-name">${escapeHtml(user.name)}</div>
                        <div class="connected-user-status">
                            <div class="status-dot"></div>
                            En línea
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    listElement.innerHTML = usersHTML;
}

function showRealtimeNotification(data) {
    // Crear notificación toast especializada para eventos en tiempo real
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert realtime-notification ${getNotificationClass(data.type)}`;
    
    const icon = getNotificationIcon(data.type);
    alert.innerHTML = `
        <div class="notification-header">
            <i class="${icon}"></i>
            <span class="notification-type">${getNotificationTitle(data.type)}</span>
            <span class="notification-time">${new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>
        <div class="notification-message">${escapeHtml(data.message)}</div>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function getNotificationClass(type) {
    switch(type) {
        case 'task_created':
        case 'user_connected':
            return 'success';
        case 'task_updated':
            return 'warning';
        case 'task_deleted':
        case 'user_disconnected':
            return 'error';
        default:
            return 'success';
    }
}

function getNotificationIcon(type) {
    switch(type) {
        case 'task_created': return 'fas fa-plus-circle';
        case 'task_updated': return 'fas fa-edit';
        case 'task_deleted': return 'fas fa-trash';
        case 'user_connected': return 'fas fa-user-plus';
        case 'user_disconnected': return 'fas fa-user-minus';
        default: return 'fas fa-bell';
    }
}

function getNotificationTitle(type) {
    switch(type) {
        case 'task_created': return 'Nueva Tarea';
        case 'task_updated': return 'Tarea Actualizada';
        case 'task_deleted': return 'Tarea Eliminada';
        case 'user_connected': return 'Usuario Conectado';
        case 'user_disconnected': return 'Usuario Desconectado';
        default: return 'Notificación';
    }
}
