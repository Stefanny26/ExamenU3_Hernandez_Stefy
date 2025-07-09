const { validationResult } = require('express-validator');
const UserRepository = require('../../infrastructure/repositories/user.repository');
const RegisterUserUseCase = require('../../domain/use-cases/register-user.use-case');
const LoginUserUseCase = require('../../domain/use-cases/login-user.use-case');

class AuthController {
  constructor() {
    this.userRepository = new UserRepository();
    this.registerUserUseCase = new RegisterUserUseCase(this.userRepository);
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository);
  }

  async register(req, res) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }

      const result = await this.registerUserUseCase.execute(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Manejar errores de duplicación de MongoDB
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar usuario'
      });
    }
  }

  async login(req, res) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }

      const result = await this.loginUserUseCase.execute(req.body);
      
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      
      res.status(401).json({
        success: false,
        message: error.message || 'Error al iniciar sesión'
      });
    }
  }
}

module.exports = AuthController;