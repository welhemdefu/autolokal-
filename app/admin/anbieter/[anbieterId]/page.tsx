"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Edit, Trash2, Eye, Upload, CarFront } from "lucide-react"
import Link from "next/link"

// Beispieldaten für einen Anbieter
const anbieter = {
  id: 3,
  name: "Premium Cars GmbH",
  email: "info@premium-cars.de",
  telefon: "+49 30 123456789",
  adresse: "Berliner Straße 123, 10115 Berlin",
  beschreibung:
    "Premium Cars GmbH bietet hochwertige Fahrzeuge zu fairen Preisen in Berlin. Seit 2010 sind wir Ihr zuverlässiger Partner für Mobilität.",
  status: "Aktiv",
  registriert: "10.02.2025",
  fahrzeuge: 12,
  buchungen: 45,
  umsatz: "12.500€",
}

// Beispieldaten für Fahrzeuge des Anbieters
const fahrzeuge = [
  {
    id: 1,
    marke: "BMW",
    modell: "3er",
    baujahr: 2021,
    kennzeichen: "B-CD 5678",
    status: "Verfügbar",
    preis: 45,
    bilder: 3,
  },
  {
    id: 2,
    marke: "Audi",
    modell: "A4",
    baujahr: 2022,
    kennzeichen: "B-GH 3456",
    status: "Gebucht",
    preis: 50,
    bilder: 4,
  },
  {
    id: 3,
    marke: "Mercedes-Benz",
    modell: "C-Klasse",
    baujahr: 2020,
    kennzeichen: "B-MN 7890",
    status: "Verfügbar",
    preis: 55,
    bilder: 2,
  },
]

export default function AnbieterDetailPage({ params }: { params: { anbieterId: string } }) {
  const [activeTab, setActiveTab] = useState("uebersicht")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/benutzer?tab=anbieter">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Anbieter: {anbieter.name}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="uebersicht">Übersicht</TabsTrigger>
          <TabsTrigger value="fahrzeuge">Fahrzeuge</TabsTrigger>
          <TabsTrigger value="buchungen">Buchungen</TabsTrigger>
          <TabsTrigger value="einstellungen">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="uebersicht" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fahrzeuge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{anbieter.fahrzeuge}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Buchungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{anbieter.buchungen}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{anbieter.umsatz}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Anbieterinformationen</CardTitle>
              <CardDescription>Details zum Anbieter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Kontaktdaten</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {anbieter.name}
                    </p>
                    <p>
                      <span className="font-medium">E-Mail:</span> {anbieter.email}
                    </p>
                    <p>
                      <span className="font-medium">Telefon:</span> {anbieter.telefon}
                    </p>
                    <p>
                      <span className="font-medium">Adresse:</span> {anbieter.adresse}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Weitere Informationen</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Status:</span> {anbieter.status}
                    </p>
                    <p>
                      <span className="font-medium">Registriert am:</span> {anbieter.registriert}
                    </p>
                    <p>
                      <span className="font-medium">Beschreibung:</span>
                    </p>
                    <p className="text-sm">{anbieter.beschreibung}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fahrzeuge" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Fahrzeuge von {anbieter.name}</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Fahrzeug hinzufügen
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fahrzeug</TableHead>
                    <TableHead>Kennzeichen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Preis/Tag</TableHead>
                    <TableHead>Bilder</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fahrzeuge.map((fahrzeug) => (
                    <TableRow key={fahrzeug.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <CarFront className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {fahrzeug.marke} {fahrzeug.modell}
                            </div>
                            <div className="text-sm text-muted-foreground">{fahrzeug.baujahr}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{fahrzeug.kennzeichen}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            fahrzeug.status === "Verfügbar"
                              ? "bg-green-100 text-green-800"
                              : fahrzeug.status === "Gebucht"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {fahrzeug.status}
                        </div>
                      </TableCell>
                      <TableCell>{fahrzeug.preis}€</TableCell>
                      <TableCell>{fahrzeug.bilder}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Link href={`/admin/anbieter/${params.anbieterId}/fahrzeuge/${fahrzeug.id}/bilder`}>
                            <Button variant="ghost" size="icon">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buchungen" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Buchungen</CardTitle>
              <CardDescription>Alle Buchungen für Fahrzeuge dieses Anbieters</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Hier werden die Buchungen angezeigt.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="einstellungen" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Einstellungen</CardTitle>
              <CardDescription>Verwalten Sie die Einstellungen für diesen Anbieter</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Hier können Sie die Einstellungen des Anbieters bearbeiten.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

