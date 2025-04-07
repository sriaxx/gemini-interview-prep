
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { createInterview } from "@/services/interviewService";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

const InterviewForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    techStackInput: "",
    techStack: [] as string[],
    yearsOfExperience: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      techStackInput: e.target.value,
    });
  };

  const handleAddTechStack = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.techStackInput.trim() !== "") {
      e.preventDefault();
      const newTech = formData.techStackInput.trim();
      if (!formData.techStack.includes(newTech)) {
        setFormData({
          ...formData,
          techStack: [...formData.techStack, newTech],
          techStackInput: "",
        });
      }
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((tech) => tech !== techToRemove),
    });
  };

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData({
      ...formData,
      yearsOfExperience: isNaN(value) ? 0 : Math.max(0, value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create an interview");
      navigate("/login");
      return;
    }
    
    if (formData.jobTitle.trim() === "") {
      toast.error("Job title is required");
      return;
    }
    
    if (formData.techStack.length === 0) {
      toast.error("Please add at least one technology");
      return;
    }

    try {
      setLoading(true);
      
      // Create the interview setup object
      const setup = {
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        techStack: formData.techStack,
        yearsOfExperience: formData.yearsOfExperience,
      };

      // Call the service to create the interview
      const response = await createInterview(user.id, setup);
      
      if (response.error) {
        toast.error(response.error);
        return;
      }
      
      if (response.data) {
        toast.success("Interview created successfully!");
        navigate(`/interview/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("Failed to create interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Interview</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            placeholder="e.g. Frontend Developer"
            value={formData.jobTitle}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            placeholder="Paste the job description here..."
            className="min-h-[100px]"
            value={formData.jobDescription}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="techStack">Technologies & Skills</Label>
          <Input
            id="techStackInput"
            name="techStackInput"
            placeholder="e.g. React (Press Enter to add)"
            value={formData.techStackInput}
            onChange={handleTechStackChange}
            onKeyDown={handleAddTechStack}
          />
          
          {formData.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.techStack.map((tech) => (
                <Badge key={tech} className="flex items-center gap-1 py-1 px-3">
                  {tech}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => handleRemoveTech(tech)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            step="1"
            value={formData.yearsOfExperience}
            onChange={handleYearsChange}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            "Create Interview"
          )}
        </Button>
      </form>
    </div>
  );
};

export default InterviewForm;
