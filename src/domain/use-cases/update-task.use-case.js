class UpdateTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId, userId, updateData) {
    try {
      const { title, description, completed } = updateData;

      // Verificar que la tarea existe y pertenece al usuario
      const existingTask = await this.taskRepository.findByIdAndUser(taskId, userId);
      if (!existingTask) {
        throw new Error('Tarea no encontrada');
      }

      // Preparar datos de actualización
      const updates = {};
      if (title !== undefined) {
        if (!title || title.trim() === '') {
          throw new Error('El título es requerido');
        }
        updates.title = title.trim();
      }
      if (description !== undefined) {
        updates.description = description ? description.trim() : '';
      }
      if (completed !== undefined) {
        updates.completed = completed;
      }

      const updatedTask = await this.taskRepository.update(taskId, userId, updates);

      return {
        success: true,
        task: updatedTask
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UpdateTaskUseCase;