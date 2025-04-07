
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  answer: string;
  onAnswerChange: (questionId: string, answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  answer,
  onAnswerChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswerChange(question.id, e.target.value);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-start">
            <span className="inline-block bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3">
              {questionNumber}
            </span>
            <h3 className="text-lg font-semibold">{question.text}</h3>
          </div>
        </div>
        
        <div className="mt-4">
          <Textarea
            placeholder="Type your answer here..."
            className="min-h-[150px]"
            value={answer}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
