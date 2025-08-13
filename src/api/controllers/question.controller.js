const CreateQuestionUseCase = require('../../domain/use-cases/create-question.use-case');
const GetQuestionsUseCase = require('../../domain/use-cases/get-questions.use-case');
const UpdateQuestionUseCase = require('../../domain/use-cases/update-question.use-case');
const DeleteQuestionUseCase = require('../../domain/use-cases/delete-question.use-case');

class QuestionController {
  constructor() {
    this.createQuestionUseCase = new CreateQuestionUseCase();
    this.getQuestionsUseCase = new GetQuestionsUseCase();
    this.updateQuestionUseCase = new UpdateQuestionUseCase();
    this.deleteQuestionUseCase = new DeleteQuestionUseCase();
  }

  async createQuestion(req, res) {
    try {
      const questionData = req.body;
      const user = req.user;

      const result = await this.createQuestionUseCase.execute(questionData, user);

      // Emitir evento Socket.IO para notificar nueva pregunta
      if (req.socketServer) {
        req.socketServer.emitQuestionCreated(result.question, user);
      }

      res.status(201).json(result);

    } catch (error) {
      console.error('Error en createQuestion controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error creando pregunta'
      });
    }
  }

  async getQuestions(req, res) {
    try {
      const options = {
        answered: req.query.answered ? req.query.answered === 'true' : null,
        limit: parseInt(req.query.limit) || 50,
        skip: parseInt(req.query.skip) || 0
      };

      const result = await this.getQuestionsUseCase.execute(options);

      res.status(200).json(result);

    } catch (error) {
      console.error('Error en getQuestions controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error obteniendo preguntas'
      });
    }
  }

  async getQuestionById(req, res) {
    try {
      const questionId = req.params.id;

      const result = await this.getQuestionsUseCase.executeById(questionId);

      res.status(200).json(result);

    } catch (error) {
      console.error('Error en getQuestionById controller:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Error obteniendo pregunta'
      });
    }
  }

  async updateQuestion(req, res) {
    try {
      const questionId = req.params.id;
      const updateData = req.body;
      const user = req.user;

      const result = await this.updateQuestionUseCase.execute(questionId, updateData, user);

      // Emitir evento Socket.IO para notificar actualización
      if (req.socketServer) {
        req.socketServer.emitQuestionUpdated(result.question, user);
      }

      res.status(200).json(result);

    } catch (error) {
      console.error('Error en updateQuestion controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error actualizando pregunta'
      });
    }
  }

  async markAsAnswered(req, res) {
    try {
      const questionId = req.params.id;
      const user = req.user;

      const result = await this.updateQuestionUseCase.markAsAnswered(questionId, user);

      // Emitir evento Socket.IO para notificar que fue respondida
      if (req.socketServer) {
        req.socketServer.emitQuestionAnswered(result.question, user);
      }

      res.status(200).json(result);

    } catch (error) {
      console.error('Error en markAsAnswered controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error marcando pregunta como respondida'
      });
    }
  }

  async voteQuestion(req, res) {
    try {
      const questionId = req.params.id;
      const user = req.user;

      const result = await this.updateQuestionUseCase.voteQuestion(questionId, user);

      // Emitir evento Socket.IO para notificar voto
      if (req.socketServer) {
        req.socketServer.emitQuestionVoted(result.question, user, result.hasVoted);
      }

      res.status(200).json(result);

    } catch (error) {
      console.error('Error en voteQuestion controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error votando pregunta'
      });
    }
  }

  async deleteQuestion(req, res) {
    try {
      const questionId = req.params.id;
      const user = req.user;

      const result = await this.deleteQuestionUseCase.execute(questionId, user);

      // Emitir evento Socket.IO para notificar eliminación
      if (req.socketServer) {
        req.socketServer.emitQuestionDeleted(result.questionContent, user, questionId);
      }

      res.status(200).json(result);

    } catch (error) {
      console.error('Error en deleteQuestion controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error eliminando pregunta'
      });
    }
  }

  async getMyQuestions(req, res) {
    try {
      const user = req.user;
      const questionRepository = new (require('../../infrastructure/repositories/question.repository'))();
      
      const questions = await questionRepository.findByAuthor(user._id);

      res.status(200).json({
        success: true,
        questions: questions,
        count: questions.length,
        message: 'Mis preguntas obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getMyQuestions controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error obteniendo mis preguntas'
      });
    }
  }

  async getStats(req, res) {
    try {
      const questionRepository = new (require('../../infrastructure/repositories/question.repository'))();
      const stats = await questionRepository.getStats();

      res.status(200).json({
        success: true,
        stats: stats,
        message: 'Estadísticas obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getStats controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error obteniendo estadísticas'
      });
    }
  }
}

module.exports = QuestionController;
