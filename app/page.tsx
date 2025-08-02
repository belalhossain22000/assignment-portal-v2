"use client"

import { useUser } from "@/lib/user-context"
import { UserRole } from "@/lib/types"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Clock, CheckCircle, AlertCircle, Plus, TrendingUp, Users, Calendar } from "lucide-react"
import { mockAssignments, mockSubmissions } from "@/lib/mock-data"
import Link from "next/link"
import LoginPage from "./auth/login/page"
import SubmissionPieChart from "@/components/submissionPichart"

export default function Dashboard() {
  const { currentUser, isAuthenticated, isLoading } = useUser()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <LoginPage />
  }

  const isInstructor = currentUser.role === UserRole.INSTRUCTOR

  // Calculate stats
  const totalAssignments = mockAssignments.length
  const totalSubmissions = mockSubmissions.length
  const pendingSubmissions = mockSubmissions.filter((s) => s.status === "PENDING").length
  const acceptedSubmissions = mockSubmissions.filter((s) => s.status === "ACCEPTED").length

  const studentSubmissions = mockSubmissions.filter((s) => s.studentId === currentUser.id)
  const studentAccepted = studentSubmissions.filter((s) => s.status === "ACCEPTED").length
  const studentPending = studentSubmissions.filter((s) => s.status === "PENDING").length

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
            <p className="text-blue-100 text-lg">
              {isInstructor
                ? "Manage your assignments and track student progress"
                : "View your assignments and track your submissions"}
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-24 w-24 rounded-full bg-white/5" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isInstructor ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAssignments}</div>
                  <p className="text-xs text-muted-foreground">Active assignments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">All time submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingSubmissions}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Accepted submissions</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Assignments</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAssignments}</div>
                  <p className="text-xs text-muted-foreground">Ready to submit</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Submissions</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentSubmissions.length}</div>
                  <p className="text-xs text-muted-foreground">Total submitted</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentPending}</div>
                  <p className="text-xs text-muted-foreground">Under review</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentAccepted}</div>
                  <p className="text-xs text-muted-foreground">Completed successfully</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Assignments</CardTitle>
                {isInstructor && (
                  <Button asChild size="sm">
                    <Link href="/assignments/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(assignment.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {Math.ceil(
                        (new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          {/* <Card>
            <CardHeader>
              <CardTitle>{isInstructor ? "Recent Submissions" : "My Recent Submissions"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(isInstructor ? mockSubmissions : studentSubmissions).slice(0, 3).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {mockAssignments.find((a) => a.id === submission.assignmentId)?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isInstructor
                          ? `By ${submission.studentName}`
                          : `Submitted ${new Date(submission.submittedAt).toLocaleDateString()}`}
                      </p>
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
                      {submission.status === "ACCEPTED" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {submission.status === "REJECTED" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {submission.status === "PENDING" && <Clock className="h-3 w-3 mr-1" />}
                      {submission.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
          <SubmissionPieChart />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {isInstructor ? (
                <>
                  <Button asChild className="h-auto p-4 flex-col space-y-2">
                    <Link href="/assignments/create">
                      <Plus className="h-6 w-6" />
                      <span>Create Assignment</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/submissions">
                      <FileText className="h-6 w-6" />
                      <span>Review Submissions</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/analytics">
                      <TrendingUp className="h-6 w-6" />
                      <span>View Analytics</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/assignments">
                      <Users className="h-6 w-6" />
                      <span>Manage Classes</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="h-auto p-4 flex-col space-y-2">
                    <Link href="/assignments">
                      <BookOpen className="h-6 w-6" />
                      <span>View Assignments</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/my-submissions">
                      <FileText className="h-6 w-6" />
                      <span>My Submissions</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/assignments">
                      <Clock className="h-6 w-6" />
                      <span>Upcoming Deadlines</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/my-submissions">
                      <CheckCircle className="h-6 w-6" />
                      <span>Check Grades</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
