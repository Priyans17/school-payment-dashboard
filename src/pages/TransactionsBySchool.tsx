"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import TransactionTable from "../components/TransactionTable"

const TransactionsBySchool: React.FC = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock school data - in real app, this would come from API
  const schools = [
    { id: "65b0e6293e9f76a9694d84b4", name: "EDV DEMO SCHOOL" },
    { id: "65b0e6293e9f76a9694d84b5", name: "Kotak Oceanus School" },
    { id: "65b0e6293e9f76a9694d84b6", name: "Delhi Public School" },
    { id: "65b0e6293e9f76a9694d84b7", name: "Ryan International School" },
  ]

  const filteredSchools = schools.filter((school) => school.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions by School</h1>
        <p className="text-gray-600">View transactions for a specific school</p>
      </div>

      {/* School Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select School</h2>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => setSelectedSchoolId(school.id)}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  selectedSchoolId === school.id
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <h3 className="font-medium">{school.name}</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {school.id}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      {selectedSchoolId && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Transactions for {schools.find((s) => s.id === selectedSchoolId)?.name}
            </h2>
          </div>
          <TransactionTable schoolId={selectedSchoolId} />
        </div>
      )}
    </div>
  )
}

export default TransactionsBySchool
