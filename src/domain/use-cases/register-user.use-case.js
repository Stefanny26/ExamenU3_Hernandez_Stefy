const jwt = require('jsonwebtoken');
const UserRepository = require('../../infrastructure/repositories/user.repository');

class RegisterUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData) {
    try {
      const { name, email, password } = userData;

      // Validar que el email no esté registrado
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear el usuario
      const user = await this.userRepository.create({
        name,
        email,
        password
      });

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

module.exports = RegisterUserUseCase;