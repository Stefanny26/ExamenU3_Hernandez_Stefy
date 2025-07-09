class CreateTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskData, userId) {
    try {
      const { title, description } = taskData;

      // Validar datos requeridos
      if (!title || title.trim() === '') {
        throw new Error('El título es requerido');
      }

      const task = await this.taskRepository.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        user: userId
      });

      return {
        success: true,
        task
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CreateTaskUseCase;