"use client"

import type React from "react"
import { useState } from "react"
import { Search, CheckCircle, XCircle, Clock, Copy, ArrowLeft } from "lucide-react"
import { paymentAPI } from "../services/api"
import { format } from "date-fns"
import toast from "react-hot-toast"
import Link from "next/link"

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
  student_info?: {
    name: string
    id: string
    email: string
  }
}

const TransactionStatus: React.FC = () => {
  const [collectRequestId, setCollectRequestId] = useState("")
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!collectRequestId.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await paymentAPI.checkStatus(collectRequestId.trim())
      setTransaction(response.data.data)
      toast.success("Transaction found!")
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
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Check Transaction Status</h1>
          <p className="mt-1 text-sm text-gray-400">Check the status of any transaction using the collect request ID</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="collectRequestId" className="block text-sm font-medium text-gray-300 mb-2">
              Collect Request ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="collectRequestId"
                type="text"
                value={collectRequestId}
                onChange={(e) => setCollectRequestId(e.target.value)}
                placeholder="Enter collect request ID"
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="schoolId" className="block text-sm font-medium text-gray-300 mb-2">
              School ID
            </label>
            <input
              id="schoolId"
              type="text"
              value={process.env.NEXT_PUBLIC_SCHOOL_ID || "65b0e6293e9f76a9694d84b4"}
              disabled
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-300 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">Pre-filled from environment variable</p>
          </div>

          <button
            type="submit"
            disabled={loading || !collectRequestId.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="h-4 w-4 mr-2" />
                Check Status
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Transaction Details */}
      {searched && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
          {transaction ? (
            <div className="p-6">
              {/* Status Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getStatusIcon(transaction.status || "pending")}
                  <div>
                    <h2 className="text-xl font-semibold text-white">Transaction Details</h2>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status || "pending")}`}
                    >
                      {(transaction.status || "pending").charAt(0).toUpperCase() + (transaction.status || "pending").slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Order ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded text-white">
                        {transaction.custom_order_id || "N/A"}
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.custom_order_id || "")}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Order Amount</label>
                    <p className="mt-1 text-lg font-semibold text-white">₹{transaction.order_amount || 0}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Transaction Amount</label>
                    <p className="mt-1 text-lg font-semibold text-white">₹{transaction.transaction_amount || 0}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Payment Mode</label>
                    <p className="mt-1 text-sm text-white">{transaction.payment_mode || "N/A"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Gateway</label>
                    <p className="mt-1 text-sm text-white">{transaction.gateway || "N/A"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Payment Time</label>
                    <p className="mt-1 text-sm text-white">
                      {transaction.payment_time
                        ? format(new Date(transaction.payment_time), "dd MMM yyyy, hh:mm a")
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400">Payment Message</label>
                    <p className="mt-1 text-sm text-white">{transaction.payment_message || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Name</label>
                    <p className="mt-1 text-sm text-white">{transaction.student_info?.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Student ID</label>
                    <p className="mt-1 text-sm text-white">{transaction.student_info?.id || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email</label>
                    <p className="mt-1 text-sm text-white">{transaction.student_info?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Transaction Not Found</h3>
              <p className="text-gray-400">
                No transaction found with the collect request ID "{collectRequestId}". Please check the collect request ID and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TransactionStatus