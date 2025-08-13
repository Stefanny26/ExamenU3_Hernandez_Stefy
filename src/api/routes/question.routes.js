const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/question.controller');
const authMiddleware = require('../../infrastructure/middlewares/auth.middleware');
const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');

// Middleware para validar los resultados
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array(),
      message: 'Errores de validación'
    });
  }
  next();
};

// Validaciones
const createQuestionValidation = [
  body('content')
    .notEmpty()
    .withMessage('El contenido de la pregunta es requerido')
    .isLength({ min: 5, max: 500 })
    .withMessage('La pregunta debe tener entre 5 y 500 caracteres')
    .trim(),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('La prioridad debe ser un número entre 0 y 5')
];

const updateQuestionValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de pregunta inválido'),
  body('content')
    .optional()
    .isLength({ min: 5, max: 500 })
    .withMessage('La pregunta debe tener entre 5 y 500 caracteres')
    .trim(),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('La prioridad debe ser un número entre 0 y 5')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de pregunta inválido')
];

const queryValidation = [
  query('answered')
    .optional()
    .isBoolean()
    .withMessage('El parámetro answered debe ser true o false'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El skip debe ser un número mayor o igual a 0')
];

// Crear instancia del controlador
const questionController = new QuestionController();

// ===== RUTAS PÚBLICAS (requieren autenticación) =====

// Obtener todas las preguntas (con filtros opcionales)
router.get('/', 
  authMiddleware, 
  queryValidation, 
  validate, 
  questionController.getQuestions.bind(questionController)
);

// Obtener estadísticas de preguntas
router.get('/stats', 
  authMiddleware, 
  questionController.getStats.bind(questionController)
);

// Obtener mis preguntas
router.get('/my-questions', 
  authMiddleware, 
  questionController.getMyQuestions.bind(questionController)
);

// Obtener pregunta específica por ID
router.get('/:id', 
  authMiddleware, 
  idValidation, 
  validate, 
  questionController.getQuestionById.bind(questionController)
);

// Crear nueva pregunta
router.post('/', 
  authMiddleware, 
  createQuestionValidation, 
  validate, 
  questionController.createQuestion.bind(questionController)
);

// Actualizar pregunta (solo el autor)
router.put('/:id', 
  authMiddleware, 
  updateQuestionValidation, 
  validate, 
  questionController.updateQuestion.bind(questionController)
);

// Marcar pregunta como respondida
router.patch('/:id/answered', 
  authMiddleware, 
  idValidation, 
  validate, 
  questionController.markAsAnswered.bind(questionController)
);

// Votar/desvotar pregunta
router.post('/:id/vote', 
  authMiddleware, 
  idValidation, 
  validate, 
  questionController.voteQuestion.bind(questionController)
);

// Eliminar pregunta (solo el autor)
router.delete('/:id', 
  authMiddleware, 
  idValidation, 
  validate, 
  questionController.deleteQuestion.bind(questionController)
);

module.exports = router;
