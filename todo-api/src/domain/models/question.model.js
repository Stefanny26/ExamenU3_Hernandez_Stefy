const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'El contenido de la pregunta es requerido'],
    trim: true,
    maxlength: [500, 'La pregunta no puede exceder 500 caracteres']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  answered: {
    type: Boolean,
    default: false
  },
  answeredAt: {
    type: Date
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  votes: {
    type: Number,
    default: 0
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Índices para optimizar consultas
questionSchema.index({ answered: 1, createdAt: -1 });
questionSchema.index({ author: 1 });

module.exports = mongoose.model('Question', questionSchema);
