"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, ExternalLink, ArrowLeft, Copy } from "lucide-react"
import { paymentAPI } from "../services/api"
import toast from "react-hot-toast"
import Link from "next/link"

interface PaymentFormData {
  amount: string
  callback_url: string
  student_name: string
  student_id: string
  student_email: string
}

const CreatePayment: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: "",
    callback_url: "https://dev-vanilla.edviron.com/erp",
    student_name: "",
    student_id: "",
    student_email: "",
  })
  const [loading, setLoading] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const paymentData = {
        amount: Number.parseFloat(formData.amount),
        student_info: {
          name: formData.student_name,
          id: formData.student_id,
          email: formData.student_email,
        },
        callback_url: formData.callback_url || "https://dev-vanilla.edviron.com/erp",
      }

      const response = await paymentAPI.create(paymentData)
      setPaymentResponse(response.data)
      
      if (response.data.requires_approval) {
        toast.success("Payment request created successfully! Waiting for approval.")
      } else {
        toast.success("Payment request created successfully!")
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create payment request"
      toast.error(message)
      console.error("Error creating payment:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create Payment</h1>
          <p className="mt-1 text-sm text-gray-400">Generate a new payment request for student fees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-900 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Payment Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="school_id" className="block text-sm font-medium text-gray-300 mb-2">
                School ID
              </label>
              <input
                id="school_id"
                name="school_id"
                type="text"
                value={process.env.NEXT_PUBLIC_SCHOOL_ID || "65b0e6293e9f76a9694d84b4"}
                disabled
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-300 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-400">Pre-filled from environment variable</p>
            </div>

            <div>
              <label htmlFor="student_name" className="block text-sm font-medium text-gray-300 mb-2">
                Student Name *
              </label>
              <input
                id="student_name"
                name="student_name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label htmlFor="student_id" className="block text-sm font-medium text-gray-300 mb-2">
                Student ID *
              </label>
              <input
                id="student_id"
                name="student_id"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                placeholder="Enter student ID"
              />
            </div>

            <div>
              <label htmlFor="student_email" className="block text-sm font-medium text-gray-300 mb-2">
                Student Email *
              </label>
              <input
                id="student_email"
                name="student_email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                placeholder="Enter student email"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                Amount (₹) *
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="1"
                required
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                placeholder="Enter amount in INR"
              />
            </div>

            <div>
              <label htmlFor="callback_url" className="block text-sm font-medium text-gray-300 mb-2">
                Callback URL
              </label>
              <input
                id="callback_url"
                name="callback_url"
                type="url"
                value={formData.callback_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                placeholder="https://dev-vanilla.edviron.com/erp"
              />
              <p className="mt-1 text-xs text-gray-400">Default callback URL: https://dev-vanilla.edviron.com/erp</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Payment...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Create Payment Request
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Payment Response */}
        {paymentResponse && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg ${
                paymentResponse.requires_approval 
                  ? "bg-yellow-900" 
                  : "bg-green-900"
              }`}>
                <CreditCard className={`h-5 w-5 ${
                  paymentResponse.requires_approval 
                    ? "text-yellow-400" 
                    : "text-green-400"
                }`} />
              </div>
              <h2 className="text-lg font-semibold text-white">
                {paymentResponse.requires_approval ? "Payment Pending Approval" : "Payment Created"}
              </h2>
            </div>

            <div className="space-y-4">
              <div className={`p-4 border rounded-lg ${
                paymentResponse.requires_approval
                  ? "bg-yellow-900 border-yellow-700"
                  : "bg-green-900 border-green-700"
              }`}>
                <p className={`text-sm font-medium ${
                  paymentResponse.requires_approval
                    ? "text-yellow-200"
                    : "text-green-200"
                }`}>
                  {paymentResponse.requires_approval 
                    ? "⏳ Payment request created successfully! Waiting for admin approval."
                    : "✅ Payment request created successfully!"
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Collect Request URL</label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-mono bg-gray-700 px-2 py-1 rounded text-white flex-1">
                      {paymentResponse.collect_request_id}
                    </p>
                    <button
                      onClick={() => copyToClipboard(paymentResponse.collect_request_id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-300"
                      title="Copy Collect Request URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">Order ID</label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-mono bg-gray-700 px-2 py-1 rounded text-white flex-1">
                      {paymentResponse.custom_order_id}
                    </p>
                    <button
                      onClick={() => copyToClipboard(paymentResponse.custom_order_id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-300"
                      title="Copy Order ID"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">Status</label>
                  <p className={`mt-1 text-sm font-medium ${
                    paymentResponse.requires_approval
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}>
                    {paymentResponse.status || (paymentResponse.requires_approval ? "Pending Approval" : "Created")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(paymentResponse.collect_request_id)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-3 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Payment Link
              </button>

              <div className="text-xs text-gray-400 space-y-1">
                {paymentResponse.requires_approval ? (
                  <>
                    <p>• Payment request is pending admin approval</p>
                    <p>• You will be notified once approved or rejected</p>
                    <p>• Use the Order ID to track payment status</p>
                  </>
                ) : (
                  <>
                    <p>• Share the payment URL with the student to complete payment</p>
                    <p>• Use the Order ID to track payment status</p>
                    <p>• Payment status will be updated via webhook automatically</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatePayment