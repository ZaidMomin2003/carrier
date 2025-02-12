import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ interviews }) {
  const getAverageScore = () => {
    if (!interviews?.length) return 0;
    const total = interviews.reduce(
      (sum, interview) => sum + interview.overallScore,
      0
    );
    return (total / interviews.length).toFixed(1);
  };

  const getLatestScore = () => {
    if (!interviews?.length) return 0;
    return interviews[0].overallScore.toFixed(1);
  };

  const getAverageCommunicationScore = () => {
    if (!interviews?.length) return 0;
    const total = interviews.reduce(
      (sum, interview) => sum + interview.communicationScore,
      0
    );
    return (total / interviews.length).toFixed(1);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAverageScore()}%</div>
          <p className="text-xs text-muted-foreground">
            Overall performance across all interviews
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getLatestScore()}%</div>
          <p className="text-xs text-muted-foreground">
            Most recent interview performance
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Communication Score</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAverageCommunicationScore()}%</div>
          <p className="text-xs text-muted-foreground">
            Average communication rating
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 