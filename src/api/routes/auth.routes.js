const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../../infrastructure/middlewares/auth.middleware');
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

// Rutas de autenticación tradicional
router.post('/register', registerValidation, validate, authController.register.bind(authController));
router.post('/login', loginValidation, validate, authController.login.bind(authController));

// Rutas de OAuth con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` 
  }),
  (req, res) => {
    authController.googleCallback(req, res);
  }
);

// Ruta protegida para obtener perfil del usuario
router.get('/profile', authMiddleware, (req, res) => {
  authController.getProfile(req, res);
});

// Ruta de prueba para simular OAuth de Google (solo para demostración)
router.get('/google/demo', async (req, res) => {
  try {
    // Simular datos de usuario de Google
    const mockUser = {
      googleId: 'demo123456789',
      email: 'demo@gmail.com',
      name: 'Usuario Demo Google',
      avatar: 'https://via.placeholder.com/150',
      provider: 'google'
    };

    const result = await authController.oauthLogin.execute(mockUser);
    
    // Redirigir al frontend con el token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${result.token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`;
    res.redirect(errorUrl);
  }
});

module.exports = router;
