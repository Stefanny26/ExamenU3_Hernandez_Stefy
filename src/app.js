require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const connectDB = require('./config/database');
const socketServer = require('./socket/socket.server');

// Importar rutas
const authRoutes = require('./api/routes/auth.routes');
const taskRoutes = require('./api/routes/task.routes');
const questionRoutes = require('./api/routes/question.routes');

// Crear aplicación Express
const app = express();

// Crear servidor HTTP para Socket.IO
const server = http.createServer(app);

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

// Inicializar Socket.IO
socketServer.init(server);

// Middleware para hacer el socketServer disponible en las rutas
app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
});

// Inicializar middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/questions', questionRoutes);

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
    message: 'Bienvenido a la Cola de Preguntas para Charla con OAuth 2.0',
    version: '2.0.0',
    project: 'Cola de Preguntas para Charla',
    description: 'Sistema en tiempo real para gestionar preguntas durante charlas y presentaciones',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        googleOAuth: 'GET /api/auth/google',
        profile: 'GET /api/auth/profile'
      },
      questions: {
        create: 'POST /api/questions',
        getAll: 'GET /api/questions',
        getById: 'GET /api/questions/:id',
        update: 'PUT /api/questions/:id',
        delete: 'DELETE /api/questions/:id',
        markAnswered: 'PATCH /api/questions/:id/answered',
        vote: 'POST /api/questions/:id/vote',
        myQuestions: 'GET /api/questions/my-questions',
        stats: 'GET /api/questions/stats'
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

// Iniciar servidor con Socket.IO
server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend disponible en: http://localhost:${PORT}`);
  console.log(`🔌 API disponible en: http://localhost:${PORT}/api`);
  console.log(`⚡ Socket.IO habilitado para notificaciones en tiempo real`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 OAuth Google configurado: ${!!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}`);
});

module.exports = app;