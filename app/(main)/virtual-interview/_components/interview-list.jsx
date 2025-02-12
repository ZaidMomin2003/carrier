"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InterviewResult from "./interview-result";

export default function InterviewList({ interviews }) {
  const router = useRouter();
  const [selectedInterview, setSelectedInterview] = useState(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Interviews
              </CardTitle>
              <CardDescription>
                Review your past interview performances
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/virtual-interview/session")}>
              Start New Interview
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews?.map((interview, i) => (
              <Card
                key={interview.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedInterview(interview)}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Interview {i + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div>
                      Overall Score: {interview.overallScore.toFixed(1)}% | 
                      Communication: {interview.communicationScore.toFixed(1)}% | 
                      Technical: {interview.technicalScore.toFixed(1)}%
                    </div>
                    <div>
                      {format(
                        new Date(interview.createdAt),
                        "MMMM dd, yyyy HH:mm"
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                {interview.feedback && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {interview.feedback}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedInterview} onOpenChange={() => setSelectedInterview(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <InterviewResult
            result={selectedInterview}
            hideStartNew
            onStartNew={() => router.push("/virtual-interview/session")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 