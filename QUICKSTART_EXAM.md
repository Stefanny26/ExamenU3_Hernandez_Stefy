# 🚀 GUÍA RÁPIDA DE INSTALACIÓN - COLA DE PREGUNTAS

## ⚡ Configuración Express (5 minutos)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
```

**Editar `.env` con tus credenciales de Google:**
```bash
MONGODB_URI=mongodb://localhost:27017/questions-queue
JWT_SECRET=mi_clave_secreta_super_segura_2025
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 3. Iniciar MongoDB
```bash
# Ubuntu/Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 4. Ejecutar la Aplicación
```bash
npm run dev
```

✅ **Listo!** Abre: `http://localhost:3000`

---

## 🔧 Configuración Google OAuth (IMPORTANTE)

### Pasos en Google Cloud Console:

1. **Ir a:** https://console.cloud.google.com/
2. **Crear proyecto** o seleccionar uno existente
3. **Habilitar APIs:**
   - Google OAuth 2.0
   - Google People API (opcional)
4. **Crear credenciales:**
   - Tipo: "ID de cliente de OAuth 2.0"
   - Tipo de aplicación: "Aplicación web"
   - Orígenes autorizados: `http://localhost:3000`
   - URIs de redirección: `http://localhost:3000/api/auth/google/callback`
5. **Copiar** Client ID y Client Secret al archivo `.env`

---

## 🧪 Modo Demo (Sin OAuth)

Si no tienes tiempo para configurar OAuth, usa el modo demo:

**URL:** `http://localhost:3000/api/auth/google/demo`

Esto crea un usuario simulado y permite probar toda la funcionalidad.

---

## ✅ Verificación Rápida

### 1. Funcionalidades a Probar:

#### OAuth 2.0:
- [ ] Botón "Conectar con Google" redirige a Google
- [ ] Callback procesa la respuesta y genera JWT
- [ ] Usuario queda autenticado en la aplicación

#### JWT y Rutas Protegidas:
- [ ] Token se genera tras OAuth exitoso
- [ ] Rutas `/api/questions/*` requieren token
- [ ] Middleware valida token en cada petición

#### Socket.IO en Tiempo Real:
- [ ] Abrir 2 ventanas del navegador
- [ ] Crear pregunta en una ventana
- [ ] Ver pregunta aparecer inmediatamente en la otra
- [ ] Votar pregunta y ver votos actualizarse

### 2. Endpoints Principales:
```bash
# Autenticación
GET /api/auth/google
GET /api/auth/profile

# Preguntas (requieren autenticación)
GET /api/questions
POST /api/questions
PATCH /api/questions/:id/answered
POST /api/questions/:id/vote
```

---

## 🚀 Para Despliegue Rápido

### Railway (Recomendado):
1. Conectar repositorio de GitHub
2. Configurar variables de entorno en el dashboard
3. Actualizar `GOOGLE_CALLBACK_URL` con la URL de producción

### Variables para Producción:
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://tu-app.railway.app
GOOGLE_CALLBACK_URL=https://tu-app.railway.app/api/auth/google/callback
```

---

## 🔍 Solución de Problemas

### Error "OAuth not configured":
- Verificar que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén en `.env`
- Reiniciar servidor tras cambiar `.env`

### Error "MongoDB connection":
- Verificar que MongoDB esté ejecutándose
- Comprobar URL de conexión en `MONGODB_URI`

### Error "Socket connection":
- Verificar que el puerto 3000 esté disponible
- Comprobar firewall/antivirus

### Error 403 en OAuth:
- Verificar que la URL de callback coincida exactamente
- Revisar orígenes autorizados en Google Console

---

## 📋 Lista de Verificación Final

- [ ] ✅ OAuth 2.0 funciona (login con Google)
- [ ] ✅ JWT se genera y valida correctamente
- [ ] ✅ Socket.IO actualiza en tiempo real
- [ ] ✅ Aplicación desplegada y accesible
- [ ] ✅ Repositorio en GitHub con commits descriptivos

**¡Tu proyecto está listo para la evaluación!** 🎉
