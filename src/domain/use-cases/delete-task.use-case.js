class DeleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId, userId) {
    try {
      const deletedTask = await this.taskRepository.delete(taskId, userId);
      
      if (!deletedTask) {
        throw new Error('Tarea no encontrada');
      }

      return {
        success: true,
        message: 'Tarea eliminada exitosamente',
        task: deletedTask
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DeleteTaskUseCase;