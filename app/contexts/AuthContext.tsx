"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "../../src/services/api"
import toast from "react-hot-toast"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token, user: userData } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      toast.success("Login successful!")
      // Use router.push instead of window.location.href
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      const message = error.response?.data?.message || "Login failed. Please check your credentials."
      toast.error(message)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register({ email, password, name })
      const { token, user: userData } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      toast.success("Registration successful!")
      // Use router.push instead of window.location.href
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      const message = error.response?.data?.message || "Registration failed. Please try again."
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    toast.success("Logged out successfully!")
    // Use router.push instead of window.location.href
    router.push("/login")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
