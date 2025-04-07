
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, PlusIcon } from "lucide-react";
import { InterviewSession } from "@/types";
import { getUserInterviewSessions, initializeWithSampleData } from "@/services/interviewService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  // Load user interview sessions
  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Initialize with sample data if no sessions exist
        await initializeWithSampleData(user.id);
        
        // Get all user sessions
        const userSessions = await getUserInterviewSessions(user.id);
        setSessions(userSessions);
      } catch (error) {
        console.error("Error loading sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSessions();
    }
  }, [user]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="interview-container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="mb-2">Welcome, {user?.name || "User"}!</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Prepare for your next interview with AI assistance
              </p>
            </div>
            <Button onClick={() => navigate("/new-interview")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="mb-4">My Interviews</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your interviews...</p>
              </div>
            ) : sessions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg mb-2">No interviews yet</h3>
                    <p className="text-gray-600 mb-6">
                      Create your first interview to get started
                    </p>
                    <Button onClick={() => navigate("/new-interview")}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create New Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => (
                  <Card key={session.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle>{session.setup.jobTitle}</CardTitle>
                      <CardDescription>
                        {session.setup.techStack.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(session.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {session.questions.length} question
                            {session.questions.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${session.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : session.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {session.status === "completed"
                              ? "Completed"
                              : session.status === "in-progress"
                              ? "In Progress"
                              : "Ready"}
                          </span>
                        </div>
                        
                        <Link
                          to={
                            session.status === "completed"
                              ? `/results/${session.id}`
                              : `/interview/${session.id}`
                          }
                        >
                          <Button variant="outline" size="sm">
                            {session.status === "completed"
                              ? "View Results"
                              : "Continue"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
