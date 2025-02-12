"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Video, Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const INTERVIEW_TOPICS = [
  "React",
  "JavaScript",
  "Node.js",
  "Python",
  "System Design",
  "Data Structures",
  "Algorithms",
];

export default function InterviewSessionPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          setUserAnswer(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast.error('Speech recognition error. Please try again.');
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startInterview = async () => {
    if (!selectedTopic) {
      toast.error("Please select a topic first");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/interview/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: selectedTopic }),
      });
      const data = await response.json();
      setCurrentQuestion(data.question);
      setInterviewStarted(true);
    } catch (error) {
      toast.error("Failed to start interview");
      console.error(error);
    }
    setIsLoading(false);
  };

  const submitAnswer = async () => {
    if (!userAnswer) {
      toast.error("Please provide an answer first");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: userAnswer,
          topic: selectedTopic,
        }),
      });
      const data = await response.json();
      setFeedback(data.feedback);
      // Get next question
      const nextQuestionResponse = await fetch('/api/interview/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: selectedTopic }),
      });
      const nextQuestionData = await nextQuestionResponse.json();
      setCurrentQuestion(nextQuestionData.question);
      setUserAnswer("");
    } catch (error) {
      toast.error("Failed to evaluate answer");
      console.error(error);
    }
    setIsLoading(false);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
      await submitAnswer();
    } else {
      try {
        await recognitionRef.current?.start();
        setIsRecording(true);
        toast.success('Recording started');
      } catch (error) {
        console.error('Error starting recording:', error);
        toast.error('Failed to start recording');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="gradient-title text-3xl md:text-4xl">
            Virtual Interview Session
          </CardTitle>
          <CardDescription>
            Practice your interview skills with AI-powered feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!interviewStarted ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {INTERVIEW_TOPICS.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
              <Button 
                className="w-full" 
                onClick={startInterview}
                disabled={!selectedTopic || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Interview...
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {isRecording ? (
                  <Video className="h-20 w-20 text-red-500 animate-pulse" />
                ) : (
                  <Video className="h-20 w-20 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-4">
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <p className="font-medium">{currentQuestion}</p>
                  </CardContent>
                </Card>

                {userAnswer && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm">{userAnswer}</p>
                    </CardContent>
                  </Card>
                )}

                {feedback && (
                  <Card className="border-primary">
                    <CardContent className="pt-6">
                      <p className="text-sm">{feedback}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={toggleRecording}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" /> Start Recording
                    </>
                  )}
                </Button>
              </div>

              {!isRecording && !feedback && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Click "Start Recording" and begin answering the question.</p>
                  <p>Click "Stop Recording" when you're finished.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 