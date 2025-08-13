const QuestionRepository = require('../../infrastructure/repositories/question.repository');

class CreateQuestionUseCase {
  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  async execute(questionData, user) {
    try {
      // Validar que el usuario esté autenticado
      if (!user || !user._id) {
        throw new Error('Usuario no autenticado');
      }

      // Validar datos de la pregunta
      if (!questionData.content || questionData.content.trim() === '') {
        throw new Error('El contenido de la pregunta es requerido');
      }

      if (questionData.content.length > 500) {
        throw new Error('La pregunta no puede exceder 500 caracteres');
      }

      // Preparar datos para crear la pregunta
      const newQuestionData = {
        content: questionData.content.trim(),
        author: user._id,
        authorName: user.name,
        priority: questionData.priority || 0
      };

      // Crear la pregunta
      const question = await this.questionRepository.create(newQuestionData);

      return {
        success: true,
        question: question,
        message: 'Pregunta creada exitosamente'
      };

    } catch (error) {
      console.error('Error en CreateQuestionUseCase:', error);
      throw error;
    }
  }
}

module.exports = CreateQuestionUseCase;
