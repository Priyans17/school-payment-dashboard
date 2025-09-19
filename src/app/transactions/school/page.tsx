"use client"

import TransactionsBySchool from "../../../src/pages/TransactionsBySchool"
import Layout from "../../../src/components/Layout"
import { AuthProvider } from "../../../src/contexts/AuthContext"

export default function TransactionsBySchoolPage() {
  return (
    <AuthProvider>
      <Layout>
        <TransactionsBySchool />
      </Layout>
    </AuthProvider>
  )
}
