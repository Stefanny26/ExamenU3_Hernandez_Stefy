const jwt = require('jsonwebtoken');
const UserRepository = require('../../infrastructure/repositories/user.repository');

class LoginUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(loginData) {
    try {
      const { email, password } = loginData;

      // Buscar usuario por email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      // Generar JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LoginUserUseCase;