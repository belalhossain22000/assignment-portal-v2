export enum UserRole {
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
}

export enum SubmissionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface Assignment {
  id: string
  title: string
  description: string
  deadline: Date
  maxPoints: number
  instructorId: string
  createdAt: Date
}

export interface Submission {
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
