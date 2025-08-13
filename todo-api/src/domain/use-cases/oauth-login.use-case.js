const jwt = require('jsonwebtoken');
const UserRepository = require('../../infrastructure/repositories/user.repository');

class OAuthLoginUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(oauthUserData) {
    try {
      if (!oauthUserData) {
        throw new Error('Datos de usuario OAuth no proporcionados');
      }

      let user;

      // Si el usuario ya existe (viene de Passport), usarlo directamente
      if (oauthUserData._id) {
        user = oauthUserData;
      } else {
        // Si no, buscar o crear el usuario usando el repositorio
        user = await this.userRepository.findOrCreateFromOAuth(oauthUserData);
      }

      // Generar JWT con la información del usuario
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          name: user.name,
          provider: user.provider || 'google'
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
          provider: user.provider || 'google',
          avatar: user.avatar
        },
        token,
        message: 'Autenticación OAuth exitosa'
      };
    } catch (error) {
      console.error('Error en OAuthLoginUseCase:', error);
      throw new Error(`Error en autenticación OAuth: ${error.message}`);
    }
  }
}

module.exports = OAuthLoginUseCase;