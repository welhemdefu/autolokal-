"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

export default function PasswordResetPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("E-Mail ist erforderlich")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein")
      return
    }

    // Here you would typically send the request to your backend
    console.log("Password reset requested for:", email)

    // Show success message
    setIsSubmitted(true)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Passwort zurücksetzen</CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen Ihres Passworts zu erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="max.mustermann@example.com"
                  value={email}
                  onChange={handleInputChange}
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button type="submit" className="w-full">
                Link senden
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p>
                Wenn ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen Ihres
                Passworts gesendet. Bitte überprüfen Sie Ihren Posteingang.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            <Link href="/login" className="text-blue-600 hover:underline">
              Zurück zur Anmeldung
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

