"use client"

import CreatePayment from "../../src/pages/CreatePayment"
import Layout from "../../src/components/Layout"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function CreatePaymentPage() {
  return (
    <Layout>
      <CreatePayment />
    </Layout>
  )
}
