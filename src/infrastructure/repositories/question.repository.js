const Question = require('../../domain/models/question.model');

class QuestionRepository {
  async create(questionData) {
    try {
      const question = new Question(questionData);
      const savedQuestion = await question.save();
      
      // Poblar los datos del autor
      await savedQuestion.populate('author', 'name email avatar');
      
      return savedQuestion;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async findAll(options = {}) {
    try {
      const { answered = null, limit = 50, skip = 0 } = options;
      
      let query = {};
      if (answered !== null) {
        query.answered = answered;
      }

      const questions = await Question
        .find(query)
        .populate('author', 'name email avatar')
        .sort({ answered: 1, priority: -1, votes: -1, createdAt: 1 })
        .limit(limit)
        .skip(skip);

      return questions;
    } catch (error) {
      console.error('Error finding questions:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const question = await Question
        .findById(id)
        .populate('author', 'name email avatar');
      
      return question;
    } catch (error) {
      console.error('Error finding question by id:', error);
      throw error;
    }
  }

  async findByAuthor(authorId) {
    try {
      const questions = await Question
        .find({ author: authorId })
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 });

      return questions;
    } catch (error) {
      console.error('Error finding questions by author:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const question = await Question
        .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('author', 'name email avatar');

      return question;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const question = await Question.findByIdAndDelete(id);
      return question;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  async markAsAnswered(id) {
    try {
      const question = await Question
        .findByIdAndUpdate(
          id, 
          { 
            answered: true, 
            answeredAt: new Date() 
          }, 
          { new: true, runValidators: true }
        )
        .populate('author', 'name email avatar');

      return question;
    } catch (error) {
      console.error('Error marking question as answered:', error);
      throw error;
    }
  }

  async voteQuestion(questionId, userId) {
    try {
      const question = await Question.findById(questionId);
      
      if (!question) {
        throw new Error('Pregunta no encontrada');
      }

      // Verificar si el usuario ya votó
      const hasVoted = question.voters.includes(userId);
      
      if (hasVoted) {
        // Remover voto
        question.voters = question.voters.filter(voterId => !voterId.equals(userId));
        question.votes = Math.max(0, question.votes - 1);
      } else {
        // Agregar voto
        question.voters.push(userId);
        question.votes += 1;
      }

      const updatedQuestion = await question.save();
      await updatedQuestion.populate('author', 'name email avatar');
      
      return {
        question: updatedQuestion,
        hasVoted: !hasVoted,
        totalVotes: updatedQuestion.votes
      };
    } catch (error) {
      console.error('Error voting question:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const totalQuestions = await Question.countDocuments();
      const answeredQuestions = await Question.countDocuments({ answered: true });
      const pendingQuestions = await Question.countDocuments({ answered: false });
      
      return {
        total: totalQuestions,
        answered: answeredQuestions,
        pending: pendingQuestions
      };
    } catch (error) {
      console.error('Error getting question stats:', error);
      throw error;
    }
  }
}

module.exports = QuestionRepository;
