const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserRepository = require('../infrastructure/repositories/user.repository');

const userRepository = new UserRepository();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Perfil de Google recibido:', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0]?.value,
      photo: profile.photos[0]?.value
    });

    // Preparar datos del usuario para OAuth
    const oauthData = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0]?.value,
      avatar: profile.photos[0]?.value
    };

    // Buscar o crear usuario
    const user = await userRepository.findOrCreateFromOAuth(oauthData);
    
    console.log('Usuario procesado exitosamente:', {
      id: user._id,
      name: user.name,
      email: user.email,
      provider: user.provider
    });

    return done(null, user);
  } catch (error) {
    console.error('Error en estrategia de Google OAuth:', error);
    return done(error, false);
  }
}));

// Serialización para la sesión (aunque usemos JWT principalmente)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = passport;