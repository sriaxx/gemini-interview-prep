
// Mock keywords for generating questions
const mockKeywords = {
  "react": ["components", "hooks", "state", "props", "virtual DOM", "jsx", "react router", "context", "redux"],
  "javascript": ["closures", "promises", "async/await", "prototypes", "ES6", "map", "filter", "arrow functions"],
  "frontend": ["responsive", "accessibility", "CSS", "HTML", "responsive design", "user experience", "UI/UX"],
  "backend": ["API", "database", "server", "middleware", "authentication", "authorization", "RESTful"],
  "node": ["express", "npm", "package.json", "middleware", "server", "modules"],
  "database": ["SQL", "NoSQL", "schema", "query", "index", "normalization", "MongoDB", "PostgreSQL"],
  "system design": ["scalability", "reliability", "availability", "performance", "security", "microservices"],
};

// Generate mock questions based on interview setup
const generateMockQuestions = (setup) => {
  const { jobTitle, techStack } = setup;
  const questions = [];
  
  // Generate technical questions based on tech stack
  techStack.forEach((tech, index) => {
    if (index < 3) { // Limit to 3 tech stack questions
      questions.push({
        id: `q_tech_${index}`,
        text: `Explain your experience with ${tech} and how you've used it in previous projects.`,
        keywords: mockKeywords[tech.toLowerCase()] || [],
      });
    }
  });
  
  // Add job-specific questions
  questions.push({
    id: `q_job_1`,
    text: `What makes you a good candidate for this ${jobTitle} position?`,
    keywords: ["experience", "skills", "projects", "achievements"],
  });
  
  questions.push({
    id: `q_job_2`,
    text: `Describe a challenging problem you solved as a ${jobTitle}.`,
    keywords: ["problem solving", "challenges", "solution", "impact"],
  });
  
  // Add behavioral question
  questions.push({
    id: `q_behavior_1`,
    text: "Tell me about a time when you had to meet a tight deadline. How did you handle it?",
    keywords: ["time management", "prioritization", "stress", "teamwork", "communication"],
  });
  
  // Add general technical question
  questions.push({
    id: `q_general_1`,
    text: "How do you stay updated with the latest trends and technologies in your field?",
    keywords: ["continuous learning", "professional development", "resources", "community"],
  });
  
  return questions;
};

// Generate mock feedback based on questions and answers
const generateMockFeedback = (questions, answers) => {
  return answers.map(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    
    if (!question || !question.keywords || question.keywords.length === 0) {
      return {
        questionId: answer.questionId,
        score: 3,
        matchedKeywords: [],
        suggestions: "Your answer was satisfactory. Consider providing more specific examples next time."
      };
    }
    
    const answerText = answer.text.toLowerCase();
    const matchedKeywords = question.keywords.filter(keyword => 
      answerText.includes(keyword.toLowerCase())
    );
    
    // Calculate score based on keyword matches
    const keywordMatchRatio = matchedKeywords.length / question.keywords.length;
    const score = Math.min(Math.round(keywordMatchRatio * 5) + 1, 5);
    
    // Generate suggestions
    let suggestions = "";
    if (score <= 2) {
      suggestions = "Your answer could be improved significantly. Consider addressing these keywords: " + 
        question.keywords.filter(k => !matchedKeywords.includes(k)).slice(0, 3).join(", ");
    } else if (score <= 4) {
      suggestions = "Good answer, but you could strengthen it by mentioning: " + 
        question.keywords.filter(k => !matchedKeywords.includes(k)).slice(0, 2).join(", ");
    } else {
      suggestions = "Excellent answer that covered most key points.";
    }
    
    return {
      questionId: answer.questionId,
      score,
      matchedKeywords,
      suggestions
    };
  });
};

module.exports = {
  generateMockQuestions,
  generateMockFeedback
};
