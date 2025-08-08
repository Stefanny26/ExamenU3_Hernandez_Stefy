# 🚀 TODO API - Instalación y Configuración

## 📋 Descripción del Proyecto

API RESTful para gestión de tareas con:
- ✅ **Arquitectura Limpia**
- 🔐 **Autenticación JWT**
- 🌐 **OAuth 2.0 con Google**
- ⚡ **Notificaciones en tiempo real (Socket.IO)**
- 📱 **Frontend integrado**

## 🛠️ Requisitos Previos

### Software Necesario:
- **Node.js** v16 o superior ([Descargar aquí](https://nodejs.org/))
- **MongoDB** ([Instalar MongoDB](https://www.mongodb.com/try/download/community))
- **Git** ([Descargar Git](https://git-scm.com/))

### Verificar Instalación:
```bash
node --version  # Debe mostrar v16+ 
npm --version   # Debe mostrar 8+
mongod --version # Debe mostrar MongoDB
git --version   # Debe mostrar Git
```

## 📦 Instalación

### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd todo-api
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```bash
nano .env  # o usa tu editor preferido
```

### 4. Iniciar MongoDB
```bash
# En Linux/Mac:
sudo systemctl start mongod

# En Windows (si instalaste como servicio):
net start MongoDB

# O ejecuta directamente:
mongod
```

### 5. Iniciar la Aplicación
```bash
# Modo desarrollo (con nodemon):
npm run dev

# Modo producción:
npm start
```

## 🌐 Acceso a la Aplicación

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

## 🔐 Configuración OAuth (Opcional)

### Para usar Google OAuth:

1. **Crear proyecto en Google Cloud Console:**
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un nuevo proyecto
   - Habilita "Google+ API" y "People API"

2. **Configurar OAuth:**
   - Ve a "APIs y servicios" → "Credenciales"
   - Crea credenciales OAuth 2.0
   - Agrega URIs autorizados:
     - Origen: `http://localhost:3000`
     - Redirección: `http://localhost:3000/api/auth/google/callback`

3. **Actualizar .env:**
   ```bash
   GOOGLE_CLIENT_ID=tu_client_id
   GOOGLE_CLIENT_SECRET=tu_client_secret
   ```

4. **Agregar usuarios de prueba:**
   - En "Pantalla de consentimiento OAuth"
   - Sección "Usuarios de prueba"
   - Agrega emails que podrán probar la app

### Alternativa sin credenciales:
Usa el **"Demo OAuth"** en la aplicación - funciona sin configuración adicional.

## 🧪 Funcionalidades Disponibles

### 🔐 Autenticación:
- Registro con email/contraseña
- Login tradicional
- Login con Google OAuth
- Demo OAuth (sin credenciales)

### 📝 Gestión de Tareas:
- Crear tareas
- Actualizar tareas
- Marcar como completadas
- Eliminar tareas
- Filtros (todas, pendientes, completadas)

### ⚡ Tiempo Real:
- Notificaciones instantáneas
- Usuarios conectados en vivo
- Actualizaciones automáticas de UI

## 🐛 Troubleshooting

### Problema: "MongoDB connection failed"
**Solución:**
```bash
# Verificar que MongoDB esté ejecutándose:
sudo systemctl status mongod

# O iniciar MongoDB:
sudo systemctl start mongod
```

### Problema: "Port 3000 already in use"
**Solución:**
```bash
# Cambiar puerto en .env:
PORT=3001

# O terminar proceso en puerto 3000:
sudo fuser -k 3000/tcp
```

### Problema: Error 403 en Google OAuth
**Solución:**
1. Verificar URIs en Google Cloud Console
2. Agregar email como usuario de prueba
3. Usar "Demo OAuth" como alternativa

### Problema: "Module not found"
**Solución:**
```bash
# Reinstalar dependencias:
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Scripts Disponibles

```bash
npm start       # Iniciar en modo producción
npm run dev     # Iniciar en modo desarrollo (nodemon)
npm test        # Ejecutar tests (si están configurados)
```

## 📁 Estructura del Proyecto

```
todo-api/
├── src/
│   ├── api/          # Controladores y rutas
│   ├── config/       # Configuración (DB, Passport)
│   ├── domain/       # Modelos y casos de uso
│   ├── infrastructure/ # Repositorios y middlewares
│   └── socket/       # Socket.IO server
├── public/           # Frontend estático
├── docs/            # Documentación
├── .env.example     # Variables de entorno ejemplo
└── package.json     # Dependencias y scripts
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

### 🎯 Para Uso Académico/Evaluación:

Este proyecto demuestra:
- ✅ Arquitectura limpia en Node.js
- ✅ Implementación completa de JWT
- ✅ Integración OAuth 2.0 real
- ✅ WebSockets con Socket.IO
- ✅ Frontend moderno integrado
- ✅ Documentación profesional

**Tiempo estimado de configuración:** 10-15 minutos
