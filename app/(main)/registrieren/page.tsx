"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("kunde")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    vorname: "",
    nachname: "",
    email: "",
    password: "",
    passwordConfirm: "",
    accountType: "kunde",
    firmenname: "",
    telefon: "",
    adresse: "",
    plz: "",
    ort: "",
    land: "deutschland",
    agbAccepted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user selects a value
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Basic validation
    if (!formData.vorname.trim()) newErrors.vorname = "Vorname ist erforderlich"
    if (!formData.nachname.trim()) newErrors.nachname = "Nachname ist erforderlich"

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Passwort ist erforderlich"
    } else if (formData.password.length < 8) {
      newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein"
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwörter stimmen nicht überein"
    }

    // Additional validation for providers
    if (activeTab === "anbieter") {
      if (!formData.firmenname.trim()) newErrors.firmenname = "Firmenname ist erforderlich"
      if (!formData.telefon.trim()) newErrors.telefon = "Telefonnummer ist erforderlich"
      if (!formData.adresse.trim()) newErrors.adresse = "Adresse ist erforderlich"
      if (!formData.plz.trim()) newErrors.plz = "PLZ ist erforderlich"
      if (!formData.ort.trim()) newErrors.ort = "Ort ist erforderlich"
    }

    // Terms acceptance
    if (!formData.agbAccepted) {
      newErrors.agbAccepted = "Sie müssen die AGB akzeptieren"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData)

      // Redirect to success page or login
      router.push("/registrieren/erfolg")
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registrieren</CardTitle>
          <CardDescription>
            Erstellen Sie ein Konto, um Fahrzeuge zu buchen oder als Anbieter Fahrzeuge zu vermieten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kunde">Als Kunde registrieren</TabsTrigger>
              <TabsTrigger value="anbieter">Als Anbieter registrieren</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form content */}
            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
              Registrieren
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Bereits registriert?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Hier anmelden
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

