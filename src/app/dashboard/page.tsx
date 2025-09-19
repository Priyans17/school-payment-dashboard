"use client"

import Dashboard from "../../src/pages/Dashboard"
import Layout from "../../src/components/Layout"
import { AuthProvider } from "../../src/contexts/AuthContext"

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AuthProvider>
  )
}
