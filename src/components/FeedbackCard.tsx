
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Question, Answer, Feedback } from "@/types";
import { Star, StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeedbackCardProps {
  question: Question;
  answer: Answer;
  feedback: Feedback;
  questionNumber: number;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  question,
  answer,
  feedback,
  questionNumber,
}) => {
  // Render stars for score
  const renderStars = (score: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index}>
          {index < score ? (
            <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          ) : (
            <Star className="h-4 w-4 text-gray-300" />
          )}
        </span>
      ));
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-start">
            <span className="inline-block bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3">
              {questionNumber}
            </span>
            <h3 className="text-lg font-semibold">{question.text}</h3>
          </div>
          
          <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Your Answer:</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{answer.text}</p>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Feedback</h4>
            <div className="flex">{renderStars(feedback.score)}</div>
          </div>
          
          {feedback.matchedKeywords.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Keywords mentioned:</p>
              <div className="flex flex-wrap gap-2">
                {feedback.matchedKeywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Suggestions:</p>
            <p className="text-gray-700 dark:text-gray-300">{feedback.suggestions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
