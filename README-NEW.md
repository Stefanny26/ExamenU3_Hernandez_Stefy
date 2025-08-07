# 🔐 TodoApp - Administrador de Tareas con Google OAuth 2.0

Una aplicación completa de gestión de tareas con autenticación múltiple: Google OAuth 2.0, credenciales tradicionales y modo demo.

## ✨ Características

- 🔐 **Google OAuth 2.0** - Autenticación con cuenta de Google
- 📧 **Login Tradicional** - Email y contraseña
- 🧪 **Modo Demo** - Prueba sin credenciales reales
- 📋 **CRUD Completo** - Crear, editar, completar y eliminar tareas
- 🎨 **Interfaz Moderna** - Diseño responsive con saludo personalizado
- 🔄 **Filtros** - Ver todas, pendientes o completadas
- 💾 **Persistencia** - Datos guardados en MongoDB

## 🚀 Instalación Rápida

### 1. Clonar e instalar dependencias
```bash
git clone [tu-repo]
cd todo-api
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env`:
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/todo-api

# JWT
JWT_SECRET=tu_jwt_secreto_super_seguro

# Servidor
PORT=3000
FRONTEND_URL=http://localhost:3000

# Google OAuth (opcional - usar credenciales reales)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 3. Ejecutar
```bash
npm run dev
```

Abrir: http://localhost:3000

## 🎯 Uso de la Aplicación

### Opciones de Autenticación:

1. **"Iniciar con Google"** - OAuth real (requiere configuración Google Cloud)
2. **"Usar Email y Contraseña"** - Registro/login tradicional
3. **"Demo Mode"** - Prueba inmediata sin configuración

### Después del Login:
- ✅ Saludo personalizado: "¡Hola, [Tu Nombre]! 👋"
- ✅ Crear nuevas tareas con título y descripción
- ✅ Marcar tareas como completadas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas
- ✅ Filtrar por estado (todas/pendientes/completadas)

## 🔧 Configuración Google OAuth (Opcional)

Para usar autenticación real con Google:

### 1. Google Cloud Console
1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo
3. Habilita estas APIs:
   - **People API**
   - **Google+ API** (legacy pero necesaria)

### 2. Configurar OAuth
1. "APIs y servicios" → "Pantalla de consentimiento OAuth"
2. Configurar información básica de la app
3. Agregar tu email como "Usuario de prueba"

### 3. Crear Credenciales
1. "APIs y servicios" → "Credenciales"
2. "Crear credenciales" → "ID de cliente OAuth 2.0"
3. Tipo: "Aplicación web"
4. URIs autorizados:
   - JavaScript: `http://localhost:3000`
   - Redirección: `http://localhost:3000/api/auth/google/callback`

### 4. Actualizar .env
```env
GOOGLE_CLIENT_ID=tu_client_id_real.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu_client_secret_real
```

## 🧪 Modo Demo (Sin Configuración)

Si no quieres configurar Google Cloud:

1. Usa el botón **"Demo Mode"** 
2. Se crea automáticamente un usuario temporal
3. Prueba todas las funcionalidades inmediatamente

## 🔍 Troubleshooting

### Error 403 OAuth
1. Agregar tu email como "Usuario de prueba" en Google Cloud Console
2. Esperar 5-10 minutos para propagación
3. Usar "Demo Mode" como alternativa inmediata

### Error "Failed to fetch user profile"
1. Habilitar **People API** en Google Cloud Console
2. Verificar credenciales en `.env`
3. Reiniciar servidor después de cambios

### Base de datos
Asegúrate de que MongoDB esté corriendo:
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb/brew/mongodb-community
```

## 🎉 ¡Listo para usar!

Tu aplicación TodoApp está completa con:
- ✅ Autenticación múltiple funcionando
- ✅ Interfaz moderna y responsive
- ✅ CRUD completo de tareas
- ✅ Saludo personalizado con nombre real
- ✅ Filtros y contadores automáticos

¡Disfruta administrando tus tareas! 🚀
