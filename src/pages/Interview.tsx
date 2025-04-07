
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { getInterviewSession, submitAnswers } from "@/services/interviewService";
import { Answer, InterviewSession, Question } from "@/types";
import QuestionCard from "@/components/QuestionCard";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Interview: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Protect route
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  // Load interview session
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

        setSession(interviewSession);
        
        // Initialize empty answers
        const initialAnswers: Record<string, string> = {};
        interviewSession.questions.forEach((question) => {
          initialAnswers[question.id] = "";
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Error loading session:", error);
        toast.error("Failed to load interview");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId, user?.id, navigate]);

  const handleAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleSubmit = async () => {
    if (!session) return;

    // Validate answers (ensure none are empty)
    const unansweredQuestions = session.questions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === ""
    );

    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions before submitting`);
      return;
    }

    setSubmitting(true);
    try {
      // Convert answers to the expected format
      const answerArray: Answer[] = session.questions.map((question) => ({
        questionId: question.id,
        text: answers[question.id],
      }));

      const response = await submitAnswers(session.id, answerArray);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      toast.success("Answers submitted successfully!");
      navigate(`/results/${session.id}`);
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast.error("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="interview-container">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading interview questions...</p>
            </div>
          ) : session ? (
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
                
                <h1 className="mb-2">{session.setup.jobTitle} Interview</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Answer these questions as if you were in a real interview. Try to be concise but comprehensive.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8">
                  <h3 className="text-lg font-medium mb-2">Interview Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Job Title</p>
                      <p className="font-medium">{session.setup.jobTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tech Stack</p>
                      <p className="font-medium">{session.setup.techStack.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Years of Experience</p>
                      <p className="font-medium">{session.setup.yearsOfExperience}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                {session.questions.map((question: Question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                    answer={answers[question.id] || ""}
                    onAnswerChange={handleAnswerChange}
                  />
                ))}
              </div>
              
              <div className="flex justify-end mb-8">
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="px-6"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Answers...
                    </>
                  ) : (
                    <>
                      Submit Answers
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">Interview not found</p>
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

export default Interview;
