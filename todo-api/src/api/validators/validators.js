const { body, param } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 100 })
    .withMessage('El título debe tener entre 1 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres')
];

const updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .isLength({ min: 1, max: 100 })
    .withMessage('El título debe tener entre 1 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('El campo completed debe ser un valor booleano')
];

const deleteTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de tarea inválido')
];

module.exports = {
  registerValidation,
  loginValidation,
  createTaskValidation,
  updateTaskValidation,
  deleteTaskValidation
};