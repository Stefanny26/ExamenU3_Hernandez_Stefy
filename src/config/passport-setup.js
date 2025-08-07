const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserRepository = require('../infrastructure/repositories/user.repository');

const userRepository = new UserRepository();

// Verificar que las variables de entorno estén configuradas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Credenciales de Google OAuth no configuradas completamente.');
  console.warn('   Para obtener credenciales reales:');
  console.warn('   1. Ve a https://console.cloud.google.com/');
  console.warn('   2. Crea un proyecto');
  console.warn('   3. Configura OAuth consent screen');
  console.warn('   4. Crea credenciales OAuth 2.0');
  console.warn('   5. Agrega http://localhost:3000/api/auth/google/callback como URI de redirección');
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email'],
  passReqToCallback: false
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔐 Recibido perfil de Google OAuth:');
    console.log('- Profile ID:', profile.id);
    console.log('- Display Name:', profile.displayName);
    console.log('- Emails:', profile.emails);
    console.log('- Photos:', profile.photos);
    console.log('- Provider:', profile.provider);

    // Validar que tenemos los datos mínimos necesarios
    if (!profile.id) {
      console.error('❌ Error: Google no proporcionó un ID de usuario');
      return done(new Error('Google no proporcionó un ID de usuario'), false);
    }

    if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
      console.error('❌ Error: Google no proporcionó un email válido');
      return done(new Error('Google no proporcionó un email válido'), false);
    }

    const email = profile.emails[0].value;
    const googleId = profile.id;
    const name = profile.displayName || profile.name?.givenName || 'Usuario Google';
    const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

    console.log('✅ Datos procesados:', { googleId, email, name, avatar });

    // 1. PASO: Verificar si el usuario ya existe por Google ID
    let user = await userRepository.findByGoogleId(googleId);
    
    if (user) {
      console.log('✅ Usuario existente encontrado por Google ID:', user.email);
      // Actualizar avatar si es diferente
      if (user.avatar !== avatar) {
        user.avatar = avatar;
        await user.save();
      }
      return done(null, user);
    }

    // 2. PASO: Verificar si existe un usuario con el mismo email (vinculación de cuenta)
    user = await userRepository.findByEmail(email);
    
    if (user) {
      console.log('🔗 Vinculando cuenta existente con Google OAuth:', user.email);
      // Usuario existe con este email pero sin OAuth, vincular cuenta
      user.googleId = googleId;
      user.avatar = avatar || user.avatar;
      user.provider = 'google';
      user = await user.save();
      return done(null, user);
    }

    // 3. PASO: Crear nuevo usuario desde Google OAuth
    console.log('🆕 Creando nuevo usuario desde Google OAuth');
    const newUserData = {
      googleId: googleId,
      email: email,
      name: name,
      avatar: avatar,
      provider: 'google'
      // No se requiere password para usuarios OAuth
    };

    user = await userRepository.create(newUserData);
    
    console.log('✅ Nuevo usuario OAuth creado exitosamente:', {
      id: user._id,
      name: user.name,
      email: user.email,
      provider: user.provider
    });

    return done(null, user);
    
  } catch (error) {
    console.error('❌ Error en estrategia de Google OAuth:', error);
    return done(error, false);
  }
}));

// Serialización para la sesión (aunque usemos JWT principalmente)
passport.serializeUser((user, done) => {
  console.log('📝 Serializando usuario:', user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('📖 Deserializando usuario:', id);
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    console.error('❌ Error al deserializar usuario:', error);
    done(error, false);
  }
});

module.exports = passport;