"use client"

import TransactionsBySchool from "../../../src/pages/TransactionsBySchool"
import Layout from "../../../src/components/Layout"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function TransactionsBySchoolPage() {
  return (
    <Layout>
      <TransactionsBySchool />
    </Layout>
  )
}
