"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, CheckCircle, XCircle, ExternalLink, Search, Filter, FileText } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { mockSubmissions, mockAssignments } from "@/lib/mock-data"
import Link from "next/link"
import { SubmissionStatus, UserRole } from "@/lib/types"
import { Layout } from "@/components/layout"
// import { UserRole, SubmissionStatus } from "@/lib/constants"

export default function MySubmissions() {
  const { currentUser } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  if (currentUser?.role !== UserRole.STUDENT) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center p-8">
            <div className="text-red-500 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">Only students can view submission history.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userSubmissions = mockSubmissions.filter((s) => s.studentId === currentUser?.id)

  // Filter submissions
  const filteredSubmissions = userSubmissions.filter((submission) => {
    const assignment = mockAssignments.find((a) => a.id === submission.assignmentId)
    const matchesSearch =
      assignment?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.feedback && submission.feedback.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || submission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const submissionStats = {
    total: userSubmissions.length,
    pending: userSubmissions.filter((s) => s.status === SubmissionStatus.PENDING).length,
    accepted: userSubmissions.filter((s) => s.status === SubmissionStatus.ACCEPTED).length,
    rejected: userSubmissions.filter((s) => s.status === SubmissionStatus.REJECTED).length,
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-600 mt-2">Track your assignment submissions and feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissionStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{submissionStats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{submissionStats.accepted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{submissionStats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by assignment title, notes, or feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.map((submission) => {
            const assignment = mockAssignments.find((a) => a.id === submission.assignmentId)

            return (
              <Card key={submission.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {assignment?.title}
                        <Badge
                          variant={
                            submission.status === SubmissionStatus.ACCEPTED
                              ? "default"
                              : submission.status === SubmissionStatus.REJECTED
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {submission.status === SubmissionStatus.ACCEPTED && <CheckCircle className="w-3 h-3 mr-1" />}
                          {submission.status === SubmissionStatus.REJECTED && <XCircle className="w-3 h-3 mr-1" />}
                          {submission.status === SubmissionStatus.PENDING && <Clock className="w-3 h-3 mr-1" />}
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Due: {assignment && new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Submission Details */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Your Submission</h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                            <a
                              href={submission.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm break-all"
                            >
                              {submission.submissionUrl}
                            </a>
                          </div>
                          {submission.note && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-sm text-gray-700">
                                <strong>Your Note:</strong> {submission.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Instructor Feedback</h4>
                      {submission.feedback ? (
                        <div
                          className={`p-4 rounded-lg ${submission.status === SubmissionStatus.ACCEPTED
                              ? "bg-green-50 border border-green-200"
                              : submission.status === SubmissionStatus.REJECTED
                                ? "bg-red-50 border border-red-200"
                                : "bg-blue-50 border border-blue-200"
                            }`}
                        >
                          <p
                            className={`text-sm ${submission.status === SubmissionStatus.ACCEPTED
                                ? "text-green-800"
                                : submission.status === SubmissionStatus.REJECTED
                                  ? "text-red-800"
                                  : "text-blue-800"
                              }`}
                          >
                            {submission.feedback}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 italic">
                            {submission.status === SubmissionStatus.PENDING
                              ? "Feedback will appear here once your submission is reviewed."
                              : "No feedback provided yet."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assignment Description */}
                  {assignment && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Assignment Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                      <Link href={`/assignments`}>
                        <Button variant="link" className="p-0 h-auto text-blue-600">
                          View full assignment details →
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search terms or filters."
                : "You haven't submitted any assignments yet."}
            </p>
            <Link href="/assignments">
              <Button>Browse Available Assignments</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
