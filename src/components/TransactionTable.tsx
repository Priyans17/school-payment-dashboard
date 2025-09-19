"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronUp, ChevronDown, Copy, Filter, Download } from "lucide-react"
import { transactionAPI } from "../services/api"
import toast from "react-hot-toast"

interface Transaction {
  collect_id: string
  school_id: string
  gateway: string
  order_amount: number
  transaction_amount: number
  status: string
  custom_order_id: string
  student_name: string
  student_id: string
  student_email: string
  payment_mode: string
  payment_time: string
  bank_reference: string
  payment_message: string
  createdAt: string
}

interface TransactionTableProps {
  schoolId?: string
}

const TransactionTable: React.FC<TransactionTableProps> = ({ schoolId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  })
  const [filters, setFilters] = useState({
    status: "",
    gateway: "",
    sort: "createdAt",
    order: "desc",
  })
  const [searchTerm, setSearchTerm] = useState("")

  const statusOptions = ["success", "pending", "failed"]
  const gatewayOptions = ["PhonePe", "Paytm", "Razorpay", "Edviron"]

  useEffect(() => {
    fetchTransactions()
  }, [pagination.current_page, filters, schoolId])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        sort: filters.sort,
        order: filters.order,
      }

      const response = schoolId
        ? await transactionAPI.getBySchool(schoolId, params)
        : await transactionAPI.getAll(params)

      setTransactions(response.data.transactions)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error("Failed to fetch transactions")
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: field,
      order: prev.sort === field && prev.order === "desc" ? "asc" : "desc",
    }))
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, current_page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current_page: page }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "status-badge"
    switch (status.toLowerCase()) {
      case "success":
        return `${baseClasses} status-success`
      case "pending":
        return `${baseClasses} status-pending`
      case "failed":
        return `${baseClasses} status-failed`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.custom_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.student_email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const SortIcon = ({ field }: { field: string }) => {
    if (filters.sort !== field) return null
    return filters.order === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">History</h2>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Filter By</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Date</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.gateway}
            onChange={(e) => handleFilterChange("gateway", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Filter</option>
            {gatewayOptions.map((gateway) => (
              <option key={gateway} value={gateway}>
                {gateway}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={pagination.per_page}
              onChange={(e) =>
                setPagination((prev) => ({ ...prev, per_page: Number.parseInt(e.target.value), current_page: 1 }))
              }
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No</th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("student_name")}
              >
                <div className="flex items-center gap-1">
                  Institute Name
                  <SortIcon field="student_name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Date & Time
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edviron Order ID
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("order_amount")}
              >
                <div className="flex items-center gap-1">
                  Order Amt
                  <SortIcon field="order_amount" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("transaction_amount")}
              >
                <div className="flex items-center gap-1">
                  Transaction Amt
                  <SortIcon field="transaction_amount" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gateway
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capture Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={15} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner"></div>
                    <span className="ml-2 text-gray-500">Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={15} className="px-6 py-12 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <tr key={transaction.collect_id} className="table-hover-effect">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(pagination.current_page - 1) * pagination.per_page + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.student_name || "kotak oceanus"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.createdAt ? format(new Date(transaction.createdAt), "dd/M/yyyy, h:mm a") : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>N/A</span>
                      <button onClick={() => copyToClipboard("N/A")} className="text-gray-400 hover:text-gray-600">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{transaction.custom_order_id}</span>
                      <button
                        onClick={() => copyToClipboard(transaction.custom_order_id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{transaction.order_amount || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{transaction.transaction_amount || transaction.order_amount || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.payment_mode || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {transaction.student_name || "test name"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {transaction.student_id || "s123456"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0000000000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.gateway || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredTransactions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded ${
                    pagination.current_page === page
                      ? "bg-primary-600 text-white border-primary-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionTable
