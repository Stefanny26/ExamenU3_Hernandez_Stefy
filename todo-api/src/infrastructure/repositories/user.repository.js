const User = require('../../domain/models/user.model');

class UserRepository {
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findByGoogleId(googleId) {
    try {
      return await User.findOne({ googleId });
    } catch (error) {
      throw error;
    }
  }

  async findOrCreateFromOAuth(oauthData) {
    try {
      const { googleId, email, name, avatar } = oauthData;
      
      // Primero buscar por googleId
      let user = await this.findByGoogleId(googleId);
      if (user) {
        // Actualizar avatar si es diferente
        if (user.avatar !== avatar) {
          user.avatar = avatar;
          await user.save();
        }
        return user;
      }

      // Si no existe por googleId, buscar por email
      user = await this.findByEmail(email);
      if (user) {
        // Usuario existe con este email pero sin OAuth, vincular cuenta
        user.googleId = googleId;
        user.avatar = avatar;
        user.provider = 'google';
        return await user.save();
      }

      // Crear nuevo usuario
      return await this.create({
        googleId,
        email,
        name,
        avatar,
        provider: 'google'
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async exists(email) {
    try {
      const count = await User.countDocuments({ email });
      return count > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;