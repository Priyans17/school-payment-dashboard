"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TransactionTable from "./TransactionTable"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.reload()
  }

  const navigateToCreatePayment = () => {
    router.push("/create-payment")
  }

  const navigateToTransactionStatus = () => {
    router.push("/transaction-status")
  }

  const navigateToSchoolTransactions = () => {
    router.push("/transactions/school")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">School Payment Dashboard</h1>
              {user && <p className="text-sm text-gray-600">Welcome back, {user.name}</p>}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={navigateToCreatePayment}>
                Create Payment
              </Button>
              <Button variant="outline" onClick={navigateToTransactionStatus}>
                Check Status
              </Button>
              <Button variant="outline" onClick={navigateToSchoolTransactions}>
                School Transactions
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
