"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Clock, CheckCircle, Info, Calendar, MessageSquare } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { mockAssignments, mockSubmissions } from "@/lib/mock-data"

interface Notification {
  id: string
  type: "deadline" | "feedback" | "grade" | "reminder" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
}

export function NotificationCenter() {
  const { currentUser } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Generate smart notifications
  useEffect(() => {
    const generateNotifications = (): Notification[] => {
      const notifs: Notification[] = []

      // Deadline reminders
      mockAssignments.forEach((assignment) => {
        const deadline = new Date(assignment.deadline)
        const now = new Date()
        const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntil <= 3 && daysUntil > 0) {
          const userSubmission = mockSubmissions.find(
            (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id,
          )

          if (!userSubmission && currentUser.role === "student") {
            notifs.push({
              id: `deadline-${assignment.id}`,
              type: "deadline",
              title: "Assignment Due Soon",
              message: `"${assignment.title}" is due in ${daysUntil} day${daysUntil > 1 ? "s" : ""}`,
              timestamp: new Date(Date.now() - Math.random() * 86400000),
              read: false,
              priority: daysUntil === 1 ? "high" : "medium",
              actionUrl: `/assignments/${assignment.id}/submit`,
            })
          }
        }
      })

      // Feedback notifications
      if (currentUser.role === "student") {
        mockSubmissions
          .filter((s) => s.studentId === currentUser.id && s.feedback)
          .forEach((submission) => {
            const assignment = mockAssignments.find((a) => a.id === submission.assignmentId)
            notifs.push({
              id: `feedback-${submission.id}`,
              type: "feedback",
              title: "New Feedback Received",
              message: `Your instructor provided feedback on "${assignment?.title}"`,
              timestamp: new Date(Date.now() - Math.random() * 172800000),
              read: Math.random() > 0.5,
              priority: "medium",
              actionUrl: "/my-submissions",
            })
          })
      }

      // New submissions for instructors
      if (currentUser.role === "instructor") {
        const pendingSubmissions = mockSubmissions.filter((s) => s.status === "pending")
        if (pendingSubmissions.length > 0) {
          notifs.push({
            id: "pending-reviews",
            type: "system",
            title: "Submissions Awaiting Review",
            message: `${pendingSubmissions.length} submissions need your review`,
            timestamp: new Date(Date.now() - Math.random() * 43200000),
            read: false,
            priority: "high",
            actionUrl: "/submissions",
          })
        }
      }

      // System notifications
      notifs.push({
        id: "system-update",
        type: "system",
        title: "New Features Available",
        message: "Check out the new analytics dashboard and enhanced grading tools",
        timestamp: new Date(Date.now() - 86400000),
        read: Math.random() > 0.3,
        priority: "low",
      })

      return notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }

    setNotifications(generateNotifications())
  }, [currentUser])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "deadline":
        return <Clock className="w-4 h-4" />
      case "feedback":
        return <MessageSquare className="w-4 h-4" />
      case "grade":
        return <CheckCircle className="w-4 h-4" />
      case "reminder":
        return <Calendar className="w-4 h-4" />
      case "system":
        return <Info className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button variant="ghost" size="sm" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden z-50">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>{unreadCount} unread</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-l-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-blue-50/50" : ""
                        } ${getPriorityColor(notification.priority)}`}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.timestamp.toLocaleDateString()} at{" "}
                              {notification.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
