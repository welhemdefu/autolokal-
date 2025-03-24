"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Check, ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

export default function FahrzeugBilderPage({ params }: { params: { anbieterId: string; fahrzeugId: string } }) {
  const { anbieterId, fahrzeugId } = params

  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [fahrzeug, setFahrzeug] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  // Add this useEffect to fetch the vehicle
  useEffect(() => {
    const fetchFahrzeug = async () => {
      try {
        const response = await fetch(`/api/fahrzeuge/${fahrzeugId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch vehicle")
        }
        const data = await response.json()
        setFahrzeug(data)

        // Also fetch the images
        const imagesResponse = await fetch(`/api/fahrzeuge/${fahrzeugId}/bilder`)
        if (!imagesResponse.ok) {
          const errorData = await imagesResponse.json()
          throw new Error(errorData.error || "Failed to fetch images")
        }
        const imagesData = await imagesResponse.json()

        if (imagesData && imagesData.length > 0) {
          setUploadedImages(imagesData.map((img: any) => img.url))

          const mainImageIndex = imagesData.findIndex((img: any) => img.hauptbild)
          if (mainImageIndex !== -1) {
            setMainImageIndex(mainImageIndex)
          }
        }
      } catch (error: any) {
        console.error("Error fetching vehicle:", error)
        toast({
          title: "Fehler",
          description: `Fahrzeug konnte nicht geladen werden: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFahrzeug()
  }, [fahrzeugId, anbieterId, toast])

  // Update the handleImageUpload function
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploading(true)
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          await uploadImage(file)
        }
        toast({
          title: "Erfolg",
          description: `${files.length} Bild${files.length > 1 ? "er" : ""} hochgeladen.`,
        })
      } catch (error: any) {
        toast({
          title: "Fehler",
          description: `Bilder konnten nicht hochgeladen werden: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    }
  }

  // Add this function to handle image upload
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fahrzeugId", fahrzeugId)
      formData.append("anbieterId", anbieterId)
      formData.append("isMainImage", uploadedImages.length === 0 ? "true" : "false")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()

      // Update the local state
      setUploadedImages((prev) => [...prev, data.image.url])

      return data
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  // Update the handleDrop function
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      setUploading(true)
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (file.type.startsWith("image/")) {
            await uploadImage(file)
          }
        }
        toast({
          title: "Erfolg",
          description: `${files.length} Bild${files.length > 1 ? "er" : ""} hochgeladen.`,
        })
      } catch (error: any) {
        toast({
          title: "Fehler",
          description: `Bilder konnten nicht hochgeladen werden: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  // Update the setAsMainImage function
  const setAsMainImage = async (index: number) => {
    try {
      const imageUrl = uploadedImages[index]

      const response = await fetch(`/api/fahrzeuge/${fahrzeugId}/bilder/hauptbild`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to set main image")
      }

      setMainImageIndex(index)

      toast({
        title: "Erfolg",
        description: "Hauptbild wurde aktualisiert.",
      })
    } catch (error: any) {
      console.error("Error setting main image:", error)
      toast({
        title: "Fehler",
        description: `Hauptbild konnte nicht aktualisiert werden: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  // Update the removeImage function
  const removeImage = async (index: number) => {
    try {
      const imageUrl = uploadedImages[index]

      const response = await fetch(`/api/fahrzeuge/${fahrzeugId}/bilder`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to remove image")
      }

      setUploadedImages((prev) => prev.filter((_, i) => i !== index))

      if (mainImageIndex === index) {
        setMainImageIndex(0)
      } else if (mainImageIndex > index) {
        setMainImageIndex((prev) => prev - 1)
      }

      toast({
        title: "Erfolg",
        description: "Bild wurde entfernt.",
      })
    } catch (error: any) {
      console.error("Error removing image:", error)
      toast({
        title: "Fehler",
        description: `Bild konnte nicht entfernt werden: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Lade Fahrzeugdaten...</span>
      </div>
    )
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
                {uploadedImages.length > 0 ? (
                  <Image
                    src={uploadedImages[mainImageIndex] || "/placeholder.svg"}
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
                {uploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-sm text-center text-muted-foreground">Bilder werden hochgeladen...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-center text-muted-foreground mb-2">
                      Ziehen Sie Bilder hierher oder klicken Sie, um Bilder auszuwählen
                    </p>
                    <p className="text-xs text-center text-muted-foreground mb-4">
                      Unterstützte Formate: JPG, PNG, WEBP (max. 5MB)
                    </p>
                    <label>
                      <Button variant="outline" size="sm" disabled={uploading}>
                        Bilder auswählen
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Alle Bilder</h3>
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div
                      className={`aspect-[4/3] relative rounded-lg overflow-hidden border ${
                        index === mainImageIndex ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Bild ${index + 1}`}
                        fill
                        className="object-cover"
                      />
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
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Keine Bilder vorhanden</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/anbieter/bilder">
            <Button variant="outline">Zurück zur Übersicht</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

