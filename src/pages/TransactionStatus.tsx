"use client"

import type React from "react"
import { useState } from "react"
import { Search, CheckCircle, XCircle, Clock, Copy } from "lucide-react"
import { transactionAPI } from "../services/api"
import { format } from "date-fns"
import toast from "react-hot-toast"

interface TransactionDetails {
  collect_id: string
  custom_order_id: string
  status: string
  order_amount: number
  transaction_amount: number
  payment_mode: string
  payment_time: string
  payment_message: string
  gateway: string
  student_info: {
    name: string
    id: string
    email: string
  }
}

const TransactionStatus: React.FC = () => {
  const [customOrderId, setCustomOrderId] = useState("")
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customOrderId.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await transactionAPI.getStatus(customOrderId.trim())
      setTransaction(response.data.transaction)
    } catch (error: any) {
      if (error.response?.status === 404) {
        setTransaction(null)
        toast.error("Transaction not found")
      } else {
        toast.error("Failed to fetch transaction status")
      }
      console.error("Error fetching transaction status:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "failed":
        return <XCircle className="h-8 w-8 text-red-500" />
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-500" />
      default:
        return <Clock className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-600 bg-green-100"
      case "failed":
        return "text-red-600 bg-red-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Status</h1>
        <p className="text-gray-600">Check the status of any transaction using the order ID</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="customOrderId" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Order ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="customOrderId"
                type="text"
                value={customOrderId}
                onChange={(e) => setCustomOrderId(e.target.value)}
                placeholder="Enter custom order ID (e.g., ORD_1234567890_abc123)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !customOrderId.trim()}
            className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Check Status
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transaction Details */}
      {searched && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {transaction ? (
            <div className="p-6">
              {/* Status Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Order ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {transaction.custom_order_id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.custom_order_id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Order Amount</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">₹{transaction.order_amount}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Transaction Amount</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">₹{transaction.transaction_amount}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Payment Mode</label>
                    <p className="mt-1 text-sm text-gray-900">{transaction.payment_mode || "N/A"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Gateway</label>
                    <p className="mt-1 text-sm text-gray-900">{transaction.gateway}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Payment Time</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {transaction.payment_time
                        ? format(new Date(transaction.payment_time), "dd MMM yyyy, hh:mm a")
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Payment Message</label>
                    <p className="mt-1 text-sm text-gray-900">{transaction.payment_message || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{transaction.student_info.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Student ID</label>
                    <p className="mt-1 text-sm text-gray-900">{transaction.student_info.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{transaction.student_info.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Not Found</h3>
              <p className="text-gray-600">
                No transaction found with the order ID "{customOrderId}". Please check the order ID and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TransactionStatus
