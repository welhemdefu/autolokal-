import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function RegistrationSuccessPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
          <CardTitle className="text-2xl font-bold">Registrierung erfolgreich!</CardTitle>
          <CardDescription>Ihr Konto wurde erfolgreich erstellt. Sie können sich jetzt anmelden.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte überprüfen Sie Ihren Posteingang und bestätigen Sie
            Ihre E-Mail-Adresse.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Link href="/login" className="w-full">
            <Button className="w-full">Jetzt anmelden</Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Zurück zur Startseite
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

