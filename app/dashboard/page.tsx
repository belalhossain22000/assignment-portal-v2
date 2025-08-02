"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Plus, FileText, Clock, CheckCircle, XCircle, User, LogOut } from "lucide-react"
import { mockAssignments, mockSubmissions } from "@/lib/mock-data"

const COLORS = {
  pending: "#f59e0b",
  accepted: "#10b981",
  rejected: "#ef4444",
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = (session.user as any)?.role
  const userEmail = session.user?.email
  const userName = session.user?.name

  // Calculate submission statistics
  const submissionStats = mockSubmissions.reduce(
    (acc, submission) => {
      acc[submission.status] = (acc[submission.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = [
    { name: "Pending", value: submissionStats.pending || 0, color: COLORS.pending },
    { name: "Accepted", value: submissionStats.accepted || 0, color: COLORS.accepted },
    { name: "Rejected", value: submissionStats.rejected || 0, color: COLORS.rejected },
  ]

  const userSubmissions =
    userRole === "STUDENT" ? mockSubmissions.filter((s) => s.studentEmail === userEmail) : mockSubmissions

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assignment Portal</h1>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <User className="w-4 h-4 mr-1" />
                {userName} ({userRole})
              </div>
            </div>
            <Button onClick={() => signOut()} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAssignments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{submissionStats.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{submissionStats.accepted || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{submissionStats.rejected || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>
                    {userRole === "INSTRUCTOR" ? "Manage your assignments" : "Available assignments"}
                  </CardDescription>
                </div>
                {userRole === "INSTRUCTOR" && (
                  <Button onClick={() => router.push("/assignments/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssignments.slice(0, 3).map((assignment) => {
                    const userSubmission = userSubmissions.find((s) => s.assignmentId === assignment.id)
                    const isOverdue = new Date(assignment.deadline) < new Date()

                    return (
                      <div key={assignment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{assignment.title}</h3>
                              {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{assignment.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              Due: {new Date(assignment.deadline).toLocaleDateString()}
                            </div>
                            {userRole === "STUDENT" && userSubmission && (
                              <div className="mt-2">
                                <Badge
                                  variant={
                                    userSubmission.status === "ACCEPTED"
                                      ? "default"
                                      : userSubmission.status === "REJECTED"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {userSubmission.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            {userRole === "STUDENT" && !userSubmission && !isOverdue && (
                              <Button size="sm">Submit</Button>
                            )}
                            {userRole === "INSTRUCTOR" && (
                              <Button size="sm" variant="outline">
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>{userRole === "INSTRUCTOR" ? "Recent Submissions" : "My Submissions"}</CardTitle>
                <CardDescription>Latest submission activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSubmissions.slice(0, 4).map((submission) => {
                    const assignment = mockAssignments.find((a) => a.id === submission.assignmentId)
                    return (
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{assignment?.title}</p>
                          <p className="text-sm text-gray-600">
                            by {submission.studentName} • {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                          {submission.feedback && (
                            <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{submission.feedback}</p>
                          )}
                        </div>
                        <Badge
                          variant={
                            submission.status === "ACCEPTED"
                              ? "default"
                              : submission.status === "REJECTED"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
                <CardDescription>Distribution of all submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {userRole === "INSTRUCTOR" ? (
                  <>
                    <Button className="w-full" onClick={() => router.push("/assignments/create")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Review Submissions
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View All Assignments
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Clock className="w-4 h-4 mr-2" />
                      My Submissions
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
