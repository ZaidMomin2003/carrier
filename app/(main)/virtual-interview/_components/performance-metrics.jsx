"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

export default function PerformanceMetrics({ interviews }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (interviews) {
      const formattedData = interviews.map((interview) => ({
        date: format(new Date(interview.createdAt), "MMM dd"),
        overall: interview.overallScore,
        communication: interview.communicationScore,
        technical: interview.technicalScore,
      }));
      setChartData(formattedData);
    }
  }, [interviews]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Metrics
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
                        {payload.map((entry) => (
                          <p
                            key={entry.name}
                            className="text-sm font-medium capitalize"
                          >
                            {entry.name}: {entry.value}%
                          </p>
                        ))}
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="overall"
                name="Overall"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="communication"
                name="Communication"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="technical"
                name="Technical"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 