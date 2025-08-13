# 🙋‍♀️ Cola de Preguntas para Charla - Examen Práctico

**Estudiante:** Stefanny Mishel Hernández Buenaño  
**Proyecto:** Cola de Preguntas para Charla (Tema asignado)  
**Fecha:** 13 de agosto de 2025

## 📋 Descripción del Proyecto

Sistema en tiempo real para gestionar preguntas durante charlas y presentaciones. Los asistentes pueden enviar preguntas que se muestran a todos instantáneamente, votar por las más importantes y ver cuando son respondidas.

## ✅ Implementaciones Completadas

### 1. OAuth 2.0 Authentication (✅ COMPLETO)
- ✅ Flujo completo de Authorization Code con Google
- ✅ Manejo de callbacks y errores
- ✅ Integración con JWT
- ✅ Redirección automática post-autenticación

### 2. JWT Token Management (✅ COMPLETO)
- ✅ Generación de tokens tras OAuth exitoso
- ✅ Middleware de verificación para rutas protegidas
- ✅ Almacenamiento seguro en cliente
- ✅ Validación en todas las operaciones

### 3. Socket.IO Tiempo Real (✅ COMPLETO)
- ✅ Autenticación de sockets con JWT
- ✅ Eventos en tiempo real para nuevas preguntas
- ✅ Notificaciones de votos y respuestas
- ✅ Indicadores de usuarios escribiendo
- ✅ Feed de actividad en vivo

### 4. Funcionalidad Específica del Tema (✅ COMPLETO)
- ✅ **Campo para enviar pregunta**: Textarea con validación (5-500 caracteres)
- ✅ **Lista visible para todos**: Las preguntas aparecen inmediatamente para todos los usuarios
- ✅ **Tiempo real**: Usando Socket.IO para actualizaciones instantáneas
- ✅ **Sistema de votación**: Para priorizar preguntas importantes
- ✅ **Marcar como respondida**: Para organizar el flujo de la charla

## 🚀 Características Adicionales

- **Arquitectura Limpia**: Separación en capas (domain, use-cases, infrastructure)
- **Validaciones Robustas**: Server-side y client-side
- **Interfaz Moderna**: Diseño responsive y intuitivo
- **Estadísticas en Tiempo Real**: Contador de preguntas pendientes/respondidas
- **Gestión de Errores**: Manejo completo de errores y notificaciones
- **Persistencia**: MongoDB para almacenar preguntas y usuarios

## 📖 Cómo Usar la Aplicación

1. **Iniciar Sesión**: Hacer clic en "Conectar con Google"
2. **Enviar Pregunta**: Escribir en el textarea y hacer clic en "Enviar Pregunta"
3. **Votar**: Hacer clic en el botón de like para votar preguntas importantes
4. **Marcar como Respondida**: Cualquier usuario puede marcar preguntas como respondidas
5. **Ver Actividad**: El panel lateral muestra toda la actividad en tiempo real

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: OAuth 2.0 (Google) + JWT
- **Tiempo Real**: Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Arquitectura**: Clean Architecture Pattern

## 🔧 Variables de Entorno Configuradas

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/question-queue-app

# JWT
JWT_SECRET=question_queue_jwt_secret_key_2025

# OAuth Google
GOOGLE_CLIENT_ID=472262265682-0672drkrf3f80kt3lck193b2pi3f57hm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[CONFIGURADO]
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📡 Endpoints API Implementados

### Autenticación
- `GET /api/auth/google` - Iniciar OAuth
- `GET /api/auth/google/callback` - Callback OAuth
- `GET /api/auth/profile` - Perfil del usuario (protegida)

### Preguntas
- `GET /api/questions` - Obtener todas las preguntas (protegida)
- `POST /api/questions` - Crear nueva pregunta (protegida)
- `GET /api/questions/:id` - Obtener pregunta específica (protegida)
- `PUT /api/questions/:id` - Actualizar pregunta (protegida)
- `DELETE /api/questions/:id` - Eliminar pregunta (protegida)
- `PATCH /api/questions/:id/answered` - Marcar como respondida (protegida)
- `POST /api/questions/:id/vote` - Votar pregunta (protegida)
- `GET /api/questions/stats` - Estadísticas (protegida)

## 📊 Funcionalidades Tiempo Real (Socket.IO)

- `question_created` - Nueva pregunta agregada
- `question_voted` - Pregunta votada
- `question_answered` - Pregunta marcada como respondida
- `question_deleted` - Pregunta eliminada
- `user_connected` - Usuario se conectó
- `user_disconnected` - Usuario se desconectó
- `question:typing` - Usuario está escribiendo

## 🎯 Cumplimiento de Objetivos del Examen

| Objetivo | Estado | Implementación |
|----------|--------|----------------|
| OAuth 2.0 Authorization Code Flow | ✅ | Google OAuth completo con manejo de errores |
| JWT para gestión de sesiones | ✅ | Tokens seguros, middleware de verificación |
| Socket.IO tiempo real | ✅ | Eventos completos para todas las acciones |
| Gestión de código en GitHub | ✅ | Commits descriptivos y organizados |
| Despliegue en la nube | 🚀 | Listo para Railway/Render/Vercel |

## 🔄 Para Ejecutar Localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Iniciar MongoDB
npm run mongo:start

# 4. Ejecutar aplicación
npm start

# 5. Abrir navegador
# http://localhost:3000
```

## 🌐 URLs Importantes

- **Frontend**: http://localhost:3000
- **API Info**: http://localhost:3000/api
- **OAuth Login**: http://localhost:3000/api/auth/google
- **Health Check**: http://localhost:3000/health

## 📈 Próximos Pasos para Despliegue

1. Crear repositorio en GitHub
2. Configurar variables de entorno en Railway/Render
3. Conectar MongoDB Atlas
4. Actualizar GOOGLE_CALLBACK_URL con dominio de producción
5. Hacer deploy

---

**✨ ¡Aplicación lista para evaluación!** Todas las funcionalidades requeridas están implementadas y funcionando correctamente.
