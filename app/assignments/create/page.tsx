"use client"

import type React from "react"
import { Toaster, toast } from 'sonner';
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Layout } from "@/components/layout"
import { useUser } from "@/lib/user-context"
import { UserRole } from "@/lib/types"
import Link from "next/link"
import { useCrateAssignmentMutation } from "@/redux/api/assignmentApi"

export default function CreateAssignmentPage() {
  const { currentUser } = useUser()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [maxPoints, setMaxPoints] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createAssignmentFn] = useCrateAssignmentMutation()

  // Redirect if not instructor
  if (!currentUser || currentUser.role !== UserRole.INSTRUCTOR) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only instructors can create assignments.</p>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    )
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const res = await createAssignmentFn({
      title,
      description,
      deadline: deadline,
      instructorId: currentUser.id,
    })

    // Check if the response indicates success
    if (res.data?.success) {
      toast.success("Assignment created successfully!")
      router.push("/assignments")
    } else {
      // Handle known API error (e.g. validation, bad request)
      const errorMessage = res.data?.message || "Failed to create assignment"
      toast.error(errorMessage)
    }
  } catch (error: unknown) {
    // Handle unexpected errors (network failure, server down, etc.)
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Create assignment error:", error)
    toast.error(`Failed to create assignment: ${errorMessage}`)
  } finally {
    setIsSubmitting(false)
  }
}



  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
         <Toaster />
        {/* Header */}
        <div className="mb-8">
          <Link href="/assignments" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Assignments
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Assignment</h1>
          <p className="text-gray-600 mt-2">Set up a new assignment for your students.</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Fill in the information for your new assignment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the assignment requirements and objectives"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxPoints">Maximum Points</Label>
                  <Input
                    id="maxPoints"
                    type="number"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(e.target.value)}
                    placeholder="100"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Creating..." : "Create Assignment"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
