"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Plus,
  Database,
  Calendar,
  CreditCard,
  User,
  Building,
  Phone,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  srNo: number
  instituteName: string
  dateTime: string
  orderId: string
  edvironOrderId: string
  orderAmount: number
  transactionAmount: number
  paymentMethod: string
  status: "success" | "pending" | "failed"
  studentName: string
  studentId: string
  phoneNumber: string
  vendorAmount: number
  gateway: string
  captureStatus: string
  createdAt: string
  email?: string
}

const generateMockTransactions = (): Transaction[] => {
  const institutes = [
    "Delhi Public School",
    "St. Mary's School",
    "Kendriya Vidyalaya",
    "DAV Public School",
    "Ryan International",
  ]
  const paymentMethods = ["UPI", "Card", "Net Banking", "Wallet"]
  const statuses: ("success" | "pending" | "failed")[] = ["success", "pending", "failed"]
  const gateways = ["Razorpay", "Payu", "CCAvenue", "Instamojo", "Cashfree"]
  const students = [
    { name: "Rohan Sharma", id: "STU001", phone: "9876543210" },
    { name: "Priya Patel", id: "STU002", phone: "9876543211" },
    { name: "Arjun Singh", id: "STU003", phone: "9876543212" },
    { name: "Sneha Gupta", id: "STU004", phone: "9876543213" },
    { name: "Vikram Kumar", id: "STU005", phone: "9876543214" },
  ]

  return Array.from({ length: 50 }, (_, index) => {
    const student = students[Math.floor(Math.random() * students.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const orderAmount = Math.floor(Math.random() * 10000) + 1000
    const transactionAmount = orderAmount - Math.floor(Math.random() * 100)
    const vendorAmount = transactionAmount - Math.floor(Math.random() * 50)

    return {
      id: `TXN${String(index + 1).padStart(6, "0")}`,
      srNo: index + 1,
      instituteName: institutes[Math.floor(Math.random() * institutes.length)],
      dateTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      orderId: `ORD${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      edvironOrderId: `EDV${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      orderAmount,
      transactionAmount,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status,
      studentName: student.name,
      studentId: student.id,
      phoneNumber: student.phone,
      vendorAmount,
      gateway: gateways[Math.floor(Math.random() * gateways.length)],
      captureStatus: status === "success" ? "Captured" : status === "pending" ? "Pending" : "Failed",
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      email: `${student.name.toLowerCase().replace(" ", ".")}@email.com`,
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const Dashboard: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Simulate API call delay
    setTimeout(() => {
      setTransactions(generateMockTransactions())
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.edvironOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const transactionDate = new Date(transaction.createdAt)
      const now = new Date()

      switch (dateFilter) {
        case "today":
          matchesDate = transactionDate.toDateString() === now.toDateString()
          break
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = transactionDate >= weekAgo
          break
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = transactionDate >= monthAgo
          break
      }
    }

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue: any = a[sortField as keyof Transaction]
    let bValue: any = b[sortField as keyof Transaction]

    if (sortField === "createdAt" || sortField === "dateTime") {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
      console.log("Copied to clipboard:", text)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const exportData = () => {
    const csvContent = [
      // CSV headers
      [
        "Sr.No",
        "Institute Name",
        "Date & Time",
        "Order ID",
        "Edviron Order ID",
        "Order Amount",
        "Transaction Amount",
        "Payment Method",
        "Status",
        "Student Name",
        "Student ID",
        "Phone Number",
        "Vendor Amount",
        "Gateway",
        "Capture Status",
      ].join(","),
      // CSV data
      ...sortedTransactions.map((transaction) =>
        [
          transaction.srNo,
          transaction.instituteName,
          formatDate(transaction.createdAt),
          transaction.orderId,
          transaction.edvironOrderId,
          transaction.orderAmount,
          transaction.transactionAmount,
          transaction.paymentMethod,
          transaction.status,
          transaction.studentName,
          transaction.studentId,
          transaction.phoneNumber,
          transaction.vendorAmount,
          transaction.gateway,
          transaction.captureStatus,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-3 w-3" />
      case "failed":
        return <XCircle className="h-3 w-3" />
      case "pending":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

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

  const retryLoadData = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setTransactions(generateMockTransactions())
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Payment Dashboard</h1>
                {user && <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Payment Dashboard</h1>
                {user && <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Data</h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <Button onClick={retryLoadData} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Payment Dashboard</h1>
              {user && <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>}
            </div>
            <div className="flex items-center space-x-4">
            
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">History</CardTitle>
                <CardDescription>Complete transaction records and payment history</CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={exportData} className="bg-gray-600 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Student Name, or Student ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>

                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Methods</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Wallet">Wallet</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rows:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {paginatedTransactions.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <Database className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter !== "all" || paymentMethodFilter !== "all" || dateFilter !== "all"
                      ? "No transactions match your current filters. Try adjusting your search criteria."
                      : "No transactions have been created yet."}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sr. No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Institute Name
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center gap-1">
                          Date & Time
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Edviron Order ID
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort("orderAmount")}
                      >
                        <div className="flex items-center gap-1">
                          Order Amount
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Transaction Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Vendor Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Gateway
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Capture Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedTransactions.map((transaction, index) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            {transaction.instituteName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(transaction.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{transaction.orderId}</span>
                            <button
                              onClick={() => copyToClipboard(transaction.orderId)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              title="Copy Order ID"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{transaction.edvironOrderId}</span>
                            <button
                              onClick={() => copyToClipboard(transaction.edvironOrderId)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              title="Copy Edviron Order ID"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 text-gray-400 mr-1" />
                            {transaction.orderAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 text-gray-400 mr-1" />
                            {transaction.transactionAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                            {transaction.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusBadgeColor(transaction.status)}`}
                          >
                            {getStatusIcon(transaction.status)}
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            {transaction.studentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className="font-mono">{transaction.studentId}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {transaction.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 text-gray-400 mr-1" />
                            {transaction.vendorAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.gateway}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.captureStatus.toLowerCase())}`}
                          >
                            {transaction.captureStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {totalPages > 1 && (
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(endIndex, sortedTransactions.length)}</span> of{" "}
                    <span className="font-medium">{sortedTransactions.length}</span> results
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Dashboard
