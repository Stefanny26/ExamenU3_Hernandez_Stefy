# API RESTful para Gestión de Tareas (To-Do)

Una API RESTful completa para gestionar tareas implementada con arquitectura limpia, usando Node.js, Express, MongoDB y JWT.

## 🚀 Características

- **Arquitectura Limpia**: Separación clara de responsabilidades en capas
- **Autenticación JWT**: Sistema de autenticación seguro
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar tareas
- **Seguridad**: Contraseñas hasheadas y autorización por usuario
- **Validaciones**: Validación robusta de datos de entrada
- **Paginación**: Soporte para paginación en la obtención de tareas

## 🏗️ Arquitectura

```
/src
├── /api
│   ├── /controllers     # Controladores (manejo de req/res)
│   ├── /routes         # Definición de rutas
│   └── /validators     # Validadores de entrada
├── /domain
│   ├── /models         # Modelos de Mongoose
│   └── /use-cases      # Casos de uso (lógica de negocio)
├── /infrastructure
│   ├── /middlewares    # Middlewares de Express
│   └── /repositories   # Acceso a datos
├── /config             # Configuración
└── app.js              # Aplicación principal
```

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd todo-api-clean-architecture
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📡 Endpoints

### Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

#### Inicio de Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

### Tareas (Requieren autenticación)

#### Crear Tarea
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Completar proyecto",
  "description": "Finalizar la API de tareas"
}
```

#### Obtener Tareas
```http
GET /api/tasks?page=1&limit=10&completed=false
Authorization: Bearer <token>
```

#### Actualizar Tarea
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "completed": true
}
```

#### Eliminar Tarea
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Después del login exitoso, incluye el token en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

## 📊 Modelos de Datos

### Usuario
```javascript
{
  name: String,          // Nombre del usuario
  email: String,         // Email único
  password: String,      // Contraseña hasheada
  createdAt: Date,       // Fecha de creación
  updatedAt: Date        // Fecha de actualización
}
```

### Tarea
```javascript
{
  title: String,         // Título de la tarea
  description: String,   // Descripción opcional
  completed: Boolean,    // Estado de completitud
  user: ObjectId,        // Referencia al usuario
  createdAt: Date,       // Fecha de creación
  updatedAt: Date        // Fecha de actualización
}
```

## 🧪 Validaciones

### Registro de Usuario
- **name**: Requerido, 2-50 caracteres
- **email**: Formato de email válido
- **password**: Mínimo 6 caracteres, debe contener mayúscula, minúscula y número

### Tareas
- **title**: Requerido, 1-100 caracteres
- **description**: Opcional, máximo 500 caracteres
- **completed**: Booleano

## 📝 Respuestas de la API

### Formato de Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { /* datos relevantes */ },
  "pagination": { /* info de paginación si aplica */ }
}
```

### Formato de Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [ /* detalles de errores de validación */ ]
}
```

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con nodemon
npm test           # Ejecutar pruebas (configurar Jest)
```

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt
- Validación de entrada con express-validator
- Autenticación JWT
- Separación de datos por usuario
- Manejo seguro de errores

## 📋 Características Adicionales

- **Paginación**: Soporte para paginar resultados
- **Filtros**: Filtrar tareas por estado de completitud
- **Logging**: Registro de requests
- **Health Check**: Endpoint `/health` para monitoreo
- **CORS**: Configurado para desarrollo

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🔍 Ejemplos de Uso

### Flujo Completo de Autenticación y Uso

1. **Registrar usuario**
2. **Iniciar sesión** y obtener token
3. **Crear tareas** usando el token
4. **Obtener tareas** del usuario
5. **Actualizar/eliminar** tareas según sea necesario

### Ejemplo con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"juan@test.com","password":"Test123"}'

# Iniciar sesión
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"Test123"}'

# Crear tarea (usando token obtenido)
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primera tarea","description":"Descripción de prueba"}'
```