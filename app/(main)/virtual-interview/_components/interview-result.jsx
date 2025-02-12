import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InterviewResult({ result, hideStartNew, onStartNew }) {
  if (!result) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>Your interview results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Overall Score</h3>
              <div className="text-2xl font-bold">
                {result.overallScore.toFixed(1)}%
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Communication Score</h3>
                <div className="text-xl">
                  {result.communicationScore.toFixed(1)}%
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Score</h3>
                <div className="text-xl">
                  {result.technicalScore.toFixed(1)}%
                </div>
              </div>
            </div>

            {result.feedback && (
              <div>
                <h3 className="font-semibold mb-2">Feedback</h3>
                <p className="text-muted-foreground">{result.feedback}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!hideStartNew && (
        <div className="flex justify-end">
          <Button onClick={onStartNew}>Start New Interview</Button>
        </div>
      )}
    </div>
  );
} 