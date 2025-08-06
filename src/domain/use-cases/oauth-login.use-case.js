const jwt = require('jsonwebtoken');

class OAuthLoginUseCase {
  constructor() {
    // No necesita repositorio ya que el usuario ya está procesado por Passport
  }

  async execute(user) {
    try {
      if (!user) {
        throw new Error('Usuario no proporcionado para autenticación OAuth');
      }

      // Generar JWT con la información del usuario
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          name: user.name,
          provider: user.provider 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          provider: user.provider
        },
        token
      };
    } catch (error) {
      console.error('Error en OAuthLoginUseCase:', error);
      throw error;
    }
  }
}

module.exports = OAuthLoginUseCase;