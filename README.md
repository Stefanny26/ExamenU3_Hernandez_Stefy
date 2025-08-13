# Cola de Preguntas para Charla

Sistema en tiempo real para gestión de preguntas durante charlas y presentaciones con OAuth 2.0, JWT y Socket.IO.

## Descripción Técnica

Aplicación web que permite a los usuarios autenticarse vía Google OAuth 2.0, enviar preguntas durante charlas que se muestran instantáneamente a todos los participantes, votar por preguntas para priorizarlas y marcar preguntas como respondidas.

## Arquitectura

- **Backend**: Node.js + Express.js con Clean Architecture
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: OAuth 2.0 (Google) + JWT
- **Tiempo Real**: Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript

## Estructura del Proyecto

```
src/
├── api/
│   ├── controllers/
│   │   ├── auth.controller.js          # OAuth y JWT
│   │   └── question.controller.js      # CRUD de preguntas
│   └── routes/
│       ├── auth.routes.js              # Rutas de autenticación  
│       └── question.routes.js          # Rutas de preguntas
├── domain/
│   ├── models/
│   │   ├── question.model.js           # Esquema de pregunta
│   │   └── user.model.js               # Esquema de usuario
│   └── use-cases/                      # Lógica de negocio
├── infrastructure/
│   ├── repositories/                   # Acceso a datos
│   └── middlewares/
│       └── auth.middleware.js          # Validación JWT
├── socket/
│   └── socket.server.js                # Servidor Socket.IO
└── config/
    ├── database.js                     # Conexión MongoDB
    └── passport-setup.js               # Configuración OAuth
```

## Instalación

### Prerrequisitos
- Node.js 16+
- MongoDB
- Google Cloud Platform (para OAuth)

### Configuración

1. **Instalar dependencias**
```bash
npm install
```

2. **Variables de entorno**
```bash
cp .env.example .env
```

Configurar `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/question-queue-app
JWT_SECRET=tu_jwt_secret_muy_seguro
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
PORT=3000
```

3. **Google OAuth Setup**
- Crear proyecto en Google Cloud Console
- Habilitar APIs necesarias
- Crear credenciales OAuth 2.0
- Configurar URIs de redirección: `http://localhost:3000/api/auth/google/callback`

4. **Ejecutar**
```bash
npm start
```

Aplicación disponible en: `http://localhost:3000`

## API Endpoints

### Autenticación
- `GET /api/auth/google` - Iniciar OAuth flow
- `GET /api/auth/google/callback` - Callback OAuth
- `GET /api/auth/profile` - Obtener perfil usuario (protegida)

### Preguntas (Rutas Protegidas)
- `GET /api/questions` - Listar preguntas
- `POST /api/questions` - Crear pregunta
- `PUT /api/questions/:id` - Actualizar pregunta
- `DELETE /api/questions/:id` - Eliminar pregunta
- `PATCH /api/questions/:id/answered` - Marcar como respondida
- `POST /api/questions/:id/vote` - Votar pregunta

## Eventos Socket.IO

- `question_created` - Nueva pregunta
- `question_voted` - Pregunta votada
- `question_answered` - Pregunta respondida
- `question_deleted` - Pregunta eliminada
- `user_connected` - Usuario conectado
- `question:typing` - Usuario escribiendo

## Funcionalidades Implementadas

### OAuth 2.0 Flow
- Authorization Code Flow completo
- Manejo de callbacks y errores
- Integración con JWT para sesiones

### JWT Authentication
- Generación de tokens tras OAuth exitoso
- Middleware de verificación en rutas protegidas
- Almacenamiento seguro en cliente

### Socket.IO Tiempo Real
- Autenticación de conexiones con JWT
- Eventos en tiempo real para todas las operaciones
- Notificaciones instantáneas a todos los usuarios

### Sistema de Preguntas
- CRUD completo de preguntas
- Sistema de votación para priorización
- Marcado de preguntas como respondidas
- Validaciones de entrada (5-500 caracteres)

## Despliegue

### Variables de Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
GOOGLE_CALLBACK_URL=https://tu-dominio.com/api/auth/google/callback
```

### Plataformas Compatibles
- Railway
- Render
- Vercel
- Heroku

## Testing

Verificar funcionalidad:
1. OAuth flow completo
2. Creación de preguntas en tiempo real
3. Sistema de votación
4. Marcado como respondida
5. Eventos Socket.IO

---

**Desarrollado por:** Stefanny Mishel Hernández Buenaño  
**Fecha:** 13 de agosto de 2025
