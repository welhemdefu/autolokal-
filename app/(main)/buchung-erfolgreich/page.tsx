import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function BuchungErfolgreichPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Buchung erfolgreich!</CardTitle>
          <CardDescription>Ihre Buchung wurde erfolgreich abgeschlossen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Wir haben Ihnen eine Bestätigungs-E-Mail mit allen Details zu Ihrer Buchung gesendet.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Buchungsnummer</h3>
            <p className="text-2xl font-bold text-center">BK-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Nächste Schritte</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Bitte bringen Sie Ihren Führerschein und Personalausweis zur Fahrzeugabholung mit.</li>
              <li>Der Anbieter wird sich vor der Abholung bei Ihnen melden, um die Details zu bestätigen.</li>
              <li>Bei Fragen können Sie sich jederzeit an unseren Kundenservice wenden.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/" className="w-full">
            <Button className="w-full">Zurück zur Startseite</Button>
          </Link>
          <Link href="/meine-buchungen" className="w-full">
            <Button variant="outline" className="w-full">
              Meine Buchungen anzeigen
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

