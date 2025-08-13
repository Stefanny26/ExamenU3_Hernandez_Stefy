const mongoose = require('mongoose');

const connectDB = async (app) => {
  try {
    // URI de MongoDB con fallback para desarrollo local
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-api';
    
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI no definida, usando base de datos local');
    }
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ Conectado a MongoDB exitosamente: ${conn.connection.host}`);
    
    // Marcar conexión exitosa para health check
    if (app) {
      app.locals.dbConnected = true;
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    console.error('💡 Verifica que MONGODB_URI esté configurada correctamente');
    
    // En desarrollo, continuar sin BD para mostrar error
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Continuando en modo desarrollo sin BD...');
      return;
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;