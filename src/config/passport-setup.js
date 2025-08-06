const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserRepository = require('../infrastructure/repositories/user.repository');

const userRepository = new UserRepository();

// Verificar que las variables de entorno estén configuradas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Credenciales de Google OAuth no configuradas. El OAuth no funcionará.');
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔐 Procesando perfil de Google OAuth:', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value,
      photo: profile.photos?.[0]?.value
    });

    // Validar que tenemos los datos mínimos necesarios
    if (!profile.id || !profile.emails?.[0]?.value) {
      throw new Error('Perfil de Google incompleto: faltan ID o email');
    }

    // Preparar datos del usuario para OAuth
    const oauthData = {
      googleId: profile.id,
      name: profile.displayName || 'Usuario Google',
      email: profile.emails[0].value,
      avatar: profile.photos?.[0]?.value || null,
      provider: 'google'
    };

    // Buscar o crear usuario
    const user = await userRepository.findOrCreateFromOAuth(oauthData);
    
    console.log('✅ Usuario OAuth procesado exitosamente:', {
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