const QuestionRepository = require('../../infrastructure/repositories/question.repository');

class DeleteQuestionUseCase {
  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  async execute(questionId, user) {
    try {
      // Validar que el usuario esté autenticado
      if (!user || !user._id) {
        throw new Error('Usuario no autenticado');
      }

      // Validar ID de pregunta
      if (!questionId) {
        throw new Error('ID de pregunta requerido');
      }

      // Obtener la pregunta actual
      const currentQuestion = await this.questionRepository.findById(questionId);
      
      if (!currentQuestion) {
        throw new Error('Pregunta no encontrada');
      }

      // Verificar permisos: solo el autor puede eliminar la pregunta
      if (currentQuestion.author._id.toString() !== user._id.toString()) {
        throw new Error('No tienes permisos para eliminar esta pregunta');
      }

      // Eliminar pregunta
      await this.questionRepository.delete(questionId);

      return {
        success: true,
        questionId: questionId,
        questionContent: currentQuestion.content,
        message: 'Pregunta eliminada exitosamente'
      };

    } catch (error) {
      console.error('Error en DeleteQuestionUseCase:', error);
      throw error;
    }
  }
}

module.exports = DeleteQuestionUseCase;
