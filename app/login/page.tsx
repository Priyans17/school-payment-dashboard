"use client"

import Login from "../../src/pages/Login"
import { AuthProvider } from "../../src/contexts/AuthContext"

export default function LoginPage() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  )
}
