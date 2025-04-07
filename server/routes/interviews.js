
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Interview = require('../models/Interview');
const { generateMockQuestions, generateMockFeedback } = require('../utils/interviewHelpers');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new interview
router.post('/', async (req, res) => {
  try {
    const { setup } = req.body;
    const userId = req.user.id;
    
    // Generate questions based on setup
    const questions = generateMockQuestions(setup);
    
    // Create new interview session
    const interview = new Interview({
      userId,
      setup,
      questions,
      status: 'created'
    });
    
    await interview.save();
    
    res.status(201).json(interview);
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

// Get all interviews for current user
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(interviews);
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ error: 'Failed to retrieve interviews' });
  }
});

// Get interview by id
router.get('/:id', async (req, res) => {
  try {
    const interview = await Interview.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    res.json(interview);
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ error: 'Failed to retrieve interview' });
  }
});

// Submit answers and get feedback
router.post('/:id/answers', async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Find interview
    const interview = await Interview.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    // Generate feedback
    const feedback = generateMockFeedback(interview.questions, answers);
    
    // Update interview
    interview.answers = answers;
    interview.feedback = feedback;
    interview.status = 'completed';
    
    await interview.save();
    
    res.json(interview);
  } catch (error) {
    console.error('Submit answers error:', error);
    res.status(500).json({ error: 'Failed to submit answers' });
  }
});

// Initialize with sample data
router.post('/sample', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user already has interviews
    const existingInterviews = await Interview.findOne({ userId });
    
    if (existingInterviews) {
      return res.status(400).json({ error: 'User already has interviews' });
    }
    
    // Create sample interview
    const sampleInterview = new Interview({
      userId,
      setup: {
        jobTitle: "Frontend Developer",
        jobDescription: "Building responsive web applications using React",
        techStack: ["React", "JavaScript", "CSS"],
        yearsOfExperience: 2
      },
      questions: [
        {
          id: "sample_q1",
          text: "Explain the virtual DOM in React and why it's important.",
          keywords: ["efficiency", "performance", "rendering", "comparison", "updates"]
        },
        {
          id: "sample_q2",
          text: "What are React hooks and how have you used them?",
          keywords: ["useState", "useEffect", "custom hooks", "state management"]
        }
      ],
      status: 'created',
    });
    
    await sampleInterview.save();
    
    res.status(201).json(sampleInterview);
  } catch (error) {
    console.error('Create sample error:', error);
    res.status(500).json({ error: 'Failed to create sample interview' });
  }
});

module.exports = router;
