"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Layout from "./Layout"
import { AuthProvider, useAuth } from "../../app/contexts/AuthContext"
import api from "../services/api"

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null)

  useEffect(() => {
    // ping backend health and reflect globally
    api
      .get("/health")
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false))
  }, [])

  useEffect(() => {
    if (!loading && !user && pathname !== "/login" && pathname !== "/register") {
      router.push("/login")
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!user && pathname !== "/login" && pathname !== "/register") {
    return null
  }

  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>
  }

  return (
    <Layout>
      {apiHealthy === false && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-red-600 text-white px-3 py-2 shadow">
          Backend unreachable
        </div>
      )}
      {children}
    </Layout>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  )
}
