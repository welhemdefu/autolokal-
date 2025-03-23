"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Upload, ImageIcon, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Beispieldaten für Fahrzeuge mit Bildern
const fahrzeuge = [
  {
    id: 1,
    marke: "BMW",
    modell: "3er",
    anbieter: {
      id: 1,
      name: "Premium Cars GmbH",
    },
    bilder: 3,
  },
  {
    id: 2,
    marke: "Audi",
    modell: "A4",
    anbieter: {
      id: 1,
      name: "Premium Cars GmbH",
    },
    bilder: 4,
  },
  {
    id: 3,
    marke: "Mercedes-Benz",
    modell: "A-Klasse",
    anbieter: {
      id: 2,
      name: "City Rent GmbH",
    },
    bilder: 2,
  },
  {
    id: 4,
    marke: "VW",
    modell: "Golf",
    anbieter: {
      id: 3,
      name: "Eco Drive Berlin",
    },
    bilder: 5,
  },
  {
    id: 5,
    marke: "Ford",
    modell: "Focus",
    anbieter: {
      id: 3,
      name: "Eco Drive Berlin",
    },
    bilder: 1,
  },
]

export default function AdminBilderPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtern der Fahrzeuge basierend auf Suchbegriff
  const filteredFahrzeuge = fahrzeuge.filter((fahrzeug) => {
    const matchesSearch =
      fahrzeug.marke.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fahrzeug.modell.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fahrzeug.anbieter.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fahrzeugbilder</h1>
          <p className="text-muted-foreground">Verwalten Sie die Bilder aller Fahrzeuge auf der Plattform.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Bilder hinzufügen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fahrzeug suchen</CardTitle>
          <CardDescription>Suchen Sie nach einem Fahrzeug, um dessen Bilder zu verwalten.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Marke, Modell oder Anbieter..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fahrzeugbilder</CardTitle>
          <CardDescription>{filteredFahrzeuge.length} Fahrzeuge gefunden</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFahrzeuge.map((fahrzeug) => (
              <Card key={fahrzeug.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src="/placeholder.svg?height=300&width=400"
                        alt={`${fahrzeug.marke} ${fahrzeug.modell}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Link href={`/admin/anbieter/${fahrzeug.anbieter.id}/fahrzeuge/${fahrzeug.id}/bilder`}>
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg">
                      {fahrzeug.marke} {fahrzeug.modell}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{fahrzeug.anbieter.name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{fahrzeug.bilder} Bilder</span>
                      </div>
                      <Link href={`/admin/anbieter/${fahrzeug.anbieter.id}/fahrzeuge/${fahrzeug.id}/bilder`}>
                        <Button variant="outline" size="sm">
                          Bilder verwalten
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

