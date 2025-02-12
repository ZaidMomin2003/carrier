"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function PerformanceChart({ interviews }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (interviews) {
      const formattedData = interviews.map((interview) => ({
        date: format(new Date(interview.createdAt), "MMM dd"),
        overallScore: interview.overallScore,
        communicationScore: interview.communicationScore,
        technicalScore: interview.technicalScore,
      }));
      setChartData(formattedData);
    }
  }, [interviews]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your interview performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="text-sm font-medium">
                          Overall: {payload[0].value}%
                        </p>
                        <p className="text-sm">
                          Communication: {payload[1].value}%
                        </p>
                        <p className="text-sm">
                          Technical: {payload[2].value}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="overallScore"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Overall"
              />
              <Line
                type="monotone"
                dataKey="communicationScore"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                name="Communication"
              />
              <Line
                type="monotone"
                dataKey="technicalScore"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                name="Technical"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 