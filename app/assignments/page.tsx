"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Plus, Search, Filter, FileText, ArrowUpRight, Sparkles } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { mockAssignments, mockSubmissions } from "@/lib/mock-data"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { useGetAllAssignmentByInstructorQuery } from "@/redux/api/assignmentApi"

export default function Assignments() {
  const { currentUser } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")

  const {data,isLoading}=useGetAllAssignmentByInstructorQuery({})
  console.log(data?.data?.assignments);

  const getUserSubmission = (assignmentId: string) => {
    return mockSubmissions.find((s) => s.assignmentId === assignmentId && s.studentId === currentUser?.id)
  }

  // Filter and sort assignments
  const filteredAssignments = data?.data?.assignments
    .filter((assignment:any) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      if (currentUser?.role === "STUDENT" && statusFilter !== "all") {
        const userSubmission = getUserSubmission(assignment.id)
        if (statusFilter === "submitted") return !!userSubmission
        if (statusFilter === "not-submitted") return !userSubmission
        if (statusFilter === "overdue") return new Date(assignment.deadline) < new Date() && !userSubmission
      }

      return true
    })
    .sort((a:any, b:any) => {
      if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "created") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return 0
    })

    if(isLoading){
      return <div>Loading...</div>
    }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {currentUser?.role === "INSTRUCTOR" ? "Manage Assignments" : "Browse Assignments"}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                  Assignments
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  {currentUser?.role === "INSTRUCTOR"
                    ? "Create, manage, and track your assignments with powerful tools and analytics."
                    : "Discover assignments, track deadlines, and submit your work with ease."}
                </p>
              </div>
              {currentUser?.role === "INSTRUCTOR" && (
                <Link href="/assignments/create">
                  <Button className="mt-6 lg:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 px-6 py-3">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Assignment
                  </Button>
                </Link>
              )}
            </div>

            {/* Modern Filters */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search assignments by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 bg-white/60 backdrop-blur-sm border-white/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {currentUser?.role === "STUDENT" && (
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full lg:w-56 h-12 bg-white/60 backdrop-blur-sm border-white/20">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                        <SelectItem value="all">All Assignments</SelectItem>
                        <SelectItem value="not-submitted">Not Submitted</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48 h-12 bg-white/60 backdrop-blur-sm border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                      <SelectItem value="deadline">By Deadline</SelectItem>
                      <SelectItem value="title">By Title</SelectItem>
                      <SelectItem value="created">By Created Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAssignments.map((assignment:any) => {
              const userSubmission = getUserSubmission(assignment.id)
              const isOverdue = new Date(assignment.deadline) < new Date()
              const assignmentSubmissions = mockSubmissions.filter((s) => s.assignmentId === assignment.id)
              const daysUntilDeadline = Math.ceil(
                (new Date(assignment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card
                  key={assignment.id}
                  className="group relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {assignment.title}
                      </CardTitle>
                      <div className="flex flex-col gap-2 ml-3">
                        {isOverdue && (
                          <Badge variant="destructive" className="shadow-sm whitespace-nowrap">
                            Overdue
                          </Badge>
                        )}
                        {!isOverdue && daysUntilDeadline <= 3 && daysUntilDeadline > 0 && (
                          <Badge
                            variant="secondary"
                            className="shadow-sm whitespace-nowrap bg-yellow-100 text-yellow-800"
                          >
                            Due Soon
                          </Badge>
                        )}
                        {currentUser?.role === "INSTRUCTOR" && userSubmission && (
                          <Badge
                            variant={
                              userSubmission.status === "ACCEPTED"
                                ? "default"
                                : userSubmission.status === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="shadow-sm whitespace-nowrap"
                          >
                            {userSubmission.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed">
                      {assignment.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-3 text-blue-500" />
                        <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-3 text-blue-500" />
                        <span className={isOverdue ? "text-red-600 font-semibold" : "text-gray-600"}>
                          Due: {new Date(assignment.deadline).toLocaleDateString()}
                          {!isOverdue && daysUntilDeadline >= 0 && (
                            <span className="ml-2 text-gray-500 font-normal">
                              ({daysUntilDeadline === 0 ? "Today" : `${daysUntilDeadline} days left`})
                            </span>
                          )}
                        </span>
                      </div>

                      {currentUser?.role === "INSTRUCTOR" && (
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-4 h-4 mr-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-xs text-white font-bold">{assignment?.submissions?.length}</span>
                          </div>
                          <span>{assignment?.submissions?.length} submissions</span>
                        </div>
                      )}

                      {currentUser?.role === "STUDENT" && userSubmission && userSubmission.feedback && (
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <p className="text-sm text-blue-900">
                            <strong className="text-blue-700">Feedback:</strong> {userSubmission.feedback}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {currentUser?.role === "STUDENT" && (
                        <>
                          {userSubmission ? (
                            <Button variant="outline" className="flex-1 bg-white/60 backdrop-blur-sm" disabled>
                              Already Submitted
                            </Button>
                          ) : (
                            <Link href={`/assignments/${assignment.id}/submit`} className="flex-1">
                              <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                                disabled={isOverdue}
                              >
                                {isOverdue ? "Submission Closed" : "Submit Assignment"}
                                {!isOverdue && <ArrowUpRight className="w-4 h-4 ml-2" />}
                              </Button>
                            </Link>
                          )}
                        </>
                      )}

                      {currentUser?.role === "INSTRUCTOR" && (
                        <>
                          <Link href={`/assignments/${assignment.id}/edit`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full bg-white/60 backdrop-blur-sm hover:bg-white shadow-sm"
                            >
                              Edit
                            </Button>
                          </Link>
                          <Link href={`/assignments/${assignment.id}/review`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                              Review ({assignmentSubmissions.length})
                              <ArrowUpRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No assignments found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "No assignments are available at the moment. Check back later!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
