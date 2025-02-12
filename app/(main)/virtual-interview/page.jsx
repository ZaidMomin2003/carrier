import PerformanceChart from "./_components/performance-chart";
import InterviewList from "./_components/interview-list";
import StatsCards from "./_components/stats-cards";

// This is temporary mock data - you'll want to fetch real data from your API
const mockInterviews = [
  {
    id: 1,
    overallScore: 85,
    communicationScore: 90,
    technicalScore: 80,
    feedback: "Great communication skills, needs improvement in technical depth",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    overallScore: 88,
    communicationScore: 85,
    technicalScore: 92,
    feedback: "Excellent technical knowledge, could improve response clarity",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 3,
    overallScore: 78,
    communicationScore: 82,
    technicalScore: 75,
    feedback: "Good overall performance, focus on technical concepts",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

export default function VirtualInterviewPage() {
  return (
    <div className="space-y-8 p-6">
      <StatsCards interviews={mockInterviews} />
      <div className="grid gap-6 grid-cols-1">
        <PerformanceChart interviews={mockInterviews} />
        <InterviewList interviews={mockInterviews} />
      </div>
    </div>
  );
} 