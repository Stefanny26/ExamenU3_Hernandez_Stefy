const QuestionRepository = require('../../infrastructure/repositories/question.repository');

class GetQuestionsUseCase {
  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  async execute(options = {}) {
    try {
      const questions = await this.questionRepository.findAll(options);
      const stats = await this.questionRepository.getStats();

      return {
        success: true,
        questions: questions,
        stats: stats,
        message: 'Preguntas obtenidas exitosamente'
      };

    } catch (error) {
      console.error('Error en GetQuestionsUseCase:', error);
      throw error;
    }
  }

  async executeById(questionId) {
    try {
      if (!questionId) {
        throw new Error('ID de pregunta requerido');
      }

      const question = await this.questionRepository.findById(questionId);
      
      if (!question) {
        throw new Error('Pregunta no encontrada');
      }

      return {
        success: true,
        question: question,
        message: 'Pregunta obtenida exitosamente'
      };

    } catch (error) {
      console.error('Error en GetQuestionsUseCase (by ID):', error);
      throw error;
    }
  }
}

module.exports = GetQuestionsUseCase;
