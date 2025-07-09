const jwt = require('jsonwebtoken');

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
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
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return {
        success: true,
        user,
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RegisterUserUseCase;