"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download } from "lucide-react"

interface Transaction {
  collect_id: string
  school_id: string
  gateway: string
  order_amount: number
  transaction_amount: number
  status: string
  custom_order_id: string
  student_info?: {
    name: string
    id: string
    email: string
  }
  payment_mode?: string
  payment_time?: string
  createdAt: string
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token")
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        status: statusFilter,
        sort: sortBy,
        order: sortOrder,
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/transactions?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      const data = await response.json()
      if (data.success) {
        setTransactions(data.data || [])
        setTotalPages(data.pagination?.total_pages || 1)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, statusFilter, sortBy, sortOrder])

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Success
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Pending
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.custom_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.student_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.student_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Filter</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split("-")
              setSortBy(field)
              setSortOrder(order)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Date (Newest)</SelectItem>
              <SelectItem value="createdAt-asc">Date (Oldest)</SelectItem>
              <SelectItem value="order_amount-desc">Amount (High)</SelectItem>
              <SelectItem value="order_amount-asc">Amount (Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>History</span>
            <span className="text-sm font-normal text-muted-foreground">Rows per page: 10</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr.No</TableHead>
                  <TableHead>Institute Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Edviron Order ID</TableHead>
                  <TableHead>Order Amt</TableHead>
                  <TableHead>Transaction Amt</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Phone No.</TableHead>
                  <TableHead>Vendor Amount</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Capture Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <TableRow key={transaction.collect_id} className="hover:bg-muted/50">
                      <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                      <TableCell className="font-medium">School Institute</TableCell>
                      <TableCell>
                        {new Date(transaction.payment_time || transaction.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell className="font-mono text-sm">{transaction.custom_order_id}</TableCell>
                      <TableCell>₹{transaction.order_amount}</TableCell>
                      <TableCell>₹{transaction.transaction_amount}</TableCell>
                      <TableCell>{transaction.payment_mode || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{transaction.student_info?.name || "test name"}</TableCell>
                      <TableCell>{transaction.student_info?.id || "s123456"}</TableCell>
                      <TableCell>0000000000</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>{transaction.gateway}</TableCell>
                      <TableCell>N/A</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
