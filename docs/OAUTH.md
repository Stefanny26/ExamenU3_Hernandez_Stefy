# 🔐 Documentación OAuth 2.0 - Autenticación con Google

## 📋 Resumen

Esta rama implementa la autenticación OAuth 2.0 con Google para permitir a los usuarios iniciar sesión usando sus cuentas de Google existentes.

## 🏗️ Arquitectura OAuth

```
Frontend → Google OAuth → Callback → JWT Token → Acceso a API
```

### Flujo de Autenticación:

1. **Usuario hace clic en "Continuar con Google"**
2. **Redirección a Google** (`/api/auth/google`)
3. **Google autentica al usuario**
4. **Callback de Google** (`/api/auth/google/callback`)
5. **Procesamiento del perfil** (Passport.js)
6. **Creación/búsqueda de usuario** (Repository)
7. **Generación de JWT** (Use Case)
8. **Redirección al frontend con token**

## 📁 Archivos Modificados en esta Rama

### 🆕 Nuevos Archivos:
- `src/config/passport-setup.js` - Configuración de Passport.js para Google
- `src/domain/use-cases/oauth-login.use-case.js` - Lógica de negocio OAuth
- `docs/OAUTH.md` - Esta documentación

### 🔧 Archivos Modificados:
- `src/api/routes/auth.routes.js` - Rutas OAuth y endpoints de prueba
- `src/api/controllers/auth.controller.js` - Controlador OAuth
- `src/domain/models/user.model.js` - Soporte para usuarios OAuth
- `src/infrastructure/repositories/user.repository.js` - Métodos OAuth
- `frotend-example/index.html` - Botones y lógica OAuth

## 🛠️ Configuración

### Variables de Entorno (`.env`):
```env
# OAuth Google
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### Configuración en Google Cloud Console:

1. **Crear proyecto en Google Cloud Console**
2. **Habilitar Google+ API**
3. **Crear credenciales OAuth 2.0**
4. **Configurar URLs autorizadas:**
   - JavaScript origins: `http://localhost:3000`
   - Redirect URIs: `http://localhost:3000/api/auth/google/callback`

## 🚀 Endpoints OAuth

### Producción:
- `GET /api/auth/google` - Iniciar OAuth con Google
- `GET /api/auth/google/callback` - Callback de Google
- `GET /api/auth/profile` - Obtener perfil del usuario autenticado

### Desarrollo/Prueba:
- `GET /api/auth/google/demo` - Simular login OAuth (sin credenciales reales)
- `GET /api/auth/oauth/status` - Ver estado de configuración OAuth

## 🧪 Testing OAuth

### Opción 1: Con Credenciales Reales
1. Configurar credenciales en Google Cloud Console
2. Actualizar `.env` con credenciales reales
3. Reiniciar servidor
4. Usar botón "Continuar con Google" en frontend

### Opción 2: Demo/Simulación
1. Ir a `http://localhost:3000/api/auth/google/demo`
2. Se creará un usuario demo y se generará un JWT
3. Redirección automática al frontend con token

### Opción 3: Frontend Simulado
1. Usar botón "🔬 Demo: Simular Login Google" en el frontend
2. Simula todo el flujo OAuth en el cliente

## 📊 Respuestas de la API

### Login OAuth Exitoso:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Usuario Google",
    "email": "user@gmail.com",
    "provider": "google",
    "avatar": "https://lh3.googleusercontent.com/..."
  },
  "token": "jwt_token_here",
  "message": "Autenticación OAuth exitosa"
}
```

### Error OAuth:
```json
{
  "success": false,
  "message": "Error en autenticación OAuth: detalles del error"
}
```

## 🔒 Seguridad

- **JWT Tokens** con expiración de 24 horas
- **Validación de email** requerida de Google
- **Usuarios únicos** por email y googleId
- **Passwords opcionales** para usuarios OAuth
- **Avatar seguro** desde Google CDN

## 📝 Modelos de Datos

### Usuario OAuth:
```javascript
{
  name: "Usuario Google",
  email: "user@gmail.com",
  googleId: "google_user_id",
  avatar: "https://lh3.googleusercontent.com/...",
  provider: "google",
  password: null // No requerido para OAuth
}
```

## 🐛 Debugging

### Logs útiles:
- `🔐 Procesando perfil de Google OAuth:` - Datos recibidos de Google
- `✅ Usuario OAuth procesado exitosamente:` - Usuario creado/encontrado
- `🧪 Iniciando demostración de OAuth Google...` - Modo demo
- `⚠️ Credenciales de Google OAuth no configuradas` - Falta configuración

### Comandos útiles:
```bash
# Ver estado OAuth
curl http://localhost:3000/api/auth/oauth/status

# Probar demo OAuth
curl http://localhost:3000/api/auth/google/demo

# Ver logs del servidor
tail -f logs/server.log
```

## 🚀 Despliegue

Para producción, asegurar:
1. **HTTPS obligatorio** para OAuth
2. **URLs de callback actualizadas** en Google Cloud Console
3. **Variables de entorno** configuradas en el servidor
4. **CORS** configurado para el dominio correcto

## 🔄 Próximos Pasos

- [ ] Agregar soporte para más proveedores OAuth (Facebook, GitHub)
- [ ] Implementar refresh tokens
- [ ] Agregar vinculación de cuentas (local + OAuth)
- [ ] Tests automatizados para OAuth
- [ ] Rate limiting para endpoints OAuth
