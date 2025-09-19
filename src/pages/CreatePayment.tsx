"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard, ExternalLink } from "lucide-react"
import { paymentAPI } from "../services/api"
import toast from "react-hot-toast"

interface PaymentFormData {
  amount: string
  student_name: string
  student_id: string
  student_email: string
  callback_url: string
}

const CreatePayment: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: "",
    student_name: "",
    student_id: "",
    student_email: "",
    callback_url: "",
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
        callback_url: formData.callback_url || undefined,
      }

      const response = await paymentAPI.create(paymentData)
      setPaymentResponse(response.data)
      toast.success("Payment request created successfully!")
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create payment request"
      toast.error(message)
      console.error("Error creating payment:", error)
    } finally {
      setLoading(false)
    }
  }

  const openPaymentUrl = () => {
    if (paymentResponse?.payment_url) {
      window.open(paymentResponse.payment_url, "_blank")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Payment</h1>
        <p className="text-gray-600">Generate a new payment request for student fees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Student Information</h3>

              <div>
                <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  id="student_name"
                  name="student_name"
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter student name"
                />
              </div>

              <div>
                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  id="student_id"
                  name="student_id"
                  type="text"
                  required
                  value={formData.student_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter student ID"
                />
              </div>

              <div>
                <label htmlFor="student_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Email *
                </label>
                <input
                  id="student_email"
                  name="student_email"
                  type="email"
                  required
                  value={formData.student_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter student email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="callback_url" className="block text-sm font-medium text-gray-700 mb-2">
                Callback URL (Optional)
              </label>
              <input
                id="callback_url"
                name="callback_url"
                type="url"
                value={formData.callback_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://yourapp.com/payment-success"
              />
              <p className="mt-1 text-xs text-gray-500">URL where user will be redirected after payment completion</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Creating Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Create Payment Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Payment Response */}
        {paymentResponse && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Payment Created</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">✅ Payment request created successfully!</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Order ID</label>
                  <p className="mt-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {paymentResponse.custom_order_id}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Collect Request ID</label>
                  <p className="mt-1 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {paymentResponse.collect_request_id}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Payment URL</label>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm text-blue-600 truncate flex-1">{paymentResponse.payment_url}</p>
                    <button
                      onClick={openPaymentUrl}
                      className="flex-shrink-0 p-1 text-blue-600 hover:text-blue-800"
                      title="Open payment page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={openPaymentUrl}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Payment Page
              </button>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Share the payment URL with the student to complete payment</p>
                <p>• Use the Order ID to track payment status</p>
                <p>• Payment status will be updated via webhook automatically</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatePayment
