
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { getInterviewSession } from "@/services/interviewService";
import { InterviewSession } from "@/types";
import FeedbackCard from "@/components/FeedbackCard";
import { toast } from "sonner";
import { ArrowLeft, Download, Plus, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Results: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);

  // Protect route
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  // Load session and calculate score
  useEffect(() => {
    if (!sessionId) return;

    const loadSession = async () => {
      setLoading(true);
      try {
        const interviewSession = await getInterviewSession(sessionId);
        
        if (!interviewSession) {
          toast.error("Interview session not found");
          navigate("/dashboard");
          return;
        }

        // Check if this session belongs to the current user
        if (interviewSession.userId !== user?.id) {
          toast.error("You don't have access to this interview");
          navigate("/dashboard");
          return;
        }
        
        // Check if the session has results
        if (interviewSession.status !== 'completed' || !interviewSession.feedback) {
          toast.error("This interview doesn't have results yet");
          navigate(`/interview/${sessionId}`);
          return;
        }

        setSession(interviewSession);
        
        // Calculate overall score
        if (interviewSession.feedback) {
          const total = interviewSession.feedback.reduce(
            (sum, item) => sum + item.score,
            0
          );
          setOverallScore(
            Math.round((total / interviewSession.feedback.length) * 10) / 10
          );
        }
      } catch (error) {
        console.error("Error loading session:", error);
        toast.error("Failed to load interview results");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, user?.id, navigate]);

  // Download results as text
  const handleDownload = () => {
    if (!session) return;
    
    let content = `Interview Results - ${session.setup.jobTitle}\n`;
    content += `Tech Stack: ${session.setup.techStack.join(", ")}\n`;
    content += `Experience: ${session.setup.yearsOfExperience} years\n\n`;
    content += `Overall Score: ${overallScore}/5\n\n`;
    
    session.questions.forEach((question, index) => {
      const answer = session.answers?.find(a => a.questionId === question.id);
      const feedback = session.feedback?.find(f => f.questionId === question.id);
      
      content += `Question ${index + 1}: ${question.text}\n\n`;
      content += `Your Answer: ${answer?.text || ""}\n\n`;
      content += `Score: ${feedback?.score}/5\n`;
      content += `Keywords Matched: ${feedback?.matchedKeywords.join(", ") || "None"}\n`;
      content += `Suggestions: ${feedback?.suggestions || ""}\n\n`;
    });
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-results-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="interview-container">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading results...</p>
            </div>
          ) : session && session.feedback && session.answers ? (
            <>
              <div className="mb-8">
                <Button 
                  variant="outline" 
                  className="mb-4"
                  onClick={() => navigate("/dashboard")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                
                <h1 className="mb-2">{session.setup.jobTitle} Interview Results</h1>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <div className="text-center md:text-left">
                        <h3 className="text-lg font-medium">Overall Score</h3>
                        <div className="mt-2 flex items-center justify-center md:justify-start">
                          <span className="text-4xl font-bold text-primary">
                            {overallScore}
                          </span>
                          <span className="text-2xl text-gray-500">/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2 justify-center md:justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center"
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Results
                      </Button>
                      
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex items-center"
                        onClick={() => navigate("/new-interview")}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Interview
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="mb-6">Detailed Feedback</h2>
                
                {session.questions.map((question, index) => {
                  const answer = session.answers?.find(
                    (a) => a.questionId === question.id
                  );
                  const feedback = session.feedback?.find(
                    (f) => f.questionId === question.id
                  );
                  
                  if (!answer || !feedback) return null;
                  
                  return (
                    <FeedbackCard
                      key={question.id}
                      question={question}
                      answer={answer}
                      feedback={feedback}
                      questionNumber={index + 1}
                    />
                  );
                })}
              </div>
              
              <div className="bg-interview-background rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
                <p className="mb-4">
                  Continue practicing with more mock interviews or try different job titles and tech stacks to broaden your preparation.
                </p>
                <Button onClick={() => navigate("/new-interview")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Another Interview
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Results not found</p>
              <Button className="mt-4" onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
