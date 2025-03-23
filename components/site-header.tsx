import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CarFront } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="bg-blue-700 text-white border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <CarFront className="h-6 w-6" />
            <span>AutoLokal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white hover:text-blue-200">
              Startseite
            </Link>
            <Link href="/suche" className="text-sm font-medium text-white hover:text-blue-200">
              Fahrzeuge
            </Link>
            <Link href="/blog" className="text-sm font-medium text-white hover:text-blue-200">
              Blog
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm" className="bg-transparent text-white border-white hover:bg-blue-600">
                Anmelden
              </Button>
            </Link>
            <Link href="/registrieren">
              <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-100">
                Registrieren
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

