const QuestionRepository = require('../../infrastructure/repositories/question.repository');

class UpdateQuestionUseCase {
  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  async execute(questionId, updateData, user) {
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

      // Verificar permisos: solo el autor puede editar la pregunta
      if (currentQuestion.author._id.toString() !== user._id.toString()) {
        throw new Error('No tienes permisos para editar esta pregunta');
      }

      // Validar datos de actualización
      if (updateData.content && updateData.content.length > 500) {
        throw new Error('La pregunta no puede exceder 500 caracteres');
      }

      // Actualizar pregunta
      const updatedQuestion = await this.questionRepository.update(questionId, updateData);

      return {
        success: true,
        question: updatedQuestion,
        message: 'Pregunta actualizada exitosamente'
      };

    } catch (error) {
      console.error('Error en UpdateQuestionUseCase:', error);
      throw error;
    }
  }

  async markAsAnswered(questionId, user) {
    try {
      // Validar que el usuario esté autenticado
      if (!user || !user._id) {
        throw new Error('Usuario no autenticado');
      }

      // Validar ID de pregunta
      if (!questionId) {
        throw new Error('ID de pregunta requerido');
      }

      // Marcar como respondida
      const updatedQuestion = await this.questionRepository.markAsAnswered(questionId);

      if (!updatedQuestion) {
        throw new Error('Pregunta no encontrada');
      }

      return {
        success: true,
        question: updatedQuestion,
        message: 'Pregunta marcada como respondida'
      };

    } catch (error) {
      console.error('Error en UpdateQuestionUseCase (markAsAnswered):', error);
      throw error;
    }
  }

  async voteQuestion(questionId, user) {
    try {
      // Validar que el usuario esté autenticado
      if (!user || !user._id) {
        throw new Error('Usuario no autenticado');
      }

      // Validar ID de pregunta
      if (!questionId) {
        throw new Error('ID de pregunta requerido');
      }

      // Votar pregunta
      const result = await this.questionRepository.voteQuestion(questionId, user._id);

      return {
        success: true,
        question: result.question,
        hasVoted: result.hasVoted,
        totalVotes: result.totalVotes,
        message: result.hasVoted ? 'Voto agregado' : 'Voto removido'
      };

    } catch (error) {
      console.error('Error en UpdateQuestionUseCase (voteQuestion):', error);
      throw error;
    }
  }
}

module.exports = UpdateQuestionUseCase;
