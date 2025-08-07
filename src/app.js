require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Importar rutas
const authRoutes = require('./api/routes/auth.routes');
const taskRoutes = require('./api/routes/task.routes');

// Crear aplicación Express
const app = express();

// Conectar a base de datos
connectDB();

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Inicializar middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    oauth: {
      google: {
        configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
      }
    }
  });
});

// Ruta API info (solo para /api)
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a la API de To-Do con Arquitectura Limpia y OAuth 2.0',
    version: '2.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        googleOAuth: 'GET /api/auth/google',
        profile: 'GET /api/auth/profile'
      },
      tasks: {
        create: 'POST /api/tasks',
        getAll: 'GET /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id'
      }
    }
  });
});

// Servir el frontend en la ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware para rutas no encontradas (solo para rutas API)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta API no encontrada'
  });
});

// Para cualquier otra ruta, servir el frontend (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Middleware global para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Frontend disponible en: http://localhost:${PORT}`);
  console.log(`API disponible en: http://localhost:${PORT}/api`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`OAuth Google configurado: ${!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}`);
});

module.exports = app;