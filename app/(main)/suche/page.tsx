"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/ui/date-picker"
import { CarFront, Search, MapPin, Calendar, Fuel, Users, Briefcase, SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SuchePage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [carType, setCarType] = useState("all")
  const [fuelType, setFuelType] = useState("all")
  const [sortBy, setSortBy] = useState("preis-aufsteigend")
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  
  // Neuer State für Fahrzeuge aus der Datenbank
  const [fahrzeuge, setFahrzeuge] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fahrzeuge aus der API laden
  useEffect(() => {
    async function loadFahrzeuge() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/fahrzeuge')
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Fahrzeuge')
        }
        const data = await response.json()
        setFahrzeuge(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFahrzeuge()
  }, [])
  
  // Filter und Sortierung der Fahrzeuge
  const filteredFahrzeuge = fahrzeuge
    .filter((fahrzeug) => {
      const matchesSearch =
        fahrzeug.marke?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fahrzeug.modell?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fahrzeug.anbieter?.name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrice = fahrzeug.preis >= priceRange[0] && fahrzeug.preis <= priceRange[1]
      const matchesType = carType === "all" || fahrzeug.typ?.toLowerCase() === carType.toLowerCase()
      const matchesFuel = fuelType === "all" || fahrzeug.kraftstoff?.toLowerCase() === fuelType.toLowerCase()

      return matchesSearch && matchesPrice && matchesType && matchesFuel
    })
    .sort((a, b) => {
      if (sortBy === "preis-aufsteigend") return a.preis - b.preis
      if (sortBy === "preis-absteigend") return b.preis - a.preis
      return 0
    })

  return (
    <div className="bg-gray-50">
      {/* Search Form */}
      <section className="bg-white border-b mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Standort</span>
              </div>
              <Select defaultValue="berlin">
                <SelectTrigger>
                  <SelectValue placeholder="Standort wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="berlin">Berlin</SelectItem>
                  <SelectItem value="hamburg">Hamburg</SelectItem>
                  <SelectItem value="muenchen">München</SelectItem>
                  <SelectItem value="koeln">Köln</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Abholdatum</span>
              </div>
              <DatePicker
                mode="pickup"
                selected={pickupDate}
                onSelect={(date) => {
                  setPickupDate(date)
                  // If return date is before new pickup date, reset it
                  if (date && returnDate && date > returnDate) {
                    setReturnDate(undefined)
                  }
                }}
                placeholder="Abholdatum wählen"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Rückgabedatum</span>
              </div>
              <DatePicker
                mode="return"
                selected={returnDate}
                onSelect={setReturnDate}
                minDate={pickupDate}
                placeholder="Rückgabedatum wählen"
              />
            </div>

            <div>
              <Button type="submit" className="w-full h-full mt-6 bg-blue-700 hover:bg-blue-800">
                <Search className="mr-2 h-4 w-4" />
                Suchen
              </Button>
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Verfügbare Fahrzeuge</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sortieren nach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preis-aufsteigend">Preis: Aufsteigend</SelectItem>
                  <SelectItem value="preis-absteigend">Preis: Absteigend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter</SheetTitle>
                  <SheetDescription>Passen Sie Ihre Suchkriterien an</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Preisbereich</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 100]}
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{priceRange[0]}€</span>
                        <span>{priceRange[1]}€</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Fahrzeugtyp</h3>
                    <Select value={carType} onValueChange={setCarType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Fahrzeugtyp wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Typen</SelectItem>
                        <SelectItem value="kleinwagen">Kleinwagen</SelectItem>
                        <SelectItem value="kompaktklasse">Kompaktklasse</SelectItem>
                        <SelectItem value="mittelklasse">Mittelklasse</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Kraftstoff</h3>
                    <Select value={fuelType} onValueChange={setFuelType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kraftstoff wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Kraftstoffe</SelectItem>
                        <SelectItem value="benzin">Benzin</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="elektro">Elektro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Filter anwenden</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg border p-6 space-y-6 sticky top-8">
              <div>
                <h3 className="font-medium mb-4">Suche</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Marke, Modell, Anbieter..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Preisbereich</h3>
                <div className="px-2">
                  <Slider defaultValue={[0, 100]} max={100} step={5} value={priceRange} onValueChange={setPriceRange} />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{priceRange[0]}€</span>
                    <span>{priceRange[1]}€</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Fahrzeugtyp</h3>
                <Select value={carType} onValueChange={setCarType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fahrzeugtyp wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Typen</SelectItem>
                    <SelectItem value="kleinwagen">Kleinwagen</SelectItem>
                    <SelectItem value="kompaktklasse">Kompaktklasse</SelectItem>
                    <SelectItem value="mittelklasse">Mittelklasse</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-4">Kraftstoff</h3>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kraftstoff wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kraftstoffe</SelectItem>
                    <SelectItem value="benzin">Benzin</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="elektro">Elektro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Filter anwenden</Button>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p>Fahrzeuge werden geladen...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Fehler beim Laden der Fahrzeuge</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Erneut versuchen
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFahrzeuge.length > 0 ? (
                  filteredFahrzeuge.map((fahrzeug) => (
                    <Card key={fahrzeug.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="aspect-[4/3] relative bg-gray-200 flex items-center justify-center">
                            {fahrzeug.fahrzeug_bilder && fahrzeug.fahrzeug_bilder.length > 0 ? (
                              <img 
                                src={fahrzeug.fahrzeug_bilder.find(b => b.ist_hauptbild)?.bild_url || fahrzeug.fahrzeug_bilder[0].bild_url} 
                                alt={`${fahrzeug.marke} ${fahrzeug.modell}`}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <CarFront className="h-16 w-16 text-gray-400" />
                            )}
                          </div>
                          <div className="p-6 md:col-span-2">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">
                                  {fahrzeug.marke} {fahrzeug.modell}
                                </h3>
                                <p className="text-sm text-muted-foreground">{fahrzeug.typ}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{fahrzeug.preis}€</p>
                                <p className="text-sm text-muted-foreground">pro Tag</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Fuel className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{fahrzeug.kraftstoff}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{fahrzeug.sitze} Sitze</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{fahrzeug.kofferraum}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">{fahrzeug.anbieter?.name}</p>
                                <p className="text-sm text-muted-foreground">{fahrzeug.standort}</p>
                              </div>
                              <Link href={`/fahrzeuge/${fahrzeug.id}`}>
                                <Button>Details ansehen</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">Keine Fahrzeuge gefunden</h3>
                    <p className="text-muted-foreground mb-6">
                      Bitte passen Sie Ihre Suchkriterien an oder versuchen Sie es später erneut.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setPriceRange([0, 100])
                        setCarType("all")
                        setFuelType("all")
                      }}
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
