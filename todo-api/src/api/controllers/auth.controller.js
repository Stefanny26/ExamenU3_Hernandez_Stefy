const RegisterUser = require('../../domain/use-cases/register-user.use-case');
const LoginUser = require('../../domain/use-cases/login-user.use-case');
const OAuthLogin = require('../../domain/use-cases/oauth-login.use-case');

class AuthController {
  constructor() {
    this.registerUser = new RegisterUser();
    this.loginUser = new LoginUser();
    this.oauthLogin = new OAuthLogin();
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await this.registerUser.execute({ name, email, password });
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUser.execute({ email, password });
      
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async googleCallback(req, res) {
    try {
      const user = req.user;
      const result = await this.oauthLogin.execute(user);
      
      // Redirigir al frontend con el token
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${result.token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const errorUrl = `${process.env.FRONTEND_URL}/login?error=oauth_failed`;
      res.redirect(errorUrl);
    }
  }

  async getProfile(req, res) {
    try {
      console.log('👤 Solicitud de perfil para usuario:', req.user.name);
      res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController;