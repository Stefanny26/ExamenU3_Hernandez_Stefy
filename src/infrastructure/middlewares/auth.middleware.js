const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');

const userRepository = new UserRepository();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('🔐 Auth middleware - Header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Auth middleware - Token inválido o ausente');
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Auth middleware - Token longitud:', token.length);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Auth middleware - Token decodificado, userId:', decoded.id);
    
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      console.log('❌ Auth middleware - Usuario no encontrado:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Token inválido - usuario no encontrado'
      });
    }

    console.log('✅ Auth middleware - Usuario autenticado:', user.name);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.error('❌ JWT Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.error('❌ JWT Expired:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('❌ Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = authMiddleware;
