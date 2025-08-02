"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Clock, Users, Award, Target, Download, Sparkles } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { mockAssignments, mockSubmissions } from "@/lib/mock-data"
import { useState } from "react"
import { Layout } from "@/components/layout"

export default function Analytics() {
  const { currentUser } = useUser()
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("submissions")

  // Generate analytics data
  const generatePerformanceData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toISOString().split("T")[0],
        submissions: Math.floor(Math.random() * 10) + 1,
        grades: Math.floor(Math.random() * 20) + 80,
        engagement: Math.floor(Math.random() * 30) + 70,
      }
    })
    return last30Days
  }

  const performanceData = generatePerformanceData()

  const gradeDistribution = [
    { grade: "A", count: 15, percentage: 30 },
    { grade: "B", count: 20, percentage: 40 },
    { grade: "C", count: 10, percentage: 20 },
    { grade: "D", count: 3, percentage: 6 },
    { grade: "F", count: 2, percentage: 4 },
  ]

  const submissionTrends = [
    { name: "Week 1", onTime: 45, late: 5, missing: 2 },
    { name: "Week 2", onTime: 42, late: 8, missing: 3 },
    { name: "Week 3", onTime: 48, late: 4, missing: 1 },
    { name: "Week 4", onTime: 46, late: 6, missing: 2 },
  ]

  const topPerformers = [
    { name: "Alex Chen", score: 98, trend: "up", assignments: 12 },
    { name: "Maria Rodriguez", score: 96, trend: "up", assignments: 11 },
    { name: "James Wilson", score: 94, trend: "down", assignments: 10 },
    { name: "Sarah Kim", score: 92, trend: "up", assignments: 12 },
  ]

  const assignmentDifficulty = mockAssignments.map((assignment) => {
    const submissions = mockSubmissions.filter((s) => s.assignmentId === assignment.id)
    const avgScore =
      submissions.length > 0
        ? submissions.reduce((acc, s) => acc + (s.status === "ACCEPTED" ? 90 : s.status === "REJECTED" ? 60 : 75), 0) /
        submissions.length
        : 0

    return {
      name: assignment.title.substring(0, 20) + "...",
      difficulty: Math.max(0, 100 - avgScore),
      submissions: submissions.length,
      avgScore: Math.round(avgScore),
    }
  })

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-indigo-600/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Advanced Analytics
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent mb-4">
                  Performance Dashboard
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  {currentUser?.role === "INSTRUCTOR"
                    ? "Deep insights into class performance, assignment effectiveness, and student engagement patterns."
                    : "Track your academic progress, identify strengths, and discover areas for improvement."}
                </p>
              </div>
              <div className="flex gap-3 mt-6 lg:mt-0">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 bg-white/60 backdrop-blur-sm border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">Average Grade</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">87.5%</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.3% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">Completion Rate</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">94.2%</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +1.8% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">Avg. Submission Time</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">2.3 days</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    0.5 days earlier
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">Active Students</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">48</div>
                  <div className="flex items-center text-sm text-red-600 mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -2 from last week
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Charts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Trend */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Performance Trends</CardTitle>
                      <CardDescription>Track performance metrics over time</CardDescription>
                    </div>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submissions">Submissions</SelectItem>
                        <SelectItem value="grades">Grades</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey={selectedMetric}
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Patterns */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Submission Patterns</CardTitle>
                  <CardDescription>On-time vs late submissions by week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={submissionTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                        <Bar dataKey="missing" stackId="a" fill="#ef4444" name="Missing" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Difficulty Analysis */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Assignment Difficulty Analysis</CardTitle>
                  <CardDescription>Identify challenging assignments based on performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assignmentDifficulty} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Bar dataKey="difficulty" fill="#8884d8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Grade Distribution */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Grade Distribution</CardTitle>
                  <CardDescription>Current class grade breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gradeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                        >
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Top Performers</CardTitle>
                  <CardDescription>Students with highest scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((student, index) => (
                      <div
                        key={student.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.assignments} assignments</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">{student.score}%</span>
                          {student.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Insights */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">Improvement Trend</span>
                    </div>
                    <p className="text-sm text-green-700">Class average has improved by 5.2% this month</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-800">Submission Timing</span>
                    </div>
                    <p className="text-sm text-blue-700">Most students submit 2-3 days before deadline</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
                    <div className="flex items-center mb-2">
                      <Target className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-semibold text-orange-800">At-Risk Students</span>
                    </div>
                    <p className="text-sm text-orange-700">3 students need additional support</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
