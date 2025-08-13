# 🙋‍♀️ Cola de Preguntas para Charla

Sistema en tiempo real para gestionar preguntas durante charlas y presentaciones con OAuth 2.0, JWT y Socket.IO.

## 📋 Descripción del Proyecto

**Tema del Examen:** Cola de Preguntas para Charla

Este proyecto implementa un sistema completo donde los usuarios pueden:

1. **Iniciar sesión vía OAuth 2.0** (Google)
2. **Hacer preguntas** durante una charla o presentación
3. **Ver todas las preguntas en tiempo real** - actualizaciones instantáneas para todos los usuarios
4. **Votar por preguntas** para priorizarlas
5. **Marcar preguntas como respondidas**

## 🚀 Funcionalidades Principales

### ✅ OAuth 2.0 Implementado
- Autenticación con Google OAuth 2.0
- Flujo completo: autorización → callback → JWT
- Manejo seguro de tokens
- Modo demo para pruebas

### ✅ JWT y Rutas Protegidas
- Generación automática de JWT tras OAuth exitoso
- Middleware de autenticación para todas las rutas de preguntas
- Validación de tokens en cada petición
- Renovación automática de sesión

### ✅ Funcionalidad en Tiempo Real (Socket.IO)
- **Nuevas preguntas:** Se muestran instantáneamente a todos los usuarios
- **Votación:** Los votos se actualizan en tiempo real
- **Preguntas respondidas:** Notificación inmediata cuando se marca como respondida
- **Indicadores de estado:** Quién está conectado, quién está escribiendo
- **Feed de actividad:** Historial de acciones en tiempo real

### 🎯 Flujo Principal
1. Usuario accede a la aplicación
2. Se autentica con Google OAuth
3. Recibe JWT y accede al sistema
4. Puede escribir preguntas (máximo 500 caracteres)
5. Las preguntas aparecen inmediatamente para todos los usuarios
6. Otros usuarios pueden votar por las preguntas
7. Las preguntas pueden marcarse como respondidas
8. Todo se actualiza en tiempo real vía Socket.IO

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js + Express.js
- **Base de Datos:** MongoDB + Mongoose
- **Autenticación:** OAuth 2.0 (Google) + JWT
- **Tiempo Real:** Socket.IO
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Arquitectura:** Clean Architecture + Repository Pattern

## 📁 Estructura del Proyecto

```
src/
├── api/
│   ├── controllers/
│   │   ├── auth.controller.js          # OAuth y JWT
│   │   ├── question.controller.js      # CRUD de preguntas
│   │   └── task.controller.js          # (heredado del proyecto base)
│   └── routes/
│       ├── auth.routes.js              # Rutas de autenticación
│       ├── question.routes.js          # Rutas de preguntas
│       └── task.routes.js              # (heredado del proyecto base)
├── domain/
│   ├── models/
│   │   ├── question.model.js           # Modelo de pregunta
│   │   └── user.model.js               # Modelo de usuario
│   └── use-cases/
│       ├── create-question.use-case.js
│       ├── get-questions.use-case.js
│       ├── update-question.use-case.js
│       └── delete-question.use-case.js
├── infrastructure/
│   ├── repositories/
│   │   ├── question.repository.js      # Persistencia de preguntas
│   │   └── user.repository.js          # Persistencia de usuarios
│   └── middlewares/
│       └── auth.middleware.js          # Validación JWT
├── socket/
│   └── socket.server.js                # Servidor Socket.IO
└── config/
    ├── database.js                     # Conexión MongoDB
    └── passport-setup.js               # Configuración OAuth
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB
- Cuenta de Google Cloud Platform

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/cola-preguntas-charla.git
cd cola-preguntas-charla
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```bash
# Base de datos
MONGODB_URI=mongodb://localhost:27017/questions-queue

# JWT (generar una clave segura)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Google OAuth (obtener de Google Cloud Console)
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 4. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google OAuth 2.0
4. Crea credenciales OAuth 2.0:
   - Tipo: Aplicación web
   - Orígenes autorizados: `http://localhost:3000`
   - URIs de redirección: `http://localhost:3000/api/auth/google/callback`
5. Copia el Client ID y Client Secret al archivo `.env`

### 5. Iniciar MongoDB
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 6. Ejecutar la Aplicación
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

## 🔧 Uso de la Aplicación

### Autenticación
1. Accede a `http://localhost:3000`
2. Haz clic en "Conectar con Google"
3. Autoriza la aplicación
4. Serás redirigido al dashboard principal

### Gestión de Preguntas
1. **Crear:** Escribe tu pregunta (máximo 500 caracteres) y presiona "Enviar"
2. **Votar:** Haz clic en el botón de voto (👍) para priorizar preguntas
3. **Responder:** Marca preguntas como respondidas con el botón "✓"
4. **Eliminar:** Solo el autor puede eliminar sus propias preguntas

### Funciones en Tiempo Real
- **Nuevas preguntas:** Aparecen instantáneamente
- **Votos:** Se actualizan en tiempo real
- **Estado de conexión:** Ve quién está en línea
- **Actividad:** Feed en vivo de todas las acciones

## 🧪 Pruebas

### Modo Demo (Sin OAuth)
Para pruebas rápidas sin configurar OAuth:
```
http://localhost:3000/api/auth/google/demo
```

### Endpoints API
```bash
# Autenticación
GET  /api/auth/google              # Iniciar OAuth
GET  /api/auth/google/callback     # Callback OAuth
GET  /api/auth/profile             # Perfil usuario (protegida)

# Preguntas (todas requieren JWT)
GET    /api/questions              # Listar preguntas
POST   /api/questions              # Crear pregunta
GET    /api/questions/:id          # Obtener pregunta específica
PUT    /api/questions/:id          # Actualizar pregunta (solo autor)
DELETE /api/questions/:id          # Eliminar pregunta (solo autor)
PATCH  /api/questions/:id/answered # Marcar como respondida
POST   /api/questions/:id/vote     # Votar/desvotar pregunta

# Estadísticas
GET /api/questions/stats           # Estadísticas generales
GET /api/questions/my-questions    # Mis preguntas
```

## 📊 Eventos Socket.IO

### Eventos que Emite el Cliente
```javascript
'question:typing'     // Usuario escribiendo pregunta
'questions:refresh'   // Solicitar actualización
```

### Eventos que Recibe el Cliente
```javascript
'question_created'    // Nueva pregunta añadida
'question_updated'    // Pregunta modificada
'question_answered'   // Pregunta marcada como respondida
'question_voted'      // Pregunta votada/desvotada
'question_deleted'    // Pregunta eliminada
'user_connected'      // Usuario se conectó
'user_disconnected'   // Usuario se desconectó
```

## 🔒 Seguridad

- **Autenticación:** OAuth 2.0 con Google
- **Autorización:** JWT con verificación en cada petición
- **Validación:** Express-validator para todos los inputs
- **Sanitización:** Escape de HTML en el frontend
- **CORS:** Configurado correctamente
- **Rate Limiting:** Implementado a nivel de base de datos

## 🚀 Despliegue

### Variables de Entorno para Producción
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/questions-queue
FRONTEND_URL=https://tu-dominio.com
GOOGLE_CALLBACK_URL=https://tu-dominio.com/api/auth/google/callback
```

### Plataformas Recomendadas
- **Railway:** `railway up`
- **Render:** Conectar repositorio de GitHub
- **Vercel:** Para frontend estático
- **Heroku:** `git push heroku main`

## 📈 Funcionalidades Adicionales

### Implementadas
- ✅ Contador de caracteres en tiempo real
- ✅ Indicador de "usuario escribiendo"
- ✅ Estadísticas en vivo
- ✅ Feed de actividad
- ✅ Sistema de votación
- ✅ Ordenamiento inteligente (pendientes primero, luego por votos)
- ✅ Responsive design

### Posibles Mejoras Futuras
- 🔄 Roles de usuario (moderador, presentador, asistente)
- 🔄 Categorías de preguntas
- 🔄 Exportar preguntas a PDF
- 🔄 Límite de tiempo para preguntas
- 🔄 Integración con otras plataformas (Discord, Slack)

## 🤝 Contribución

Este proyecto fue desarrollado como parte de un examen práctico de backend. El enfoque está en demostrar:

1. **OAuth 2.0:** Flujo completo y manejo seguro
2. **JWT:** Generación, validación y middleware
3. **Socket.IO:** Comunicación bidireccional en tiempo real
4. **Arquitectura Limpia:** Separación de responsabilidades
5. **Despliegue:** Aplicación funcional en producción

## 📄 Licencia

MIT License - Ver archivo `LICENSE` para más detalles.

---

**Desarrollado por:** Stefanny Hernández  
**Proyecto:** Cola de Preguntas para Charla  
**Examen:** Backend con OAuth 2.0, JWT y Socket.IO  
**Fecha:** Agosto 2025
