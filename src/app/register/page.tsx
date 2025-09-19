"use client"

import Register from "../../src/pages/Register"
import { AuthProvider } from "../../src/contexts/AuthContext"

export default function RegisterPage() {
  return (
    <AuthProvider>
      <Register />
    </AuthProvider>
  )
}
