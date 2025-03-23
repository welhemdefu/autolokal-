"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Check, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Beispieldaten für Fahrzeuge
const fahrzeuge = {
  "1": {
    id: "1",
    marke: "BMW",
    modell: "3er",
    anbieter: {
      id: "1",
      name: "Premium Cars GmbH",
    },
    bilder: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
  },
  "2": {
    id: "2",
    marke: "Audi",
    modell: "A4",
    anbieter: {
      id: "1",
      name: "Premium Cars GmbH",
    },
    bilder: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  "3": {
    id: "3",
    marke: "Mercedes-Benz",
    modell: "C-Klasse",
    anbieter: {
      id: "2",
      name: "City Rent GmbH",
    },
    bilder: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
  },
}

export default function FahrzeugBilderPage({ params }: { params: { anbieterId: string; fahrzeugId: string } }) {
  const { anbieterId, fahrzeugId } = params

  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Finde das ausgewählte Fahrzeug
  const fahrzeug = fahrzeuge[fahrzeugId as keyof typeof fahrzeuge]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages((prev) => [...prev, ...newImages])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files) {
      const newImages = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file))

      setUploadedImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    if (mainImageIndex === index) {
      setMainImageIndex(0)
    } else if (mainImageIndex > index) {
      setMainImageIndex((prev) => prev - 1)
    }
  }

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index)
  }

  if (!fahrzeug) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/anbieter/bilder">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Fahrzeug nicht gefunden</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>Das angegebene Fahrzeug wurde nicht gefunden.</p>
            <Link href="/admin/anbieter/bilder">
              <Button className="mt-4">Zurück zur Übersicht</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/anbieter/bilder">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          Bilder für {fahrzeug.marke} {fahrzeug.modell}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {fahrzeug.marke} {fahrzeug.modell}
          </CardTitle>
          <CardDescription>Verwalten Sie die Bilder für dieses Fahrzeug von {fahrzeug.anbieter.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Hauptbild</h3>
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden border">
                {fahrzeug.bilder.length > 0 || uploadedImages.length > 0 ? (
                  <Image
                    src={uploadedImages[mainImageIndex] || fahrzeug.bilder[mainImageIndex] || "/placeholder.svg"}
                    alt={`${fahrzeug.marke} ${fahrzeug.modell} Hauptbild`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Bilder hochladen</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-full transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground mb-2">
                  Ziehen Sie Bilder hierher oder klicken Sie, um Bilder auszuwählen
                </p>
                <p className="text-xs text-center text-muted-foreground mb-4">
                  Unterstützte Formate: JPG, PNG, WEBP (max. 5MB)
                </p>
                <label>
                  <Button variant="outline" size="sm">
                    Bilder auswählen
                  </Button>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Alle Bilder</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...fahrzeug.bilder, ...uploadedImages].map((image, index) => (
                <div key={index} className="relative group">
                  <div
                    className={`aspect-[4/3] relative rounded-lg overflow-hidden border ${
                      index === mainImageIndex ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image src={image || "/placeholder.svg"} alt={`Bild ${index + 1}`} fill className="object-cover" />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index !== mainImageIndex && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => setAsMainImage(index)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {index === mainImageIndex && (
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      Hauptbild
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Abbrechen</Button>
          <Button>Änderungen speichern</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

