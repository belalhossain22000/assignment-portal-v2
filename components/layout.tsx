"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, FileText, BarChart3, Bell, Menu, User, LogOut, Settings, Home, RefreshCw } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { UserRole } from "@/lib/types"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Assignments", href: "/assignments", icon: BookOpen },
  { name: "Submissions", href: "/submissions", icon: FileText, instructorOnly: true },
  { name: "My Submissions", href: "/my-submissions", icon: FileText, studentOnly: true },
  { name: "Analytics", href: "/analytics", icon: BarChart3, instructorOnly: true },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, switchRole } = useUser()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!currentUser) {
    return <div>Loading...</div>
  }

  const filteredNavigation = navigation.filter((item) => {
    if (item.instructorOnly && currentUser.role !== UserRole.INSTRUCTOR) return false
    if (item.studentOnly && currentUser.role !== UserRole.STUDENT) return false
    return true
  })

  const handleRoleSwitch = () => {
    const newRole = currentUser.role === UserRole.INSTRUCTOR ? UserRole.STUDENT : UserRole.INSTRUCTOR
    switchRole(newRole)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Assignment Portal</span>
          </div>

          {/* Role Switcher - Demo Only
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2">Demo Mode - Switch Role:</p>
            <Button
              onClick={handleRoleSwitch}
              variant="outline"
              size="sm"
              className="w-full bg-white hover:bg-blue-50 border-blue-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Switch to {currentUser.role === UserRole.INSTRUCTOR ? "Student" : "Instructor"}
            </Button>
          </div> */}

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          }`}
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex h-16 shrink-0 items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Assignment Portal</span>
          </div>

          {/* Mobile Role Switcher */}
          {/* <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
            <p className="text-sm text-blue-700 mb-2">Demo Mode - Switch Role:</p>
            <Button
              onClick={handleRoleSwitch}
              variant="outline"
              size="sm"
              className="w-full bg-white hover:bg-blue-50 border-blue-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Switch to {currentUser.role === UserRole.INSTRUCTOR ? "Student" : "Instructor"}
            </Button>
          </div> */}

          <nav className="flex flex-1 flex-col mt-8">
            <ul role="list" className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                        isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge
                  variant={currentUser.role === UserRole.INSTRUCTOR ? "default" : "secondary"}
                  className="hidden sm:inline-flex"
                >
                  {currentUser.role === UserRole.INSTRUCTOR ? "Instructor" : "Student"}
                </Badge>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Notifications */}
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">{currentUser.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
