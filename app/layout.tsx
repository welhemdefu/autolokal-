import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AutoLokal - Lokale Autovermietung",
  description: "Finden Sie lokale Autovermietungen in Ihrer Nähe",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'