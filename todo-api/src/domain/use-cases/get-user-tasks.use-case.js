class GetUserTasksUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(userId, options = {}) {
    try {
      const { page, limit, completed } = options;
      
      const result = await this.taskRepository.findByUser(userId, {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        completed: completed !== undefined ? completed === 'true' : undefined
      });

      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GetUserTasksUseCase;