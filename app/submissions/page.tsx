"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ExternalLink, Calendar, User, MessageSquare, Search, Filter } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { mockSubmissions, mockAssignments } from "@/lib/mock-data"
import type { Submission } from "@/lib/types"
import { SubmissionStatus, UserRole } from "@/lib/types"
import { Layout } from "@/components/layout"

export default function Submissions() {
  const { currentUser } = useUser()
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [assignmentFilter, setAssignmentFilter] = useState("all")

  if (currentUser?.role !== UserRole.INSTRUCTOR) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center p-8">
            <div className="text-red-500 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">Only instructors can review submissions.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const updateSubmissionStatus = (submissionId: string, status: Submission["status"]) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, status, feedback: feedback[submissionId] || sub.feedback || "" } : sub,
      ),
    )
  }

  const handleFeedbackChange = (submissionId: string, value: string) => {
    setFeedback((prev) => ({ ...prev, [submissionId]: value }))
  }

  const saveFeedback = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, feedback: feedback[submissionId] || "" } : sub)),
    )
    // Clear the feedback state for this submission
    setFeedback((prev) => {
      const newFeedback = { ...prev }
      delete newFeedback[submissionId]
      return newFeedback
    })
  }

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    const assignment = mockAssignments.find((a) => a.id === submission.assignmentId)
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.note.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    const matchesAssignment = assignmentFilter === "all" || submission.assignmentId === assignmentFilter

    return matchesSearch && matchesStatus && matchesAssignment
  })

  const submissionStats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === SubmissionStatus.PENDING).length,
    accepted: submissions.filter((s) => s.status === SubmissionStatus.ACCEPTED).length,
    rejected: submissions.filter((s) => s.status === SubmissionStatus.REJECTED).length,
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Submissions</h1>
          <p className="text-gray-600 mt-2">Review and provide feedback on student submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissionStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <div className="h-4 w-4 bg-yellow-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{submissionStats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{submissionStats.accepted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <div className="h-4 w-4 bg-red-500 rounded-full" />
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
                    placeholder="Search by student name, assignment, or notes..."
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
                  <SelectItem value={SubmissionStatus.PENDING}>{SubmissionStatus.PENDING}</SelectItem>
                  <SelectItem value={SubmissionStatus.ACCEPTED}>{SubmissionStatus.ACCEPTED}</SelectItem>
                  <SelectItem value={SubmissionStatus.REJECTED}>{SubmissionStatus.REJECTED}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Assignments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  {mockAssignments.map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.map((submission) => {
            const assignment = mockAssignments.find((a) => a.id === submission.assignmentId)
            const currentFeedback = feedback[submission.id] ?? submission.feedback ?? ""

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
                          {submission.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {submission.studentName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Submission Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Submission Details</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                            <a
                              href={submission.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {submission.submissionUrl}
                            </a>
                          </div>
                          {submission.note && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>Student Note:</strong> {submission.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Review Section */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                        <Select
                          value={submission.status}
                          onValueChange={(value: Submission["status"]) => updateSubmissionStatus(submission.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={SubmissionStatus.PENDING}>{SubmissionStatus.PENDING}</SelectItem>
                            <SelectItem value={SubmissionStatus.ACCEPTED}>{SubmissionStatus.ACCEPTED}</SelectItem>
                            <SelectItem value={SubmissionStatus.REJECTED}>{SubmissionStatus.REJECTED}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Feedback</label>
                        <Textarea
                          placeholder="Provide detailed feedback to help the student improve..."
                          value={currentFeedback}
                          onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveFeedback(submission.id)}
                          className="flex-1"
                          disabled={currentFeedback === (submission.feedback || "")}
                        >
                          Save Feedback
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFeedback((prev) => ({ ...prev, [submission.id]: submission.feedback || "" }))
                          }}
                          className="bg-transparent"
                          disabled={currentFeedback === (submission.feedback || "")}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MessageSquare className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || assignmentFilter !== "all"
                ? "Try adjusting your search terms or filters."
                : "No submissions have been made yet."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
