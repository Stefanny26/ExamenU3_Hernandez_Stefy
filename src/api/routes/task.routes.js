const express = require('express');
const TaskController = require('../controllers/task.controller');
const authMiddleware = require('../../infrastructure/middlewares/auth.middleware');
const { 
  createTaskValidation, 
  updateTaskValidation, 
  deleteTaskValidation 
} = require('../validators/validators');
const { validationResult } = require('express-validator');

const router = express.Router();
const taskController = new TaskController();

// Middleware para validar resultados de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// POST /api/tasks - Crear nueva tarea
router.post('/', createTaskValidation, validate, (req, res) => {
  taskController.createTask(req, res);
});

// GET /api/tasks - Obtener tareas del usuario
router.get('/', (req, res) => {
  taskController.getUserTasks(req, res);
});

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', updateTaskValidation, validate, (req, res) => {
  taskController.updateTask(req, res);
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', deleteTaskValidation, validate, (req, res) => {
  taskController.deleteTask(req, res);
});

// GET /api/tasks/realtime/stats - Obtener estadísticas de Socket.IO
router.get('/realtime/stats', (req, res) => {
  try {
    const stats = req.socketServer ? req.socketServer.getStats() : {
      connectedUsers: 0,
      users: []
    };
    
    res.json({
      success: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas en tiempo real'
    });
  }
});

module.exports = router;
