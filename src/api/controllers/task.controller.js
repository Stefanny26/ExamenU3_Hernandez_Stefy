const { validationResult } = require('express-validator');
const TaskRepository = require('../../infrastructure/repositories/task.repository');
const CreateTaskUseCase = require('../../domain/use-cases/create-task.use-case');
const GetUserTasksUseCase = require('../../domain/use-cases/get-user-tasks.use-case');
const UpdateTaskUseCase = require('../../domain/use-cases/update-task.use-case');
const DeleteTaskUseCase = require('../../domain/use-cases/delete-task.use-case');

class TaskController {
  constructor() {
    this.taskRepository = new TaskRepository();
    this.createTaskUseCase = new CreateTaskUseCase(this.taskRepository);
    this.getUserTasksUseCase = new GetUserTasksUseCase(this.taskRepository);
    this.updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository);
    this.deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository);
  }

  async createTask(req, res) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }

      const result = await this.createTaskUseCase.execute(req.body, req.user._id);
      
      res.status(201).json({
        success: true,
        message: 'Tarea creada exitosamente',
        data: result.task
      });
    } catch (error) {
      console.error('Error al crear tarea:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Error al crear tarea'
      });
    }
  }

  async getUserTasks(req, res) {
    try {
      const { page, limit, completed } = req.query;
      
      const result = await this.getUserTasksUseCase.execute(req.user._id, {
        page,
        limit,
        completed
      });
      
      res.status(200).json({
        success: true,
        message: 'Tareas obtenidas exitosamente',
        data: result.tasks,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener tareas'
      });
    }
  }

  async updateTask(req, res) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos inválidos',
          errors: errors.array()
        });
      }

      const result = await this.updateTaskUseCase.execute(
        req.params.id,
        req.user._id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        message: 'Tarea actualizada exitosamente',
        data: result.task
      });
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      
      const statusCode = error.message === 'Tarea no encontrada' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al actualizar tarea'
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const result = await this.deleteTaskUseCase.execute(
        req.params.id,
        req.user._id
      );
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.task
      });
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      
      const statusCode = error.message === 'Tarea no encontrada' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Error al eliminar tarea'
      });
    }
  }
}

module.exports = TaskController;