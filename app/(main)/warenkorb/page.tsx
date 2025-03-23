"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, ShieldCheck, Truck } from 'lucide-react'
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface BookingData {
  vehicleId: string
  pickupDate: string | null
  returnDate: string | null
  extras: number[]
  services: {
    bahnticket: string
    parkplatz: string
  }
  totalPrice: number
}

// Beispieldaten für Fahrzeug
const fahrzeugData = {
  id: 1,
  marke: "VW",
  modell: "Golf",
  typ: "Kompaktklasse",
  preis: 35,
  anbieter: {
    id: 1,
    name: "Premium Cars GmbH",
    adresse: "Berliner Straße 123, 10115 Berlin",
  },
}

// Beispieldaten für Extras
const extrasData = [
  { id: 1, name: "Kindersitz", preis: 5 },
  { id: 2, name: "Navigationsgerät", preis: 7 },
  { id: 3, name: "Zusätzlicher Fahrer", preis: 10 },
  { id: 4, name: "Schneeketten", preis: 8 },
  { id: 5, name: "Dachgepäckträger", preis: 12 },
]

// Beispieldaten für Services
const servicesData = {
  bahnticket: {
    keine: { name: "Kein Bahnticket", preis: 0 },
    einfach: { name: "Einfache Fahrt", preis: 29 },
    rueckfahrt: { name: "Hin- und Rückfahrt", preis: 49 },
  },
  parkplatz: {
    kein: { name: "Kein Parkplatz", preis: 0 },
    standard: { name: "Standard Parkplatz", preis: 8 },
    premium: { name: "Premium Parkplatz (überdacht)", preis: 15 },
  },
}

export default function WarenkorbPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("kreditkarte")
  const [agbAccepted, setAgbAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [arrivalFlight, setArrivalFlight] = useState("")
  const [departureFlight, setDepartureFlight] = useState("")
  const [fahrzeug, setFahrzeug] = useState(null)
  const [extras, setExtras] = useState([])

  useEffect(() => {
    // Booking data aus sessionStorage laden
    const storedData = sessionStorage.getItem("bookingData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setBookingData(parsedData)
      
      // Fahrzeugdaten laden
      fetchFahrzeugData(parsedData.vehicleId)
    } else {
      // Wenn keine Daten vorhanden, zurück zur Fahrzeugseite
      router.push("/suche")
    }
  }, [router])
  
  // Fahrzeugdaten aus der API laden
  const fetchFahrzeugData = async (fahrzeugId) => {
    try {
      const response = await fetch(`/api/fahrzeuge/${fahrzeugId}`)
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Fahrzeugdaten')
      }
      const data = await response.json()
      setFahrzeug(data)
      setExtras(data.extras || [])
    } catch (error) {
      console.error('Fehler beim Laden der Fahrzeugdaten:', error)
    }
  }

  // Berechnung der Mietdauer
  const calculateDays = () => {
    if (!bookingData?.pickupDate || !bookingData?.returnDate) return 0
    const pickupDate = new Date(bookingData.pickupDate)
    const returnDate = new Date(bookingData.returnDate)
    const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const days = calculateDays()

  // Buchung abschließen
  const handleBooking = async () => {
    setIsLoading(true)

    // Buchungsnummer generieren
    const buchungsnummer = `BK-${Math.floor(100000 + Math.random() * 900000)}`
    
    try {
      // Buchung in der Datenbank speichern
      const response = await fetch('/api/buchungen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buchungsnummer,
          fahrzeug_id: bookingData.vehicleId,
          abholdatum: bookingData.pickupDate,
          rueckgabedatum: bookingData.returnDate,
          gesamtpreis: bookingData.totalPrice,
          zahlungsmethode: paymentMethod,
          ankunftsflug: arrivalFlight,
          abflug: departureFlight,
          extras: bookingData.extras,
          services: bookingData.services,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Fehler beim Speichern der Buchung')
      }
      
      // Buchungsdaten aus dem sessionStorage entfernen
      sessionStorage.removeItem("bookingData")
      
      // Zur Erfolgsseite weiterleiten
      router.push("/buchung-erfolgreich")
    } catch (error) {
      console.error('Fehler bei der Buchung:', error)
      // Hier könntest du eine Fehlermeldung anzeigen
    } finally {
      setIsLoading(false)
    }
  }

  if (!bookingData || !fahrzeug) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Lade Buchungsdaten...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/fahrzeuge/${bookingData.vehicleId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück zur Fahrzeugseite
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Buchung abschließen</h1>

          <Card>
            <CardHeader>
              <CardTitle>Zahlungsmethode</CardTitle>
              <CardDescription>Wählen Sie Ihre bevorzugte Zahlungsmethode</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="kreditkarte" id="kreditkarte" />
                  <Label htmlFor="kreditkarte" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span>Kreditkarte</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer">
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="ueberweisung" id="ueberweisung" />
                  <Label htmlFor="ueberweisung" className="cursor-pointer">
                    Überweisung
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "kreditkarte" && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Kartennummer</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Gültig bis</Label>
                      <Input id="expiryDate" placeholder="MM/JJ" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">Sicherheitscode</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardHolder">Karteninhaber</Label>
                    <Input id="cardHolder" placeholder="Max Mustermann" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lieferadresse</CardTitle>
              <CardDescription>Adresse für die Rechnungsstellung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input id="firstName" placeholder="Max" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input id="lastName" placeholder="Mustermann" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Straße und Hausnummer</Label>
                <Input id="street" placeholder="Musterstraße 123" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">PLZ</Label>
                  <Input id="zip" placeholder="12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ort</Label>
                  <Input id="city" placeholder="Berlin" />
                </div>
              </div>
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="font-medium">Fluginformationen (optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="arrivalFlight">Ankunftsflug</Label>
                  <Input
                    id="arrivalFlight"
                    placeholder="z.B. LH1234"
                    value={arrivalFlight}
                    onChange={(e) => setArrivalFlight(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Für die Koordination der Fahrzeugabholung</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureFlight">Abflug</Label>
                  <Input
                    id="departureFlight"
                    placeholder="z.B. LH5678"
                    value={departureFlight}
                    onChange={(e) => setDepartureFlight(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Für die Koordination der Fahrzeugrückgabe</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Land</Label>
                <Input id="country" placeholder="Deutschland" />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start space-x-3">
            <Checkbox id="agb" checked={agbAccepted} onCheckedChange={(checked) => setAgbAccepted(checked === true)} />
            <Label htmlFor="agb" className="text-sm">
              Ich akzeptiere die{" "}
              <Link href="/agb" className="text-blue-600 hover:underline">
                AGB
              </Link>{" "}
              und die{" "}
              <Link href="/datenschutz" className="text-blue-600 hover:underline">
                Datenschutzerklärung
              </Link>
              . Ich bestätige, dass ich die Stornierungsbedingungen gelesen habe und damit einverstanden bin.
            </Label>
          </div>

          <Button
            className="w-full bg-blue-700 hover:bg-blue-800"
            size="lg"
            disabled={!agbAccepted || isLoading}
            onClick={handleBooking}
          >
            {isLoading ? (
              "Buchung wird bearbeitet..."
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                Jetzt verbindlich buchen
              </>
            )}
          </Button>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Buchungsübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {fahrzeug.marke} {fahrzeug.modell}
                  </p>
                  <p className="text-sm text-muted-foreground">{fahrzeug.typ}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{fahrzeug.preis}€/Tag</p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Abholdatum:</span>
                  <span>
                    {bookingData.pickupDate
                      ? format(new Date(bookingData.pickupDate), "PPP HH:mm", { locale: de })
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rückgabedatum:</span>
                  <span>
                    {bookingData.returnDate
                      ? format(new Date(bookingData.returnDate), "PPP HH:mm", { locale: de })
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mietdauer:</span>
                  <span>{days} Tage</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium">Preisübersicht</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Grundpreis:</span>
                    <span>
                      {fahrzeug.preis}€ × {days} Tage = {fahrzeug.preis * days}€
                    </span>
                  </div>

                  {bookingData.extras.length > 0 && (
                    <>
                      <p className="font-medium mt-2">Extras:</p>
                      {bookingData.extras.map((extraId) => {
                        const extra = extras.find((e) => e.id === extraId)
                        if (!extra) return null
                        return (
                          <div key={extraId} className="flex justify-between">
                            <span>{extra.name}:</span>
                            <span>
                              {extra.preis}€ × {days} Tage = {extra.preis * days}€
                            </span>
                          </div>
                        )
                      })}
                    </>
                  )}

                  {(bookingData.services.bahnticket !== "keine" || bookingData.services.parkplatz !== "kein") && (
                    <>
                      <p className="font-medium mt-2">Zusatzleistungen:</p>
                      {bookingData.services.bahnticket !== "keine" && (
                        <div className="flex justify-between">
                          <span>
                            Bahnticket (
                            {
                              servicesData.bahnticket[
                                bookingData.services.bahnticket as keyof typeof servicesData.bahnticket
                              ].name
                            }
                            ):
                          </span>
                          <span>
                            {
                              servicesData.bahnticket[
                                bookingData.services.bahnticket as keyof typeof servicesData.bahnticket
                              ].preis
                            }
                            €
                          </span>
                        </div>
                      )}
                      {bookingData.services.parkplatz !== "kein" && (
                        <div className="flex justify-between">
                          <span>
                            Parkplatz (
                            {
                              servicesData.parkplatz[
                                bookingData.services.parkplatz as keyof typeof servicesData.parkplatz
                              ].name
                            }
                            ):
                          </span>
                          <span>
                            {
                              servicesData.parkplatz[
                                bookingData.services.parkplatz as keyof typeof servicesData.parkplatz
                              ].preis
                            }
                            €
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Gesamtpreis:</span>
                <span>{bookingData.totalPrice}€</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                <Truck className="h-4 w-4" />
                <span>Kostenlose Stornierung bis 24h vor Abholung</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
