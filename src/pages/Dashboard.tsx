"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, TrendingUp, Users, AlertCircle } from "lucide-react"
import TransactionTable from "../components/TransactionTable"
import { orderAPI } from "../services/api"
import toast from "react-hot-toast"

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
  })
  const [dummyDataCreated, setDummyDataCreated] = useState(false)

  const createDummyData = async () => {
    try {
      await orderAPI.createDummyData()
      toast.success("Dummy data created successfully!")
      setDummyDataCreated(true)
      // Refresh the page to show new data
      window.location.reload()
    } catch (error) {
      toast.error("Failed to create dummy data")
      console.error("Error creating dummy data:", error)
    }
  }

  const statCards = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      icon: CreditCard,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Successful Payments",
      value: stats.successfulPayments,
      icon: TrendingUp,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: Users,
      color: "bg-yellow-500",
      change: "-2%",
    },
    {
      title: "Failed Payments",
      value: stats.failedPayments,
      icon: AlertCircle,
      color: "bg-red-500",
      change: "+5%",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your school payment transactions</p>
        </div>
        <button
          onClick={createDummyData}
          disabled={dummyDataCreated}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {dummyDataCreated ? "Dummy Data Created" : "Create Dummy Data"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Transaction Table */}
      <TransactionTable />
    </div>
  )
}

export default Dashboard
