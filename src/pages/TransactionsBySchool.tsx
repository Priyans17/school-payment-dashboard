"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, ArrowLeft, School, Database, Copy, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { transactionAPI } from "../services/api"
import toast from "react-hot-toast"
import Link from "next/link"

interface Transaction {
  collect_id: string
  custom_order_id: string
  status: string
  order_amount: number
  transaction_amount: number
  payment_mode: string
  payment_time: string
  student_info: {
    name: string
    id: string
    email: string
  }
  createdAt: string
  school_id: string
  gateway: string
}

const TransactionsBySchool: React.FC = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Mock school data - in real app, this would come from API
  const schools = [
    { id: "65b0e6293e9f76a9694d84b4", name: "EDV DEMO SCHOOL" },
    { id: "65b0e6293e9f76a9694d84b5", name: "Kotak Oceanus School" },
    { id: "65b0e6293e9f76a9694d84b6", name: "Delhi Public School" },
    { id: "65b0e6293e9f76a9694d84b7", name: "Ryan International School" },
  ]

  const filteredSchools = schools.filter((school) => school.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Load transactions when school is selected
  useEffect(() => {
    if (selectedSchoolId) {
      loadTransactions()
    }
  }, [selectedSchoolId, currentPage, rowsPerPage, sortField, sortDirection])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await transactionAPI.getBySchool(selectedSchoolId, {
        page: currentPage,
        limit: rowsPerPage
      })
      setTransactions(response.data.data || [])
    } catch (err: any) {
      setError("Failed to load transactions")
      console.error("Error loading transactions:", err)
      toast.error("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
          <h1 className="text-3xl font-bold text-white">Transactions by School</h1>
          <p className="mt-1 text-sm text-gray-400">View transactions for a specific school</p>
        </div>
      </div>

      {/* School Selection */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Select School</h2>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSelectedSchoolId(school.id)}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  selectedSchoolId === school.id
                    ? "border-blue-500 bg-blue-900 text-blue-200"
                    : "border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                <h3 className="font-medium">{school.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mt-1">ID: {school.id}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      {selectedSchoolId && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium text-white">
              Transactions for {schools.find((s) => s.id === selectedSchoolId)?.name}
            </h2>
            <p className="mt-1 text-sm text-gray-400">All transactions for the selected school</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Error Loading Data</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={loadTransactions}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
              <p className="text-gray-400">No transactions found for this school.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Sr.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Edviron Order ID
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                      onClick={() => handleSort("order_amount")}
                    >
                      <div className="flex items-center gap-1">
                        Order Amt
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Transaction Amt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Phone No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Gateway
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {transactions.map((transaction, index) => (
                    <tr 
                      key={transaction.collect_id} 
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="flex items-center gap-2">
                          <span>N/A</span>
                          <button
                            onClick={() => copyToClipboard("N/A")}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            title="Copy Order ID"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{transaction.custom_order_id}</span>
                          <button
                            onClick={() => copyToClipboard(transaction.custom_order_id)}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            title="Copy Edviron Order ID"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ₹{transaction.order_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ₹{transaction.transaction_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {transaction.payment_mode || "NA"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {transaction.student_info.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {transaction.student_info.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {transaction.student_info.email || "0000000000"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {transaction.gateway || "NA"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TransactionsBySchool