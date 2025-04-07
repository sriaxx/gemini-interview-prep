
const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  setup: {
    jobTitle: String,
    jobDescription: String,
    techStack: [String],
    yearsOfExperience: Number
  },
  questions: [{
    id: String,
    text: String,
    keywords: [String]
  }],
  answers: [{
    questionId: String,
    text: String
  }],
  feedback: [{
    questionId: String,
    score: Number,
    matchedKeywords: [String],
    suggestions: String
  }],
  status: {
    type: String,
    enum: ['created', 'in-progress', 'completed'],
    default: 'created'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Interview = mongoose.model('Interview', InterviewSchema);

module.exports = Interview;
