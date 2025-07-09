const Task = require('../../domain/models/task.model');

class TaskRepository {
  async create(taskData) {
    try {
      const task = new Task(taskData);
      return await task.save();
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId, options = {}) {
    try {
      const { page = 1, limit = 10, completed } = options;
      const skip = (page - 1) * limit;
      
      let filter = { user: userId };
      if (completed !== undefined) {
        filter.completed = completed;
      }

      const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Task.countDocuments(filter);

      return {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Task.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUser(id, userId) {
    try {
      return await Task.findOne({ _id: id, user: userId });
    } catch (error) {
      throw error;
    }
  }

  async update(id, userId, updateData) {
    try {
      return await Task.findOneAndUpdate(
        { _id: id, user: userId },
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id, userId) {
    try {
      return await Task.findOneAndDelete({ _id: id, user: userId });
    } catch (error) {
      throw error;
    }
  }

  async countByUser(userId) {
    try {
      return await Task.countDocuments({ user: userId });
    } catch (error) {
      throw error;
    }
  }

  async countCompletedByUser(userId) {
    try {
      return await Task.countDocuments({ user: userId, completed: true });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskRepository;