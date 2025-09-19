"use client"

import TransactionStatus from "../../src/pages/TransactionStatus"
import Layout from "../../src/components/Layout"
import { AuthProvider } from "../../src/contexts/AuthContext"

export default function TransactionStatusPage() {
  return (
    <AuthProvider>
      <Layout>
        <TransactionStatus />
      </Layout>
    </AuthProvider>
  )
}
