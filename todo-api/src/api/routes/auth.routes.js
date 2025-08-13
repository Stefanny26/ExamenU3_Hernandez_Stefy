const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../../infrastructure/middlewares/auth.middleware');
const {
  registerValidation,
  loginValidation
} = require('../validators/validators');
const { validationResult } = require('express-validator');

// URLs de Google OAuth
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

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

// ===== AUTENTICACIÓN TRADICIONAL =====
router.post('/register', registerValidation, validate, authController.register.bind(authController));
router.post('/login', loginValidation, validate, authController.login.bind(authController));

// ===== OAUTH MANUAL (SIN PASSPORT) =====

// 1. Iniciar OAuth - Redirigir a Google
router.get('/google', (req, res) => {
  try {
    console.log('🚀 Iniciando OAuth con Google...');
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?oauth=error&message=Google+OAuth+no+configurado`);
    }

    const scopes = [
      'openid',
      'profile',
      'email'
    ];

    const query = querystring.stringify({
      response_type: 'code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      scope: scopes.join(' '),
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      state: 'oauth_state_' + Date.now(), // Para seguridad
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `${GOOGLE_AUTH_URL}?${query}`;
    console.log('🔗 Redirigiendo a:', authUrl);
    
    res.redirect(authUrl);
  } catch (error) {
    console.error('❌ Error iniciando OAuth:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?oauth=error&message=Error+iniciando+OAuth`);
  }
});

// 2. Callback OAuth - Procesar respuesta de Google
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error, error_description } = req.query;
    
    if (error) {
      console.error('❌ Error OAuth desde Google:', error, error_description);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?oauth=error&message=${encodeURIComponent(error_description || error)}`);
    }

    if (!code) {
      console.error('❌ No se recibió código de autorización');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?oauth=error&message=No+se+recibio+codigo+de+autorizacion`);
    }

    console.log('✅ Código OAuth recibido, intercambiando por token...');

    // Intercambiar código por token
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('❌ Error obteniendo token:', tokenData);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?oauth=error&message=Error+obteniendo+token`);
    }

    console.log('✅ Token obtenido, obteniendo perfil de usuario...');

    // Obtener información del usuario
    const userResponse = await fetch(`${GOOGLE_USER_INFO_URL}?access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('❌ Error obteniendo perfil:', userData);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?oauth=error&message=Error+obteniendo+perfil`);
    }

    console.log('✅ Perfil obtenido:', {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    });

    // Crear/actualizar usuario usando el caso de uso OAuth
    const oauthUserData = {
      googleId: userData.id,
      email: userData.email,
      name: userData.name,
      avatar: userData.picture,
      provider: 'google'
    };

    const result = await authController.oauthLogin.execute(oauthUserData);
    
    console.log('✅ Usuario OAuth procesado exitosamente');

    // Redirigir al frontend con el token JWT
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/?token=${result.token}&oauth=success`;
    
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Error en callback OAuth:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?oauth=error&message=${encodeURIComponent(error.message)}`);
  }
});

// ===== DEMO OAUTH =====
router.get('/google/demo', async (req, res) => {
  try {
    console.log('🧪 Iniciando demostración de OAuth Google...');
    
    // Simular datos de usuario de Google
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
    
    // Redirigir al frontend con el token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/?token=${result.token}&oauth=demo`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Error en demo OAuth:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const errorUrl = `${frontendUrl}/?oauth=error&message=${encodeURIComponent(error.message)}`;
    res.redirect(errorUrl);
  }
});

// ===== RUTAS AUXILIARES =====

// Ruta protegida para obtener perfil del usuario
router.get('/profile', authMiddleware, (req, res) => {
  authController.getProfile(req, res);
});

// Ruta de estado OAuth
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
