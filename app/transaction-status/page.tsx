"use client"

import TransactionStatus from "../../src/pages/TransactionStatus"
import Layout from "../../src/components/Layout"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function TransactionStatusPage() {
  return (
    <Layout>
      <TransactionStatus />
    </Layout>
  )
}
