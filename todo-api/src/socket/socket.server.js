const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const UserRepository = require('../infrastructure/repositories/user.repository');

class SocketServer {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> { socketId, user }
    this.userRepository = new UserRepository();
  }

  init(server) {
    // Configurar Socket.IO server
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Middleware de autenticación para sockets
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          throw new Error('No token provided');
        }

        // Verificar JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Obtener datos completos del usuario
        const user = await this.userRepository.findById(decoded.id);
        if (!user) {
          throw new Error('User not found');
        }

        // Agregar usuario al socket
        socket.userId = user._id.toString();
        socket.user = user;
        
        console.log('🔌 Usuario autenticado en socket:', user.name, user.email);
        next();
      } catch (error) {
        console.error('❌ Error en autenticación de socket:', error.message);
        next(new Error('Authentication failed'));
      }
    });

    // Configurar eventos de conexión
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });

    console.log('🚀 Socket.IO server iniciado');
    return this.io;
  }

  handleConnection(socket) {
    const user = socket.user;
    const userId = socket.userId;

    console.log(`✅ Usuario conectado: ${user.name} (${user.email})`);

    // Agregar usuario a la lista de conectados
    this.connectedUsers.set(userId, {
      socketId: socket.id,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

    // Notificar a otros usuarios que alguien se conectó
    socket.broadcast.emit('user_connected', {
      type: 'user_connected',
      user: user.name,
      message: `${user.name} se conectó`,
      timestamp: new Date().toISOString()
    });

    // Enviar lista de usuarios conectados al recién conectado
    socket.emit('connected_users', {
      users: Array.from(this.connectedUsers.values()).map(conn => conn.user),
      count: this.connectedUsers.size
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      this.handleDisconnection(socket);
    });

    // Manejar eventos personalizados
    this.setupCustomEvents(socket);
  }

  handleDisconnection(socket) {
    const user = socket.user;
    const userId = socket.userId;

    console.log(`❌ Usuario desconectado: ${user.name} (${user.email})`);

    // Remover usuario de la lista de conectados
    this.connectedUsers.delete(userId);

    // Notificar a otros usuarios que alguien se desconectó
    socket.broadcast.emit('user_disconnected', {
      type: 'user_disconnected',
      user: user.name,
      message: `${user.name} se desconectó`,
      timestamp: new Date().toISOString()
    });
  }

  setupCustomEvents(socket) {
    // Evento para cuando un usuario está escribiendo (opcional)
    socket.on('user_typing', (data) => {
      socket.broadcast.emit('user_typing', {
        user: socket.user.name,
        ...data
      });
    });

    // Evento para ping/pong de conexión
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    // ===== EVENTOS ESPECÍFICOS PARA COLA DE PREGUNTAS =====
    
    // Usuario está escribiendo una pregunta
    socket.on('question:typing', (data) => {
      socket.broadcast.emit('question:typing', {
        user: socket.user.name,
        userId: socket.userId,
        isTyping: data.isTyping,
        timestamp: new Date().toISOString()
      });
    });

    // Solicitud manual de actualización de preguntas
    socket.on('questions:refresh', () => {
      socket.emit('questions:refresh_requested', {
        timestamp: new Date().toISOString()
      });
    });
  }

  // Métodos para emitir eventos desde controladores
  emitTaskCreated(task, user) {
    if (!this.io) return;
    
    this.io.emit('task_created', {
      type: 'task_created',
      user: user.name,
      message: `${user.name} creó una nueva tarea: "${task.title}"`,
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        completed: task.completed
      },
      timestamp: new Date().toISOString()
    });

    console.log(`📝 Notificación enviada: ${user.name} creó tarea "${task.title}"`);
  }

  emitTaskUpdated(task, user) {
    if (!this.io) return;

    const action = task.completed ? 'completó' : 'actualizó';
    
    this.io.emit('task_updated', {
      type: 'task_updated',
      user: user.name,
      message: `${user.name} ${action} la tarea: "${task.title}"`,
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        completed: task.completed
      },
      timestamp: new Date().toISOString()
    });

    console.log(`✏️ Notificación enviada: ${user.name} ${action} tarea "${task.title}"`);
  }

  emitTaskDeleted(taskTitle, user) {
    if (!this.io) return;
    
    this.io.emit('task_deleted', {
      type: 'task_deleted',
      user: user.name,
      message: `${user.name} eliminó la tarea: "${taskTitle}"`,
      taskTitle,
      timestamp: new Date().toISOString()
    });

    console.log(`🗑️ Notificación enviada: ${user.name} eliminó tarea "${taskTitle}"`);
  }

  // ===== MÉTODOS PARA EVENTOS DE PREGUNTAS =====

  emitQuestionCreated(question, user) {
    if (!this.io) return;
    
    this.io.emit('question_created', {
      type: 'question_created',
      user: user.name,
      message: `${user.name} agregó una nueva pregunta`,
      question: {
        id: question._id,
        content: question.content,
        authorName: question.authorName,
        answered: question.answered,
        votes: question.votes,
        priority: question.priority,
        createdAt: question.createdAt
      },
      timestamp: new Date().toISOString()
    });

    console.log(`❓ Notificación enviada: ${user.name} creó pregunta`);
  }

  emitQuestionUpdated(question, user) {
    if (!this.io) return;
    
    this.io.emit('question_updated', {
      type: 'question_updated',
      user: user.name,
      message: `${user.name} actualizó una pregunta`,
      question: {
        id: question._id,
        content: question.content,
        authorName: question.authorName,
        answered: question.answered,
        votes: question.votes,
        priority: question.priority,
        updatedAt: question.updatedAt
      },
      timestamp: new Date().toISOString()
    });

    console.log(`✏️ Notificación enviada: ${user.name} actualizó pregunta`);
  }

  emitQuestionAnswered(question, user) {
    if (!this.io) return;
    
    this.io.emit('question_answered', {
      type: 'question_answered',
      user: user.name,
      message: `Se respondió la pregunta de ${question.authorName}`,
      question: {
        id: question._id,
        content: question.content,
        authorName: question.authorName,
        answered: question.answered,
        answeredAt: question.answeredAt,
        votes: question.votes
      },
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Notificación enviada: Se respondió pregunta de ${question.authorName}`);
  }

  emitQuestionVoted(question, user, hasVoted) {
    if (!this.io) return;
    
    const action = hasVoted ? 'votó por' : 'removió su voto de';
    
    this.io.emit('question_voted', {
      type: 'question_voted',
      user: user.name,
      message: `${user.name} ${action} la pregunta de ${question.authorName}`,
      question: {
        id: question._id,
        content: question.content,
        authorName: question.authorName,
        votes: question.votes,
        hasVoted: hasVoted
      },
      timestamp: new Date().toISOString()
    });

    console.log(`👍 Notificación enviada: ${user.name} ${action} pregunta`);
  }

  emitQuestionDeleted(questionContent, user, questionId) {
    if (!this.io) return;
    
    this.io.emit('question_deleted', {
      type: 'question_deleted',
      user: user.name,
      message: `${user.name} eliminó una pregunta`,
      questionId: questionId,
      questionContent: questionContent.substring(0, 50) + (questionContent.length > 50 ? '...' : ''),
      timestamp: new Date().toISOString()
    });

    console.log(`🗑️ Notificación enviada: ${user.name} eliminó pregunta`);
  }

  // Obtener estadísticas de conexiones
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      users: Array.from(this.connectedUsers.values()).map(conn => conn.user)
    };
  }
}

// Exportar singleton
const socketServer = new SocketServer();
module.exports = socketServer;
