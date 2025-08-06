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

// Rutas de OAuth con Google (siguiendo el estándar de la tarea)
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // Los datos que solicitamos a Google
}));

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login-error`
  }),
  async (req, res) => {
    try {
      // ¡Autenticación exitosa! `req.user` contiene los datos del usuario.
      console.log('✅ Callback OAuth exitoso para usuario:', req.user.email);
      
      // Aquí es donde generamos nuestro propio JWT
      const result = await authController.oauthLogin.execute(req.user);
      
      console.log('🎟️ JWT generado para usuario OAuth:', {
        userId: result.user.id,
        email: result.user.email,
        provider: result.user.provider
      });
      
      // Redirige al frontend con el token
      // Una estrategia común es pasarlo como un query parameter
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${result.token}&oauth=success`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Error en callback OAuth:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const errorUrl = `${frontendUrl}/login-error?error=oauth_callback_failed&message=${encodeURIComponent(error.message)}`;
      res.redirect(errorUrl);
    }
  }
);

// Ruta protegida para obtener perfil del usuario
router.get('/profile', authMiddleware, (req, res) => {
  authController.getProfile(req, res);
});

// 🧪 RUTA DE PRUEBA: Simular OAuth de Google (solo para demostración)
router.get('/google/demo', async (req, res) => {
  try {
    console.log('🧪 Iniciando demostración de OAuth Google...');
    
    // Simular datos de usuario de Google como los recibiría Passport
    const mockOAuthData = {
      googleId: `demo_${Date.now()}`,
      email: 'demo.oauth@gmail.com',
      name: 'Usuario Demo OAuth',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      provider: 'google'
    };

    // Usar el caso de uso real de OAuth
    const result = await authController.oauthLogin.execute(mockOAuthData);
    
    console.log('✅ Demo OAuth exitoso:', result.user);
    
    // Redirigir al frontend con el token (como haría Google)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}?token=${result.token}&oauth_demo=true`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Error en demo OAuth:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const errorUrl = `${frontendUrl}?error=oauth_demo_failed&message=${encodeURIComponent(error.message)}`;
    res.redirect(errorUrl);
  }
});

// 📊 RUTA DE ESTADO: Verificar configuración OAuth
router.get('/oauth/status', (req, res) => {
  const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  
  res.json({
    success: true,
    oauth: {
      google: {
        configured: googleConfigured,
        clientId: googleConfigured ? 
          process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 
          'No configurado',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'No configurado'
      }
    },
    endpoints: {
      login: '/api/auth/google',
      callback: '/api/auth/google/callback',
      demo: '/api/auth/google/demo'
    }
  });
});

module.exports = router;
