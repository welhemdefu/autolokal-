"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CarFront, ArrowLeft, MapPin, Fuel, Users, Briefcase, Check, Star, Calendar, ArrowRight, ShieldCheck, Sparkles, ParkingCircle, Train } from 'lucide-react'
import { format } from "date-fns"
import { de } from "date-fns/locale"

// Zusätzliche Services
const additionalServices = [
  {
    id: "bahnticket",
    name: "Bahnticket",
    description: "Bahnticket zum Abholort",
    options: [
      { id: "keine", name: "Kein Bahnticket", preis: 0 },
      { id: "einfach", name: "Einfache Fahrt", preis: 29 },
      { id: "rueckfahrt", name: "Hin- und Rückfahrt", preis: 49 },
    ],
  },
  {
    id: "parkplatz",
    name: "Flughafen-Parkplatz",
    description: "Parken am Flughafen während Ihrer Reise",
    options: [
      { id: "kein", name: "Kein Parkplatz", preis: 0 },
      { id: "standard", name: "Standard Parkplatz", preis: 8 },
      { id: "premium", name: "Premium Parkplatz (überdacht)", preis: 15 },
    ],
  },
]

export default function FahrzeugDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [bookingStep, setBookingStep] = useState(1)
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  const [selectedExtras, setSelectedExtras] = useState<number[]>([])
  const [selectedServices, setSelectedServices] = useState({
    bahnticket: "keine",
    parkplatz: "kein",
  })
  const [agbAccepted, setAgbAccepted] = useState(false)
  const [datenschutzAccepted, setDatenschutzAccepted] = useState(false)
  const returnDateRef = useRef<HTMLDivElement>(null)
  const [layoutAnimating, setLayoutAnimating] = useState(false)
  
  // Neuer State für Fahrzeugdaten aus der Datenbank
  const [fahrzeugData, setFahrzeugData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fahrzeugdaten aus der API laden
  useEffect(() => {
    async function loadFahrzeugData() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/fahrzeuge/${params.id}`)
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Fahrzeugdaten')
        }
        const data = await response.json()
        setFahrzeugData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFahrzeugData()
  }, [params.id])
  
  // Zeige Ladeindikator während des Ladens
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CarFront className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-medium">Fahrzeugdaten werden geladen...</p>
        </div>
      </div>
    )
  }
  
  // Zeige Fehlermeldung, wenn ein Fehler aufgetreten ist
  if (error || !fahrzeugData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Fehler beim Laden der Fahrzeugdaten</h2>
          <p className="text-muted-foreground mb-6">{error || 'Fahrzeug nicht gefunden'}</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Erneut versuchen
            </Button>
            <Link href="/suche">
              <Button>Zurück zur Suche</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Berechnung der Mietdauer und des Gesamtpreises
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0
    const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const days = calculateDays()

  // Berechnung der Extrakosten
  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = fahrzeugData.extras?.find((e) => e.id === extraId)
    return sum + (extra ? extra.preis : 0)
  }, 0)

  // Berechnung der Servicekosten
  const getServicePrice = (serviceId: string, optionId: string) => {
    const service = additionalServices.find((s) => s.id === serviceId)
    if (!service) return 0
    const option = service.options.find((o) => o.id === optionId)
    return option ? option.preis : 0
  }

  const servicesTotal =
    getServicePrice("bahnticket", selectedServices.bahnticket) +
    getServicePrice("parkplatz", selectedServices.parkplatz)

  // Gesamtpreis
  const basePrice = days * fahrzeugData.preis
  const totalPrice = basePrice + extrasTotal * days + servicesTotal

  // Fortschritt zum nächsten Schritt
  const nextStep = () => {
    if (bookingStep < 4) {
      setLayoutAnimating(true)
      setTimeout(() => {
        setBookingStep(bookingStep + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
        setTimeout(() => {
          setLayoutAnimating(false)
        }, 500)
      }, 10)
    } else {
      // Redirect to cart/checkout page
      const bookingData = {
        vehicleId: params.id,
        pickupDate: pickupDate?.toISOString(),
        returnDate: returnDate?.toISOString(),
        extras: selectedExtras,
        services: selectedServices,
        totalPrice: totalPrice,
      }

      // Store booking data in sessionStorage
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData))

      // Redirect to checkout page
      router.push("/warenkorb")
    }
  }

  // Zurück zum vorherigen Schritt
  const prevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Extras auswählen/abwählen
  const toggleExtra = (extraId: number) => {
    setSelectedExtras((prev) => (prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]))
  }

  // Service Option auswählen
  const selectServiceOption = (serviceId: string, optionId: string) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: optionId,
    }))
  }

  // Fokus auf Rückgabedatum setzen nach Auswahl des Abholdatums
  const handlePickupDateSelect = (date: Date | undefined) => {
    // Only update if the date has actually changed
    if (date?.getTime() !== pickupDate?.getTime()) {
      setPickupDate(date)
      // Wenn Rückgabedatum vor neuem Abholdatum liegt, zurücksetzen
      if (date && returnDate && date > returnDate) {
        setReturnDate(undefined)
      }
    }
  }

  // Fokus auf Rückgabedatum nach Auswahl des Abholdatums
  const focusReturnDate = () => {
    // Add a small delay to ensure the state has been updated
    setTimeout(() => {
      if (returnDateRef.current) {
        const button = returnDateRef.current.querySelector("button")
        if (button) {
          button.click()
        }
      }
    }, 200)
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/suche" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Zurück zur Suche
          </Link>
        </div>

        {bookingStep === 1 ? (
          // Standard Layout für Schritt 1
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fahrzeugdetails */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="aspect-[16/9] relative bg-gray-200 flex items-center justify-center">
                  {fahrzeugData.fahrzeug_bilder && fahrzeugData.fahrzeug_bilder.length > 0 ? (
                    <img 
                      src={fahrzeugData.fahrzeug_bilder.find(b => b.ist_hauptbild)?.bild_url || fahrzeugData.fahrzeug_bilder[0].bild_url} 
                      alt={`${fahrzeugData.marke} ${fahrzeugData.modell}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <CarFront className="h-24 w-24 text-gray-400" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">
                        {fahrzeugData.marke} {fahrzeugData.modell}
                      </h1>
                      <p className="text-muted-foreground">{fahrzeugData.typ}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{fahrzeugData.preis}€</p>
                      <p className="text-muted-foreground">pro Tag</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{fahrzeugData.anbieter?.adresse}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Kraftstoff</p>
                        <p className="text-sm text-muted-foreground">{fahrzeugData.kraftstoff}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Sitze</p>
                        <p className="text-sm text-muted-foreground">{fahrzeugData.sitze}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Kofferraum</p>
                        <p className="text-sm text-muted-foreground">{fahrzeugData.kofferraum}</p>
                      </div>
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="anbieter">Anbieter</TabsTrigger>
                      <TabsTrigger value="bewertungen">Bewertungen</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Beschreibung</h3>
                          <p className="text-muted-foreground">{fahrzeugData.beschreibung}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Ausstattung</h3>
                          <ul className="grid grid-cols-2 gap-2">
                            {fahrzeugData.fahrzeug_ausstattung?.map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>{item.ausstattung}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="anbieter" className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{fahrzeugData.anbieter?.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{fahrzeugData.anbieter?.bewertung || "Neu"}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{fahrzeugData.anbieter?.adresse}</p>
                        <p className="text-muted-foreground">Telefon: {fahrzeugData.anbieter?.telefon}</p>
                        <Link href={`/anbieter/${fahrzeugData.anbieter?.id}`}>
                          <Button variant="outline">Anbieter anzeigen</Button>
                        </Link>
                      </div>
                    </TabsContent>
                    <TabsContent value="bewertungen" className="pt-6">
                      <div className="space-y-6">
                        {fahrzeugData.fahrzeug_bewertungen?.length > 0 ? (
                          fahrzeugData.fahrzeug_bewertungen.map((bewertung) => (
                            <div key={bewertung.id} className="border-b pb-4 last:border-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium">Benutzer #{bewertung.user_id}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(bewertung.erstellt_am).toLocaleDateString('de-DE')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < bewertung.bewertung ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground">{bewertung.kommentar}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">Noch keine Bewertungen vorhanden.</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Buchungsformular */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Zeitraum wählen</CardTitle>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    </div>
                  </div>
                  <CardDescription>Wählen Sie Ihre Mietdauer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Abholdatum & Uhrzeit</span>
                    </div>
                    <DateTimePicker
                      mode="pickup"
                      selected={pickupDate}
                      onSelect={handlePickupDateSelect}
                      placeholder="Abholdatum & Uhrzeit wählen"
                      onComplete={focusReturnDate}
                    />
                  </div>

                  <div className="space-y-2" ref={returnDateRef}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Rückgabedatum & Uhrzeit</span>
                    </div>
                    <DateTimePicker
                      mode="return"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      minDate={pickupDate}
                      placeholder="Rückgabedatum & Uhrzeit wählen"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Preis pro Tag:</span>
                      <span>{fahrzeugData.preis}€</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Anzahl Tage:</span>
                      <span>{days || "-"}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Gesamtpreis:</span>
                      <span>{days ? `${basePrice}€` : "-"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={nextStep} disabled={!pickupDate || !returnDate}>
                    Weiter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <div className="mt-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-800 rounded-full p-2">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Kostenlose Stornierung</p>
                        <p className="text-sm text-muted-foreground">Bis zu 24 Stunden vor Abholung</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          // Geändertes Layout für Schritte 2-4 mit Animation
          <div
            className={`flex flex-col space-y-8 transition-all duration-500 ease-in-out ${layoutAnimating ? "opacity-0 transform -translate-x-10" : "opacity-100"}`}
          >
            {/* Buchungsformular (jetzt oben und volle Breite) */}
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {bookingStep === 2 && "Extras wählen"}
                    {bookingStep === 3 && "Zusatzleistungen"}
                    {bookingStep === 4 && "Buchung abschließen"}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className={`w-2 h-2 rounded-full ${bookingStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></span>
                    <span className={`w-2 h-2 rounded-full ${bookingStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}></span>
                    <span className={`w-2 h-2 rounded-full ${bookingStep >= 4 ? "bg-blue-600" : "bg-gray-300"}`}></span>
                  </div>
                </div>
                <CardDescription>
                  {bookingStep === 2 && "Wählen Sie zusätzliche Ausstattung"}
                  {bookingStep === 3 && "Wählen Sie weitere Dienstleistungen"}
                  {bookingStep === 4 && "Überprüfen Sie Ihre Buchungsdetails"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Schritt 2: Extras wählen */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">Verfügbare Extras</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fahrzeugData.extras?.map((extra) => (
                        <div key={extra.id} className="flex items-start space-x-3 border rounded-lg p-4">
                          <Checkbox
                            id={`extra-${extra.id}`}
                            checked={selectedExtras.includes(extra.id)}
                            onCheckedChange={() => toggleExtra(extra.id)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={`extra-${extra.id}`} className="font-medium cursor-pointer">
                              {extra.name} (+{extra.preis}€/Tag)
                            </Label>
                            <p className="text-sm text-muted-foreground">{extra.beschreibung}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schritt 3: Zusatzleistungen */}
                {bookingStep === 3 && (
                  <div className="space-y-6">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="space-y-3 border rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          {service.id === "bahnticket" ? (
                            <Train className="h-5 w-5 text-blue-600" />
                          ) : (
                            <ParkingCircle className="h-5 w-5 text-blue-600" />
                          )}
                          <h3 className="font-medium">{service.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>

                        <RadioGroup
                          value={selectedServices[service.id as keyof typeof selectedServices]}
                          onValueChange={(value) => selectServiceOption(service.id, value)}
                          className="space-y-2"
                        >
                          {service.options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2 border-b pb-2">
                              <RadioGroupItem value={option.id} id={`${service.id}-${option.id}`} />
                              <Label htmlFor={`${service.id}-${option.id}`} className="flex-1 cursor-pointer">
                                <span className="font-medium">{option.name}</span>
                                {option.preis > 0 && (
                                  <span className="text-sm text-muted-foreground ml-2">(+{option.preis}€)</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}

                {/* Schritt 4: Buchung abschließen */}
                {bookingStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Buchungsübersicht</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Fahrzeug:</span>
                          <span className="font-medium">
                            {fahrzeugData.marke} {fahrzeugData.modell}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Abholdatum:</span>
                          <span>{pickupDate ? format(pickupDate, "PPP HH:mm", { locale: de }) : "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rückgabedatum:</span>
                          <span>{returnDate ? format(returnDate, "PPP HH:mm", { locale: de }) : "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mietdauer:</span>
                          <span>{days} Tage</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between">
                            <span>Grundpreis:</span>
                            <span>
                              {fahrzeugData.preis}€ × {days} Tage = {basePrice}€
                            </span>
                          </div>

                          {selectedExtras.length > 0 && (
                            <div className="mt-2">
                              <div className="font-medium">Extras:</div>
                              {selectedExtras.map((extraId) => {
                                const extra = fahrzeugData.extras?.find((e) => e.id === extraId)
                                if (!extra) return null
                                return (
                                  <div key={extraId} className="flex justify-between text-sm">
                                    <span>{extra.name}:</span>
                                    <span>
                                      {extra.preis}€ × {days} Tage = {extra.preis * days}€
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {(selectedServices.bahnticket !== "keine" || selectedServices.parkplatz !== "kein") && (
                            <div className="mt-2">
                              <div className="font-medium">Zusatzleistungen:</div>
                              {selectedServices.bahnticket !== "keine" && (
                                <div className="flex justify-between text-sm">
                                  <span>
                                    Bahnticket (
                                    {
                                      additionalServices[0].options.find((o) => o.id === selectedServices.bahnticket)
                                        ?.name
                                    }
                                    ):
                                  </span>
                                  <span>{getServicePrice("bahnticket", selectedServices.bahnticket)}€</span>
                                </div>
                              )}
                              {selectedServices.parkplatz !== "kein" && (
                                <div className="flex justify-between text-sm">
                                  <span>
                                    Parkplatz (
                                    {
                                      additionalServices[1].options.find((o) => o.id === selectedServices.parkplatz)
                                        ?.name
                                    }
                                    ):
                                  </span>
                                  <span>{getServicePrice("parkplatz", selectedServices.parkplatz)}€</span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between font-bold text-lg border-t mt-2 pt-2">
                            <span>Gesamtpreis:</span>
                            <span>{totalPrice}€</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Kontaktdaten</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstname">Vorname</Label>
                          <Input id="firstname" placeholder="Max" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastname">Nachname</Label>
                          <Input id="lastname" placeholder="Mustermann" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <Input id="email" type="email" placeholder="max.mustermann@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" placeholder="+49 123 4567890" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Nachricht an den Anbieter (optional)</Label>
                        <Textarea id="message" placeholder="Ihre Nachricht..." />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agb"
                          checked={agbAccepted}
                          onCheckedChange={(checked) => setAgbAccepted(checked === true)}
                        />
                        <Label htmlFor="agb" className="text-sm">
                          Ich akzeptiere die{" "}
                          <Link href="/agb" className="text-blue-600 hover:underline">
                            AGB
                          </Link>{" "}
                          und die{" "}
                          <Link href="/datenschutz" className="text-blue-600 hover:underline">
                            Datenschutzerklärung
                          </Link>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="datenschutz"
                          checked={datenschutzAccepted}
                          onCheckedChange={(checked) => setDatenschutzAccepted(checked === true)}
                        />
                        <Label htmlFor="datenschutz" className="text-sm">
                          Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preisübersicht (nur in Schritt 2-3) */}
                {bookingStep < 4 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Preis pro Tag:</span>
                      <span>{fahrzeugData.preis}€</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Anzahl Tage:</span>
                      <span>{days || "-"}</span>
                    </div>
                    {bookingStep >= 2 && selectedExtras.length > 0 && (
                      <div className="flex justify-between mb-2">
                        <span>Extras pro Tag:</span>
                        <span>{extrasTotal}€</span>
                      </div>
                    )}
                    {bookingStep >= 3 && servicesTotal > 0 && (
                      <div className="flex justify-between mb-2">
                        <span>Zusatzleistungen:</span>
                        <span>{servicesTotal}€</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Gesamtpreis:</span>
                      <span>{days ? `${totalPrice}€` : "-"}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Zurück
                </Button>

                {bookingStep < 4 ? (
                  <Button onClick={nextStep}>
                    Weiter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-700 hover:bg-blue-800"
                    disabled={!agbAccepted || !datenschutzAccepted}
                    onClick={nextStep}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Weiter zur Buchung
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Fahrzeugdetails (jetzt unten) */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-xl font-bold">
                      {fahrzeugData.marke} {fahrzeugData.modell}
                    </h1>
                    <p className="text-muted-foreground">{fahrzeugData.typ}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{fahrzeugData.preis}€</p>
                    <p className="text-muted-foreground">pro Tag</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{fahrzeugData.anbieter?.adresse}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Kraftstoff</p>
                      <p className="text-sm text-muted-foreground">{fahrzeugData.kraftstoff}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Sitze</p>
                      <p className="text-sm text-muted-foreground">{fahrzeugData.sitze}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Kofferraum</p>
                      <p className="text-sm text-muted-foreground">{fahrzeugData.kofferraum}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {pickupDate ? format(pickupDate, "PPP", { locale: de }) : "-"} bis{" "}
                    {returnDate ? format(returnDate, "PPP", { locale: de }) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
