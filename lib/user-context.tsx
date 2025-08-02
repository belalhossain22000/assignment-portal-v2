"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, UserRole } from "./types"
import { mockUsers } from "./mock-data"
import { useDispatch } from "react-redux"
import { logout as logoutFn } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation"



interface UserContextType {
  currentUser: User | null
  login: (user: any) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  switchRole: (role: UserRole) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    // Check for stored user session on app load
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (user: any) => {
    setIsLoading(true)


    if (user) {
      setCurrentUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return {
      success: false,
      error: "Invalid email address. Try: sarah.johnson@university.edu (instructor) or alex.chen@student.edu (student)",
    }
  }

  const logout = () => {
    dispatch(logoutFn())
    setCurrentUser(null)
    router.push("/auth/login")
    localStorage.removeItem("currentUser")
  }

  const switchRole = (role: UserRole) => {
    const newUser = mockUsers.find((u) => u.role === role)
    if (newUser) {
      setCurrentUser(newUser)
      localStorage.setItem("currentUser", JSON.stringify(newUser))
    }
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isLoading,
        switchRole,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
