# ⚡ Quick Start - TODO API

> **Guía de 5 minutos para poner en marcha la aplicación**

## 🚀 Instalación Express (Linux/Mac)

```bash
# 1. Clonar repositorio
git clone <URL_REPOSITORIO>
cd todo-api

# 2. Ejecutar script automático
./setup.sh

# 3. Iniciar aplicación
npm start
```

## 🪟 Instalación Windows

```cmd
# 1. Clonar repositorio
git clone <URL_REPOSITORIO>
cd todo-api

# 2. Instalar dependencias
npm install

# 3. Crear configuración
copy .env.example .env

# 4. Iniciar aplicación
npm start
```

## 🌐 Acceso Inmediato

Después de `npm start`, ve a:
- **Aplicación:** http://localhost:3000
- **Demo completo disponible sin configuración adicional**

## 🔧 Configuración Mínima

Tu archivo `.env` ya está preconfigurado para funcionar localmente. Solo necesitas:

### MongoDB (obligatorio):
```bash
# Ubuntu/Debian:
sudo apt install mongodb

# macOS:
brew install mongodb/brew/mongodb-community

# Windows:
# Descargar desde https://www.mongodb.com/try/download/community
```

### Google OAuth (opcional):
Si quieres OAuth real (no necesario para el demo):
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea proyecto y credenciales OAuth 2.0
3. Actualiza `.env` con tus credenciales

## ✨ Funcionalidades Listas

### Sin configuración adicional:
- ✅ Registro/Login tradicional
- ✅ Demo OAuth (simula Google sin credenciales)
- ✅ Gestión completa de tareas
- ✅ Notificaciones en tiempo real (Socket.IO)
- ✅ Interfaz moderna responsive

### Con OAuth real:
- ✅ Login con Google real
- ✅ Sincronización de perfiles

## 🧪 Prueba Rápida

1. **Registro:** Crea una cuenta con email/contraseña
2. **Demo OAuth:** Prueba "Demo OAuth" sin configuración
3. **Tareas:** Crea, edita, completa tareas
4. **Tiempo Real:** Abre múltiples pestañas y ve las notificaciones

## 📁 Archivos Importantes

```
todo-api/
├── .env.example     # Configuración base (cópialo a .env)
├── setup.sh         # Script de instalación automática
├── INSTALLATION.md  # Guía completa de instalación
├── package.json     # Dependencias y scripts
└── src/            # Código fuente
```

## 🆘 Solución Rápida de Problemas

### Error: "MongoDB connection failed"
```bash
# Iniciar MongoDB:
sudo systemctl start mongod
# O usar MongoDB Atlas (cloud) en .env
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env:
PORT=3001
```

### Error: "Module not found"
```bash
# Reinstalar dependencias:
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentación Completa

- **Instalación detallada:** [INSTALLATION.md](./INSTALLATION.md)
- **Configuración OAuth:** [docs/GOOGLE-CLOUD-SETUP.md](./docs/GOOGLE-CLOUD-SETUP.md)
- **Troubleshooting:** [docs/SOLUCION-ERROR-403.md](./docs/SOLUCION-ERROR-403.md)

## 🎯 ¿Todo funcionando?

Si ves esto en http://localhost:3000 estás listo:
- ✅ Página de bienvenida OAuth
- ✅ Botones de autenticación
- ✅ Contador de usuarios conectados
- ✅ Sistema de notificaciones

**¡Tu aplicación TODO con OAuth y Socket.IO está lista!** 🎉
