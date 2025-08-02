"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

enum SubmissionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  submissionUrl: string
  submittedAt: Date
  status: SubmissionStatus
  feedback?: string
  grade?: number
  note: string
}

const mockSubmissions: Submission[] = [
  {
    id: "1",
    assignmentId: "1",
    studentId: "2",
    studentName: "Alex Chen",
    submissionUrl: "https://github.com/alexchen/react-fundamentals",
    submittedAt: new Date("2024-03-10"),
    status: SubmissionStatus.ACCEPTED,
    feedback: "Excellent work! Your component structure is clean and well-organized.",
    grade: 95,
    note: "Implemented all required features with bonus animations.",
  },
  {
    id: "2",
    assignmentId: "1",
    studentId: "3",
    studentName: "Maria Rodriguez",
    submissionUrl: "https://github.com/maria/react-project",
    submittedAt: new Date("2024-03-12"),
    status: SubmissionStatus.PENDING,
    note: "Complete React application with state management.",
  },
  {
    id: "3",
    assignmentId: "2",
    studentId: "2",
    studentName: "Alex Chen",
    submissionUrl: "https://github.com/alexchen/database-design",
    submittedAt: new Date("2024-03-18"),
    status: SubmissionStatus.REJECTED,
    feedback: "Good start, but the normalization needs improvement. Please review 3NF principles.",
    grade: 65,
    note: "Database schema with ER diagram and sample data.",
  },
  {
    id: "4",
    assignmentId: "2",
    studentId: "4",
    studentName: "John Smith",
    submissionUrl: "https://github.com/johnsmith/ecommerce-db",
    submittedAt: new Date("2024-03-20"),
    status: SubmissionStatus.ACCEPTED,
    feedback: "Well-designed schema with proper relationships and constraints.",
    grade: 88,
    note: "Comprehensive database design with documentation.",
  },
]

const chartConfig = {
  submissions: {
    label: "Submissions",
  },
  accepted: {
    label: "Accepted",
    color: "hsl(142, 76%, 36%)",
  },
  pending: {
    label: "Pending",
    color: "hsl(48, 96%, 53%)",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(0, 84%, 60%)",
  },
}

export default function SubmissionPieChart() {
  // Process the data to count submissions by status
  const statusCounts = mockSubmissions.reduce(
    (acc, submission) => {
      const status = submission.status.toLowerCase()
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Transform data for the pie chart
  const chartData = [
    {
      status: "accepted",
      count: statusCounts.accepted || 0,
      fill: chartConfig.accepted.color,
    },
    {
      status: "pending",
      count: statusCounts.pending || 0,
      fill: chartConfig.pending.color,
    },
    {
      status: "rejected",
      count: statusCounts.rejected || 0,
      fill: chartConfig.rejected.color,
    },
  ].filter((item) => item.count > 0) // Only show statuses that have submissions

  const totalSubmissions = mockSubmissions.length

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Submission Status Distribution</CardTitle>
        <CardDescription>Overview of all assignment submissions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-col gap-2 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Submissions</span>
            <span className="font-medium">{totalSubmissions}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            {chartData.map((item) => (
              <div key={item.status} className="flex flex-col">
                <div className="flex items-center justify-center gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="capitalize text-muted-foreground">{item.status}</span>
                </div>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
