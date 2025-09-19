import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../src/index.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "School Payment Dashboard",
  description: "Manage school payments and transactions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
