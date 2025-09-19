"use client"

import CreatePayment from "../../src/pages/CreatePayment"
import Layout from "../../src/components/Layout"
import { AuthProvider } from "../../src/contexts/AuthContext"

export default function CreatePaymentPage() {
  return (
    <AuthProvider>
      <Layout>
        <CreatePayment />
      </Layout>
    </AuthProvider>
  )
}
