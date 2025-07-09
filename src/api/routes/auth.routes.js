const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const {
  registerValidation,
  loginValidation
} = require('../validators/validators');
const { validationResult } = require('express-validator');

// Middleware para validar los resultados
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Crear instancia del controlador
const authController = new AuthController();

// Rutas con métodos ligados a la instancia
router.post('/register', registerValidation, validate, authController.register.bind(authController));
router.post('/login', loginValidation, validate, authController.login.bind(authController));

module.exports = router;
