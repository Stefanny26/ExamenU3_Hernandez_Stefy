class DeleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId, userId) {
    try {
      // 1. Buscar la tarea por ID
      const task = await this.taskRepository.findById(taskId);

      if (!task) {
        throw new Error('Tarea no encontrada');
      }

      // 2. Verificar si la tarea pertenece al usuario
      if (task.user.toString() !== userId.toString()) {
        throw new Error('No tienes permiso para eliminar esta tarea');
      }

      // 3. Eliminar la tarea
      await this.taskRepository.delete(taskId);

      return {
        success: true,
        message: 'Tarea eliminada correctamente'
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DeleteTaskUseCase;
