"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, FileText, LinkIcon } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { mockAssignments, mockSubmissions } from "@/lib/mock-data"
import { UserRole } from "@/lib/types"

export default function SubmitAssignment() {
  const { currentUser } = useUser()
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id as string

  const [submissionUrl, setSubmissionUrl] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const assignment = mockAssignments.find((a) => a.id === assignmentId)
  const existingSubmission = mockSubmissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === currentUser?.id,
  )

  if (currentUser?.role !== UserRole.STUDENT) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center p-8">
            <div className="text-red-500 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">Only students can submit assignments.</p>
            <Button onClick={() => router.push("/assignments")}>Back to Assignments</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center p-8">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Assignment Not Found</h1>
            <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/assignments")}>Back to Assignments</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOverdue = new Date(assignment.deadline) < new Date()
  const daysUntilDeadline = Math.ceil(
    (new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/assignments")
      }, 2500)
    }, 2000)
  }

  if (existingSubmission) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push("/assignments")} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assignment Already Submitted</h1>
            <p className="text-gray-600 mt-1">You have already submitted this assignment</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {assignment.title}
              <Badge
                variant={
                  existingSubmission.status === "ACCEPTED"
                    ? "default"
                    : existingSubmission.status === "REJECTED"
                      ? "destructive"
                      : "secondary"
                }
              >
                {existingSubmission.status}
              </Badge>
            </CardTitle>
            <CardDescription>
              Submitted on {new Date(existingSubmission.submittedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Your Submission:</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  <a
                    href={existingSubmission.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {existingSubmission.submissionUrl}
                  </a>
                </div>
                {existingSubmission.note && (
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> {existingSubmission.note}
                  </p>
                )}
              </div>
            </div>

            {existingSubmission.feedback && (
              <div>
                <h4 className="font-medium mb-2">Instructor Feedback:</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900">{existingSubmission.feedback}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => router.push("/assignments")} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assignments
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit Assignment</h1>
          <p className="text-gray-600 mt-1">Submit your work for review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {/* Assignment Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {assignment.title}
                {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                {!isOverdue && daysUntilDeadline <= 3 && daysUntilDeadline > 0 && (
                  <Badge variant="secondary">Due Soon</Badge>
                )}
              </CardTitle>
              <CardDescription>{assignment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-600"}>
                  Due: {new Date(assignment.deadline).toLocaleDateString()}
                  {!isOverdue && daysUntilDeadline >= 0 && (
                    <span className="ml-2 text-gray-500">
                      ({daysUntilDeadline === 0 ? "Today" : `${daysUntilDeadline} days left`})
                    </span>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Submit Your Work
              </CardTitle>
              <CardDescription>Provide your submission details and any additional notes</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Assignment submitted successfully! Redirecting to assignments page...
                  </AlertDescription>
                </Alert>
              )}

              {isOverdue && !success && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This assignment is overdue. Late submissions may receive reduced credit or may not be accepted.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="submissionUrl" className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-1" />
                    Submission URL *
                  </Label>
                  <Input
                    id="submissionUrl"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/username/project or https://drive.google.com/..."
                    required
                    disabled={isSubmitting || success}
                  />
                  <p className="text-sm text-gray-500">
                    Provide a link to your GitHub repository, Google Drive file, or other online resource where your
                    work can be accessed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Additional Notes (Optional)</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any additional information about your submission, challenges faced, or features implemented..."
                    rows={5}
                    disabled={isSubmitting || success}
                  />
                  <p className="text-sm text-gray-500">
                    Use this space to highlight key features, explain your approach, or mention any issues you
                    encountered.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isSubmitting || success} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Assignment...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Assignment Submitted!
                      </>
                    ) : (
                      "Submit Assignment"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/assignments")}
                    disabled={isSubmitting}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submission Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Accepted Formats:</strong> GitHub repositories, Google Drive links, Dropbox, or other cloud
                storage links.
              </div>
              <div>
                <strong>Make it Accessible:</strong> Ensure your instructor can access your submission without special
                permissions.
              </div>
              <div>
                <strong>Include Documentation:</strong> Add a README file explaining how to run or view your project.
              </div>
              <div>
                <strong>Test Your Link:</strong> Verify your submission URL works before submitting.
              </div>
            </CardContent>
          </Card>

          {/* Deadline Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Deadline Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <span className="font-semibold">{new Date(assignment.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time Remaining:</span>
                  <span
                    className={`font-semibold ${isOverdue ? "text-red-600" : daysUntilDeadline <= 3 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {isOverdue ? "Overdue" : daysUntilDeadline === 0 ? "Due Today" : `${daysUntilDeadline} days`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Technical Issues:</strong> Contact your instructor if you're having trouble with the submission
                process.
              </div>
              <div>
                <strong>Assignment Questions:</strong> Review the assignment description or ask for clarification during
                office hours.
              </div>
              <div>
                <strong>Late Submissions:</strong> Check your course policy regarding late submission penalties.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
