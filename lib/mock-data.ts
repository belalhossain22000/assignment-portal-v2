import { type User, type Assignment, type Submission, UserRole, SubmissionStatus } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: UserRole.INSTRUCTOR,
  },
  {
    id: "2",
    name: "Alex Chen",
    email: "alex.chen@student.edu",
    role: UserRole.STUDENT,
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@student.edu",
    role: UserRole.STUDENT,
  },
  {
    id: "4",
    name: "John Smith",
    email: "john.smith@student.edu",
    role: UserRole.STUDENT,
  },
]

export const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Build a simple React application demonstrating component lifecycle and state management.",
    deadline: new Date("2024-03-15"),
    maxPoints: 100,
    instructorId: "1",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "2",
    title: "Database Design Project",
    description: "Design and implement a normalized database schema for an e-commerce application.",
    deadline: new Date("2024-03-22"),
    maxPoints: 150,
    instructorId: "1",
    createdAt: new Date("2024-02-08"),
  },
  {
    id: "3",
    title: "API Development",
    description: "Create a RESTful API using Node.js and Express with proper authentication.",
    deadline: new Date("2024-04-01"),
    maxPoints: 120,
    instructorId: "1",
    createdAt: new Date("2024-02-15"),
  },
]

export const mockSubmissions: Submission[] = [
  {
    id: "1",
    assignmentId: "1",
    studentId: "2",
    studentName: "Alex Chen",
    submissionUrl: "https://github.com/alexchen/react-fundamentals",
    submittedAt: new Date("2024-03-10"),
    status: SubmissionStatus.ACCEPTED,
    feedback: "Excellent work! Your component structure is clean and well-organized.",
    grade: 95,
    note: "Implemented all required features with bonus animations.",
  },
  {
    id: "2",
    assignmentId: "1",
    studentId: "3",
    studentName: "Maria Rodriguez",
    submissionUrl: "https://github.com/maria/react-project",
    submittedAt: new Date("2024-03-12"),
    status: SubmissionStatus.PENDING,
    note: "Complete React application with state management.",
  },
  {
    id: "3",
    assignmentId: "2",
    studentId: "2",
    studentName: "Alex Chen",
    submissionUrl: "https://github.com/alexchen/database-design",
    submittedAt: new Date("2024-03-18"),
    status: SubmissionStatus.REJECTED,
    feedback: "Good start, but the normalization needs improvement. Please review 3NF principles.",
    grade: 65,
    note: "Database schema with ER diagram and sample data.",
  },
  {
    id: "4",
    assignmentId: "2",
    studentId: "4",
    studentName: "John Smith",
    submissionUrl: "https://github.com/johnsmith/ecommerce-db",
    submittedAt: new Date("2024-03-20"),
    status: SubmissionStatus.ACCEPTED,
    feedback: "Well-designed schema with proper relationships and constraints.",
    grade: 88,
    note: "Comprehensive database design with documentation.",
  },
]
