
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Brain, Check, Code, LucideIcon, MessageCircle, MoveRight, User } from "lucide-react";

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  const features: { title: string; description: string; icon: LucideIcon }[] = [
    {
      title: "AI-Generated Questions",
      description: "Get personalized interview questions based on your job role and tech stack.",
      icon: Brain,
    },
    {
      title: "Real-time Feedback",
      description: "Receive instant analysis of your answers with keyword matching and suggestions.",
      icon: MessageCircle,
    },
    {
      title: "Tech-Specific Interviews",
      description: "Prepare for interviews in your specific tech domain with relevant questions.",
      icon: Code,
    },
    {
      title: "Experience-Based Learning",
      description: "Questions tailored to your years of experience and career level.",
      icon: User,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
          <div className="interview-container text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Ace Your Next Tech Interview with{" "}
              <span className="text-primary">AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Practice with personalized interview questions and get instant feedback on your answers
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="text-base px-8"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <MoveRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="interview-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How InterviewAI Works</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Prepare for technical interviews with our AI-powered platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="shrink-0">
                    <span className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
          <div className="interview-container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 3-Step Process</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Start practicing for your interviews in minutes
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your job title, skills, and experience to generate relevant questions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Answer Questions</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Practice answering tailored AI-generated interview questions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Feedback</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Receive instant analysis of your answers with improvement suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="interview-container text-center">
            <div className="bg-primary/5 rounded-2xl p-8 md:p-12 lg:p-16 border border-primary/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of job seekers who improved their interview performance with InterviewAI
              </p>
              
              <Button 
                size="lg" 
                className="text-base px-8"
                onClick={() => navigate("/signup")}
              >
                Start Practicing Now
                <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
