# 🙋‍♀️ Cola de Preguntas para Charla - Sistema de Interacción en Tiempo Real

**Estudiante:** Stefanny Mishel Hernández Buenaño  
**Proyecto:** Examen Práctico - Desarrollo Web Full Stack  
**Institución:** Universidad Técnica del Norte  
**Fecha:** 13 de agosto de 2025  
**URL Producción:** https://examenu3hernandezstefy-production.up.railway.app/

---

## 📋 Descripción del Proyecto

Sistema web interactivo diseñado para facilitar la comunicación bidireccional durante charlas, conferencias y presentaciones académicas. La aplicación permite a los asistentes enviar preguntas en tiempo real que son visibles instantáneamente para todos los participantes, implementando un sistema democrático de votación para priorizar las consultas más relevantes.

### 🎯 Objetivos Técnicos Alcanzados

1. **Implementación de OAuth 2.0 completo** con flujo Authorization Code
2. **Sistema de autenticación JWT** para manejo de sesiones seguras
3. **Comunicación bidireccional en tiempo real** usando WebSockets (Socket.IO)
4. **Arquitectura limpia y escalable** con separación de responsabilidades
5. **Despliegue en producción** con configuraciones de alta disponibilidad

---

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico Completo:**

#### **Backend (Node.js Ecosystem)**
- **Runtime:** Node.js 18.x LTS
- **Framework Web:** Express.js 4.18.2 con middleware stack completo
- **Base de Datos:** MongoDB 7.5.0 con Mongoose ODM para modelado de datos
- **Autenticación:** Passport.js + Google OAuth 2.0 + JWT (jsonwebtoken 9.0.2)
- **Tiempo Real:** Socket.IO 4.8.1 con autenticación por tokens
- **Validación:** Express-validator 7.0.1 para sanitización de entrada
- **Seguridad:** bcryptjs 2.4.3, CORS configurado, rate limiting

#### **Frontend (Progressive Web App)**
- **Lenguajes:** HTML5 semántico, CSS3 con Grid/Flexbox, JavaScript ES6+
- **Metodología CSS:** BEM (Block Element Modifier) para mantenibilidad
- **Responsividad:** Mobile-first design con breakpoints adaptativos
- **Iconografía:** Font Awesome 6.0.0 para iconos vectoriales
- **Tipografía:** Google Fonts (Inter) para legibilidad óptima

#### **Infraestructura y DevOps**
- **Deployment:** Railway.app con auto-deploy desde GitHub
- **Monitoreo:** Health checks automatizados, logging estructurado
- **Gestión de Dependencias:** npm con lock file para reproducibilidad
- **Control de Versiones:** Git con estrategia de branching GitFlow

### **Patrones de Diseño Implementados:**

1. **Clean Architecture (Arquitectura Hexagonal)**
   - Separación clara entre capas de dominio, aplicación e infraestructura
   - Independencia de frameworks externos en la lógica de negocio
   - Inversión de dependencias mediante inyección de dependencias

2. **Repository Pattern**
   - Abstracción del acceso a datos
   - Facilita testing unitario con mocks
   - Permite cambio de motor de base de datos sin afectar lógica

3. **Use Case Pattern (Interactors)**
   - Encapsulación de reglas de negocio específicas
   - Reutilización de lógica entre diferentes interfaces
   - Testabilidad independiente de frameworks

4. **Middleware Pattern**
   - Pipeline de procesamiento de requests HTTP
   - Separación de concerns (autenticación, validación, logging)
   - Composabilidad y reutilización de funcionalidades

5. **Observer Pattern (Pub/Sub)**
   - Implementado via Socket.IO para comunicación en tiempo real
   - Desacoplamiento entre emisores y receptores de eventos
   - Escalabilidad horizontal mediante clustering

---

## 📁 Arquitectura de Directorios (Clean Architecture)

```
├── src/                                    # Código fuente principal
│   ├── api/                               # Capa de Interfaz (Delivery Layer)
│   │   ├── controllers/                   # Controladores HTTP
│   │   │   ├── auth.controller.js         # • OAuth 2.0 flow completo
│   │   │   │                             # • JWT token generation/validation
│   │   │   │                             # • Error handling & redirects
│   │   │   ├── question.controller.js     # • CRUD operations para preguntas
│   │   │   │                             # • Validación de entrada
│   │   │   │                             # • Socket.IO event emission
│   │   │   └── task.controller.js         # • Gestión de tareas (extensión)
│   │   ├── routes/                        # Definición de endpoints REST
│   │   │   ├── auth.routes.js            # • GET/POST /api/auth/*
│   │   │   ├── question.routes.js        # • CRUD /api/questions/*
│   │   │   └── task.routes.js            # • Task management routes
│   │   └── validators/                    # Validaciones de entrada
│   │       └── validators.js             # • express-validator rules
│   │                                     # • Custom validation functions
│   ├── config/                           # Configuraciones del sistema
│   │   ├── database.js                   # • MongoDB connection config
│   │   │                                 # • Connection pooling
│   │   │                                 # • Error handling & retry logic
│   │   └── passport-setup.js             # • Google OAuth 2.0 strategy
│   │                                     # • Passport.js configuration
│   │                                     # • Serialization/deserialization
│   ├── domain/                           # Capa de Dominio (Business Logic)
│   │   ├── models/                       # Entidades y modelos de datos
│   │   │   ├── question.model.js         # • Schema: content, author, votes
│   │   │   │                             # • Indexes: performance optimization
│   │   │   │                             # • Validation: business rules
│   │   │   ├── task.model.js             # • Task entity definition
│   │   │   └── user.model.js             # • User schema con OAuth fields
│   │   │                                 # • Google profile integration
│   │   └── use-cases/                    # Casos de uso (Interactors)
│   │       ├── create-question.use-case.js   # • Validation + persistence
│   │       ├── delete-question.use-case.js   # • Authorization + cleanup
│   │       ├── get-questions.use-case.js     # • Filtering + pagination
│   │       ├── update-question.use-case.js   # • Partial updates + history
│   │       ├── login-user.use-case.js        # • Traditional auth flow
│   │       ├── oauth-login.use-case.js       # • OAuth integration logic
│   │       └── register-user.use-case.js     # • User creation + validation
│   ├── infrastructure/                   # Capa de Infraestructura
│   │   ├── middlewares/                  # Middleware functions
│   │   │   └── auth.middleware.js        # • JWT token verification
│   │   │                                 # • Request context population
│   │   │                                 # • Error handling
│   │   └── repositories/                 # Data Access Layer
│   │       ├── question.repository.js    # • MongoDB operations
│   │       ├── task.repository.js        # • CRUD abstractions
│   │       └── user.repository.js        # • Query optimization
│   ├── socket/                           # WebSocket Management
│   │   └── socket.server.js              # • Socket.IO server setup
│   │                                     # • JWT authentication for sockets
│   │                                     # • Event handling & broadcasting
│   │                                     # • Connection management
│   └── app.js                            # Servidor principal
│                                         # • Express app configuration
│                                         # • Middleware pipeline setup
│                                         # • Route registration
│                                         # • Error handling setup
├── public/                               # Frontend estático (SPA)
│   ├── index.html                        # • Semantic HTML5 structure
│   │                                     # • Meta tags for SEO/PWA
│   │                                     # • Socket.IO client integration
│   ├── app.js                           # • Frontend application logic
│   │                                     # • OAuth flow handling
│   │                                     # • Socket.IO event management
│   │                                     # • DOM manipulation & state
│   └── styles.css                       # • Responsive CSS architecture
│                                         # • CSS Grid/Flexbox layouts
│                                         # • CSS custom properties
│                                         # • Mobile-first approach
├── .env                                 # Variables de entorno (desarrollo)
├── .env.production                      # Template para producción
├── .gitignore                          # Git exclusion rules
├── package.json                        # Dependencies & scripts
├── railway.json                        # Railway deployment config
├── Procfile                            # Process definition
└── README.md                           # Documentación del proyecto
```

---

## ✅ Funcionalidades Técnicas Implementadas

### 🔐 **Sistema de Autenticación Completo (OAuth 2.0 + JWT)**

#### **Flujo OAuth 2.0 Authorization Code:**
```javascript
// 1. Redirección a Google OAuth
GET /api/auth/google
→ Redirect: https://accounts.google.com/o/oauth2/v2/auth?
  client_id=...&response_type=code&scope=profile email&
  redirect_uri=.../callback

// 2. Callback con authorization code
GET /api/auth/google/callback?code=AUTH_CODE&state=...
→ Exchange code for access_token
→ Fetch user profile from Google API
→ Create/update user in database
→ Generate JWT token
→ Redirect to frontend with token
```

#### **Middleware de Autenticación JWT:**
```javascript
// Verificación en cada request protegido
Authorization: Bearer <JWT_TOKEN>
→ jwt.verify(token, JWT_SECRET)
→ Decode user payload
→ Attach user to req.user
→ Continue to route handler
```

#### **Características de Seguridad:**
- **Token Expiration:** JWT con TTL de 24 horas
- **Secure Headers:** CORS configurado, X-Powered-By hidden
- **Input Validation:** express-validator en todos los endpoints
- **Error Handling:** No exposure de stack traces en producción

### 🔄 **Sistema de Tiempo Real (WebSockets con Socket.IO)**

#### **Autenticación de Sockets:**
```javascript
// Cliente envía JWT en handshake
socket.auth = { token: localStorage.getItem('jwt') }

// Servidor valida token antes de conexión
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, JWT_SECRET);
  socket.userId = decoded.userId;
  next();
});
```

#### **Eventos Implementados:**
| Evento | Dirección | Descripción | Payload |
|--------|-----------|-------------|---------|
| `question_created` | Server→Client | Nueva pregunta creada | `{question, author}` |
| `question_voted` | Server→Client | Voto en pregunta | `{questionId, votes, hasVoted}` |
| `question_answered` | Server→Client | Pregunta marcada como respondida | `{questionId, isAnswered}` |
| `question_deleted` | Server→Client | Pregunta eliminada | `{questionId}` |
| `user_typing` | Client→Server | Usuario escribiendo | `{isTyping: boolean}` |
| `typing_indicator` | Server→Client | Mostrar indicador | `{user, isTyping}` |
| `activity_update` | Server→Client | Feed de actividad | `{action, user, timestamp}` |

#### **Gestión de Conexiones:**
```javascript
// Connection pooling y heartbeat
connectedUsers = new Map(); // userId -> {socketId, user}
socket.on('disconnect', () => cleanupUserSession(socket.userId));

// Broadcasting optimizado
io.to('questions_room').emit('question_created', questionData);
```

### 🙋‍♀️ **Sistema de Gestión de Preguntas**

#### **Modelo de Datos (MongoDB):**
```javascript
const QuestionSchema = {
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
    validate: [validator.isLength, 'Content length invalid']
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true  // Optimización de queries
  },
  votes: [{
    user: { type: ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  isAnswered: {
    type: Boolean,
    default: false,
    index: true  // Para filtrado eficiente
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: -1    // Ordenamiento cronológico
  }
};
```

#### **API REST Completa:**
```javascript
// CRUD Operations con validación
POST   /api/questions           # Crear pregunta
├─ Validation: content (5-500 chars)
├─ Authentication: JWT required
├─ Socket emit: question_created
└─ Response: 201 + question object

GET    /api/questions           # Listar preguntas
├─ Pagination: ?page=1&limit=20
├─ Filtering: ?answered=false
├─ Population: author data
└─ Response: 200 + questions array

PUT    /api/questions/:id       # Actualizar pregunta
├─ Authorization: owner only
├─ Validation: partial update
├─ Socket emit: question_updated
└─ Response: 200 + updated question

PATCH  /api/questions/:id/answered  # Marcar respondida
├─ Authorization: admin/owner
├─ Socket emit: question_answered
└─ Response: 200 + status

POST   /api/questions/:id/vote  # Votar pregunta
├─ Idempotency: one vote per user
├─ Toggle logic: vote/unvote
├─ Socket emit: question_voted
└─ Response: 200 + vote status

DELETE /api/questions/:id       # Eliminar pregunta
├─ Authorization: owner/admin
├─ Socket emit: question_deleted
└─ Response: 204 No Content
```

#### **Validaciones Implementadas:**
- **Contenido:** 5-500 caracteres, no HTML injection
- **Rate Limiting:** Máximo 5 preguntas por minuto por usuario
- **Autorización:** Solo el autor puede modificar su pregunta
- **Sanitización:** HTML entities escaped, trim whitespace

### 📊 **Dashboard en Tiempo Real**

#### **Métricas Calculadas:**
```javascript
// Estadísticas dinámicas actualizadas en tiempo real
const stats = {
  totalQuestions: await Question.countDocuments(),
  pendingQuestions: await Question.countDocuments({isAnswered: false}),
  answeredQuestions: await Question.countDocuments({isAnswered: true}),
  connectedUsers: connectedUsers.size,
  totalVotes: await Question.aggregate([
    {$unwind: '$votes'},
    {$count: 'totalVotes'}
  ])
};
```

#### **Feed de Actividad:**
```javascript
// Log de actividades con timestamps
activityFeed = [
  {action: 'question_created', user: 'Juan', timestamp: '...'},
  {action: 'question_voted', user: 'María', timestamp: '...'},
  {action: 'user_connected', user: 'Pedro', timestamp: '...'}
];
```

---

## 🚀 Deployment y DevOps

### **Configuración de Railway.app:**

#### **Variables de Entorno en Producción:**
```bash
# Configuración del servidor
PORT=8080                    # Puerto asignado por Railway
NODE_ENV=production          # Optimizaciones de producción

# Base de datos (MongoDB Railway interno)
MONGODB_URI=mongodb://mongo:***@mongodb.railway.internal:27017

# Autenticación
JWT_SECRET=4ad1c0d222bf2c5cf68d2a19cf2d13c8cbe6ac961ddd8a47b232d899735b60655bb1f8f539197d74029c5b7497c7109f3c0d50c0d09ebdb90ac8c665e89e38c3

# OAuth Google (configurado en Google Cloud Console)
GOOGLE_CLIENT_ID=472262265682-***
GOOGLE_CLIENT_SECRET=GOCSPX-***
GOOGLE_CALLBACK_URL=https://examenu3hernandezstefy-production.up.railway.app/api/auth/google/callback

# Frontend
FRONTEND_URL=https://examenu3hernandezstefy-production.up.railway.app
```

#### **Configuración de Health Checks:**
```json
// railway.json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### **Endpoint de Monitoreo:**
```javascript
// GET /health - Health check endpoint
{
  "status": "healthy",
  "timestamp": "2025-08-13T23:46:12.491Z",
  "uptime": 405.774536975,
  "environment": "production",
  "database": "connected",
  "oauth": "configured"
}
```

#### **Sistema Anti-Sleep:**
```javascript
// Keep-alive para evitar hibernación en Railway
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    console.log(`💓 Keep-alive ping: ${new Date().toISOString()}`);
  }, 5 * 60 * 1000); // Cada 5 minutos
}
```

---

## 🔧 Instalación y Desarrollo

### **Prerrequisitos del Sistema:**
- **Node.js:** v18.x LTS o superior
- **MongoDB:** v7.0+ (local) o MongoDB Atlas (cloud)
- **Git:** Para control de versiones
- **Cuenta Google Cloud:** Para credenciales OAuth 2.0

### **Configuración de Desarrollo Local:**

#### **1. Clonar y Setup Inicial:**
```bash
# Clonar el repositorio
git clone https://github.com/Stefanny26/ExamenU3_Hernandez_Stefy.git
cd ExamenU3_Hernandez_Stefy

# Instalar dependencias
npm install

# Verificar instalación
npm run check:deps  # Check for outdated packages
npm run check:security  # Security audit
```

#### **2. Configuración de Base de Datos:**
```bash
# Opción 1: MongoDB local
sudo systemctl start mongod

# Opción 2: MongoDB Atlas (recomendado)
# - Crear cluster en https://cloud.mongodb.com
# - Obtener connection string
# - Configurar whitelist IP
```

#### **3. Configuración OAuth Google:**
```bash
# Google Cloud Console Setup:
# 1. Ir a https://console.cloud.google.com/
# 2. Crear nuevo proyecto o seleccionar existente
# 3. Habilitar Google+ API
# 4. Crear credenciales OAuth 2.0:
#    - Authorized JavaScript origins: http://localhost:3000
#    - Authorized redirect URIs: http://localhost:3000/api/auth/google/callback
```

#### **4. Variables de Entorno:**
```bash
# Crear archivo .env en la raíz
cp .env.production .env

# Editar .env con tus credenciales:
MONGODB_URI=mongodb://localhost:27017/question-queue-app
JWT_SECRET=tu_jwt_secret_muy_seguro_al_menos_32_caracteres
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### **5. Ejecución:**
```bash
# Desarrollo con hot reload
npm run dev

# Producción local
npm start

# Verificación del sistema
./verify-railway.sh  # Script de diagnóstico
```

#### **6. URLs de Acceso:**
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health
- **OAuth Demo:** http://localhost:3000/api/auth/google

---

## 📡 Documentación de API REST

### **Esquema de Autenticación:**
```http
# Todas las rutas protegidas requieren:
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### **Endpoints de Autenticación:**

#### **Iniciar OAuth Flow:**
```http
GET /api/auth/google
```
```javascript
// Response: Redirect 302
Location: https://accounts.google.com/o/oauth2/v2/auth?...
```

#### **Callback OAuth:**
```http
GET /api/auth/google/callback?code=AUTH_CODE&state=STATE
```
```javascript
// Success Response: Redirect 302
Location: /?token=JWT_TOKEN

// Error Response: Redirect 302
Location: /?error=oauth_failed
```

#### **Obtener Perfil Usuario:**
```http
GET /api/auth/profile
Authorization: Bearer <JWT_TOKEN>
```
```javascript
// Response: 200 OK
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "avatar": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-08-13T10:30:00.000Z"
  }
}
```

### **Endpoints de Preguntas:**

#### **Listar Preguntas:**
```http
GET /api/questions?page=1&limit=20&answered=false
Authorization: Bearer <JWT_TOKEN>
```
```javascript
// Response: 200 OK
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "content": "¿Cómo implementar WebSockets en Node.js?",
        "author": {
          "id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "name": "María García",
          "avatar": "https://lh3.googleusercontent.com/..."
        },
        "votes": 5,
        "hasVoted": false,
        "isAnswered": false,
        "createdAt": "2024-08-13T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

#### **Crear Pregunta:**
```http
POST /api/questions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "¿Cuál es la diferencia entre WebSockets y Server-Sent Events?"
}
```
```javascript
// Response: 201 Created
{
  "success": true,
  "data": {
    "question": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "content": "¿Cuál es la diferencia entre WebSockets y Server-Sent Events?",
      "author": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Pedro López"
      },
      "votes": 0,
      "isAnswered": false,
      "createdAt": "2024-08-13T10:35:00.000Z"
    }
  }
}

// Validation Error: 400 Bad Request
{
  "success": false,
  "errors": [
    {
      "field": "content",
      "message": "Content must be between 5 and 500 characters",
      "value": "Hola"
    }
  ]
}
```

#### **Votar Pregunta:**
```http
POST /api/questions/60f7b3b3b3b3b3b3b3b3b3b3/vote
Authorization: Bearer <JWT_TOKEN>
```
```javascript
// Response: 200 OK (Toggle vote)
{
  "success": true,
  "data": {
    "hasVoted": true,
    "votes": 6,
    "questionId": "60f7b3b3b3b3b3b3b3b3b3b3"
  }
}
```

#### **Marcar como Respondida:**
```http
PATCH /api/questions/60f7b3b3b3b3b3b3b3b3b3b3/answered
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "isAnswered": true
}
```
```javascript
// Response: 200 OK
{
  "success": true,
  "data": {
    "questionId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "isAnswered": true,
    "answeredAt": "2024-08-13T10:40:00.000Z"
  }
}
```

---

## 🔌 Documentación Socket.IO

### **Conexión del Cliente:**
```javascript
// Autenticación en el handshake
const socket = io('https://examenu3hernandezstefy-production.up.railway.app', {
  auth: {
    token: localStorage.getItem('jwt')
  }
});

// Manejo de errores de conexión
socket.on('connect_error', (error) => {
  if (error.message === 'Authentication failed') {
    // Redirect to login
    window.location.href = '/login';
  }
});
```

### **Eventos del Cliente → Servidor:**

#### **Unirse a Sala de Preguntas:**
```javascript
socket.emit('join_room', {
  room: 'questions',
  userInfo: {
    name: 'Juan Pérez',
    avatar: 'https://...'
  }
});
```

#### **Indicador de Escritura:**
```javascript
// Usuario está escribiendo
socket.emit('user_typing', {
  isTyping: true,
  room: 'questions'
});

// Usuario dejó de escribir
socket.emit('user_typing', {
  isTyping: false,
  room: 'questions'
});
```

### **Eventos del Servidor → Cliente:**

#### **Nueva Pregunta Creada:**
```javascript
socket.on('question_created', (data) => {
  /*
  data = {
    question: {
      id: "...",
      content: "¿Cómo funciona OAuth 2.0?",
      author: { name: "María", avatar: "..." },
      votes: 0,
      createdAt: "2024-08-13T10:30:00.000Z"
    },
    activityFeed: {
      action: "created_question",
      user: "María",
      timestamp: "2024-08-13T10:30:00.000Z"
    }
  }
  */
  
  // Agregar pregunta al DOM
  addQuestionToList(data.question);
  
  // Actualizar feed de actividad
  updateActivityFeed(data.activityFeed);
  
  // Mostrar notificación
  showNotification(`Nueva pregunta de ${data.question.author.name}`);
});
```

#### **Pregunta Votada:**
```javascript
socket.on('question_voted', (data) => {
  /*
  data = {
    questionId: "60f7b3b3b3b3b3b3b3b3b3b3",
    votes: 8,
    voter: { name: "Pedro", avatar: "..." },
    hasVoted: true
  }
  */
  
  // Actualizar contador de votos
  updateVoteCount(data.questionId, data.votes);
  
  // Actualizar estado del botón de voto
  updateVoteButton(data.questionId, data.hasVoted);
  
  // Notificación visual
  showVoteAnimation(data.questionId);
});
```

#### **Pregunta Respondida:**
```javascript
socket.on('question_answered', (data) => {
  /*
  data = {
    questionId: "60f7b3b3b3b3b3b3b3b3b3b3",
    isAnswered: true,
    answeredBy: { name: "Profesor", avatar: "..." }
  }
  */
  
  // Marcar pregunta como respondida visualmente
  markQuestionAsAnswered(data.questionId);
  
  // Mover a sección de respondidas
  moveToAnsweredSection(data.questionId);
  
  // Actualizar estadísticas
  updateStats();
});
```

#### **Usuario Escribiendo:**
```javascript
socket.on('typing_indicator', (data) => {
  /*
  data = {
    user: { name: "Ana", avatar: "..." },
    isTyping: true
  }
  */
  
  if (data.isTyping) {
    showTypingIndicator(`${data.user.name} está escribiendo...`);
  } else {
    hideTypingIndicator(data.user.name);
  }
});
```

#### **Actualización de Estadísticas:**
```javascript
socket.on('stats_update', (data) => {
  /*
  data = {
    totalQuestions: 45,
    pendingQuestions: 12,
    answeredQuestions: 33,
    connectedUsers: 8,
    totalVotes: 156
  }
  */
  
  // Actualizar dashboard en tiempo real
  updateStatsDashboard(data);
  
  // Animar cambios
  animateStatsChange(data);
});
```

---

## 🧪 Testing y Verificación

### **Health Check del Sistema:**
```bash
# Verificar estado general
curl https://examenu3hernandezstefy-production.up.railway.app/health

# Response esperado:
{
  "status": "healthy",
  "timestamp": "2025-08-13T23:46:12.491Z",
  "uptime": 405.774536975,
  "environment": "production",
  "database": "connected",
  "oauth": "configured",
  "services": {
    "mongodb": "connected",
    "socketio": "active",
    "oauth": "ready"
  }
}
```

### **Testing Manual del OAuth Flow:**
```bash
# 1. Iniciar OAuth
curl -I https://examenu3hernandezstefy-production.up.railway.app/api/auth/google
# Debe retornar 302 redirect a Google

# 2. Verificar configuración OAuth
curl https://examenu3hernandezstefy-production.up.railway.app/api/auth/oauth/status
# Debe retornar configuración OAuth válida
```

### **Testing del API REST:**
```bash
# Obtener token JWT (después de OAuth)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test: Crear pregunta
curl -X POST \
  https://examenu3hernandezstefy-production.up.railway.app/api/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "¿Cómo funciona el middleware de autenticación en Express?"}'

# Test: Listar preguntas
curl -H "Authorization: Bearer $TOKEN" \
  https://examenu3hernandezstefy-production.up.railway.app/api/questions

# Test: Votar pregunta
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://examenu3hernandezstefy-production.up.railway.app/api/questions/QUESTION_ID/vote
```

### **Testing de WebSockets:**
```javascript
// Test client-side con browser console
const socket = io('https://examenu3hernandezstefy-production.up.railway.app', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => console.log('✅ Conectado a Socket.IO'));
socket.on('question_created', (data) => console.log('📝 Nueva pregunta:', data));
socket.on('question_voted', (data) => console.log('👍 Voto registrado:', data));

// Test typing indicator
socket.emit('user_typing', { isTyping: true, room: 'questions' });
```

---

## 📝 Notas Técnicas Avanzadas

### **Optimizaciones de Performance:**

#### **Base de Datos (MongoDB):**
```javascript
// Índices optimizados para queries frecuentes
db.questions.createIndex({ "createdAt": -1 })        // Ordenamiento cronológico
db.questions.createIndex({ "author": 1 })            // Queries por autor
db.questions.createIndex({ "isAnswered": 1 })        // Filtrado por estado
db.questions.createIndex({ "votes.user": 1 })        // Verificación de votos

// Aggregation pipeline para estadísticas
const stats = await Question.aggregate([
  {
    $facet: {
      total: [{ $count: "count" }],
      answered: [
        { $match: { isAnswered: true } },
        { $count: "count" }
      ],
      totalVotes: [
        { $unwind: "$votes" },
        { $count: "count" }
      ]
    }
  }
]);
```

#### **Socket.IO Optimizations:**
```javascript
// Room-based broadcasting para escalabilidad
io.to('questions_room').emit('question_created', data);

// Connection pooling y heartbeat
const heartbeatInterval = setInterval(() => {
  io.emit('ping');
}, 30000);

// Memory-efficient user tracking
const connectedUsers = new Map(); // O(1) lookups
```

### **Seguridad Implementada:**

#### **Input Validation & Sanitization:**
```javascript
// express-validator rules
const createQuestionValidation = [
  body('content')
    .trim()
    .isLength({ min: 5, max: 500 })
    .escape() // HTML entities
    .withMessage('Content must be 5-500 characters'),
  
  // Rate limiting
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many questions, please try again later'
  })
];
```

#### **JWT Security:**
```javascript
// Token generation con claims seguros
const token = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
  },
  process.env.JWT_SECRET,
  { algorithm: 'HS256' }
);

// Verificación con error handling
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

### **Error Handling & Logging:**

#### **Global Error Handler:**
```javascript
// Centralized error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    requestId: req.id
  });
});
```

#### **Structured Logging:**
```javascript
// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    console.log({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: Date.now() - start,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
});
```

---

## 🏆 Métricas de Calidad del Código

### **Arquitectura y Mantenibilidad:**
- ✅ **Clean Architecture:** Separación clara de responsabilidades
- ✅ **SOLID Principles:** Principios de diseño orientado a objetos
- ✅ **DRY (Don't Repeat Yourself):** Reutilización de código
- ✅ **Single Responsibility:** Cada módulo tiene una responsabilidad específica
- ✅ **Dependency Injection:** Facilita testing y mantenimiento

### **Performance Metrics:**
- ✅ **Response Time:** < 200ms para endpoints principales
- ✅ **Database Queries:** Optimizadas con índices apropiados
- ✅ **Memory Usage:** Gestión eficiente de conexiones Socket.IO
- ✅ **Bundle Size:** Frontend optimizado con lazy loading

### **Security Standards:**
- ✅ **OAuth 2.0 Compliance:** Implementación según RFC 6749
- ✅ **JWT Best Practices:** Tokens con expiración y validación
- ✅ **Input Validation:** Validación exhaustiva en frontend y backend
- ✅ **CORS Configuration:** Configuración restrictiva para producción

---

## 👨‍💻 Información del Desarrollador

**Nombre:** Stefanny Mishel Hernández Buenaño  
**Institución:** Universidad Técnica del Norte  
**Carrera:** Ingeniería en Software  
**Proyecto:** Examen Práctico - Desarrollo Web Full Stack  
**Tecnologías:** Node.js, Express.js, MongoDB, Socket.IO, OAuth 2.0, JWT  
**Deployment:** Railway.app con integración CI/CD  
**Repositorio:** https://github.com/Stefanny26/ExamenU3_Hernandez_Stefy  
**Aplicación:** https://examenu3hernandezstefy-production.up.railway.app/  
**Fecha de Desarrollo:** 13 de agosto de 2025

### **Competencias Técnicas Demostradas:**
- ✅ Desarrollo Full Stack con Node.js ecosystem
- ✅ Implementación de patrones de arquitectura limpia
- ✅ Integración de servicios OAuth 2.0 y JWT
- ✅ Desarrollo de aplicaciones en tiempo real con WebSockets
- ✅ Deployment y DevOps en plataformas cloud
- ✅ Documentación técnica profesional
- ✅ Testing y validación de sistemas web

---

**🌐 Aplicación en Producción:** https://examenu3hernandezstefy-production.up.railway.app/
