"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { CarFront, Search, MapPin, Calendar } from "lucide-react"

export default function HomePage() {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)

  return (
    <>
      {/* Search Form */}
      <section className="relative mt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form action="/suche" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Standort</span>
                  </div>
                  <Select name="location" defaultValue="berlin">
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

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CarFront className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Fahrzeugtyp</span>
                  </div>
                  <Select name="carType" defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Fahrzeugtyp wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Typen</SelectItem>
                      <SelectItem value="kleinwagen">Kleinwagen</SelectItem>
                      <SelectItem value="kompakt">Kompaktklasse</SelectItem>
                      <SelectItem value="mittelklasse">Mittelklasse</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
                <Search className="mr-2 h-4 w-4" />
                Fahrzeuge suchen
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Warum AutoLokal?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Einfache Suche</h3>
            <p className="text-muted-foreground">
              Finden Sie schnell und einfach das passende Fahrzeug für Ihre Bedürfnisse.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lokale Anbieter</h3>
            <p className="text-muted-foreground">
              Unterstützen Sie lokale Unternehmen und profitieren Sie von persönlichem Service.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Einfache Buchung</h3>
            <p className="text-muted-foreground">
              Buchen Sie Ihr Fahrzeug direkt online und erhalten Sie sofort eine Bestätigung.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Beliebte Fahrzeuge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((id) => (
              <Card key={id} className="overflow-hidden">
                <div className="aspect-[4/3] relative bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CarFront className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">VW Golf</h3>
                      <p className="text-sm text-muted-foreground">Kompaktklasse</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">35€</p>
                      <p className="text-sm text-muted-foreground">pro Tag</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>Premium Cars GmbH</span>
                    <span>Berlin</span>
                  </div>
                  <Link href={`/fahrzeuge/${id}`}>
                    <Button className="w-full bg-blue-700 hover:bg-blue-800">Details ansehen</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/suche">
              <Button variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
                Alle Fahrzeuge anzeigen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Das sagen unsere Kunden</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((id) => (
            <Card key={id} className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h3 className="font-bold">Max Mustermann</h3>
                  <p className="text-sm text-muted-foreground">Berlin</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Einfache Buchung, toller Service und ein super Auto. Ich werde definitiv wieder buchen!"
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihre nächste Fahrt?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Finden Sie jetzt das perfekte Fahrzeug für Ihre Bedürfnisse und buchen Sie direkt online.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-100">
            Fahrzeuge suchen
          </Button>
        </div>
      </section>
    </>
  )
}

