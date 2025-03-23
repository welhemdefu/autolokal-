"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarFront, Plus, Search, Edit, Trash2, Upload, Eye, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Beispieldaten für Anbieter und ihre Fahrzeuge
const anbieterMitFahrzeugen = [
  {
    id: 1,
    name: "Premium Cars GmbH",
    fahrzeuge: [
      {
        id: 1,
        marke: "BMW",
        modell: "3er",
        baujahr: 2021,
        kennzeichen: "B-CD 5678",
        status: "Verfügbar",
        preis: 45,
      },
      {
        id: 2,
        marke: "Audi",
        modell: "A4",
        baujahr: 2022,
        kennzeichen: "B-GH 3456",
        status: "Gebucht",
        preis: 50,
      },
    ],
  },
  {
    id: 2,
    name: "City Rent GmbH",
    fahrzeuge: [
      {
        id: 3,
        marke: "Mercedes-Benz",
        modell: "A-Klasse",
        baujahr: 2019,
        kennzeichen: "B-EF 9012",
        status: "Verfügbar",
        preis: 40,
      },
    ],
  },
  {
    id: 3,
    name: "Eco Drive Berlin",
    fahrzeuge: [
      {
        id: 4,
        marke: "VW",
        modell: "Golf",
        baujahr: 2020,
        kennzeichen: "B-AB 1234",
        status: "Verfügbar",
        preis: 35,
      },
      {
        id: 5,
        marke: "Ford",
        modell: "Focus",
        baujahr: 2020,
        kennzeichen: "B-IJ 7890",
        status: "Verfügbar",
        preis: 30,
      },
    ],
  },
]

export default function AdminFahrzeugePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("alle")
  const [expandedAnbieter, setExpandedAnbieter] = useState<number[]>([])

  // Filtern der Fahrzeuge basierend auf Suchbegriff und Status
  const filteredAnbieter = anbieterMitFahrzeugen
    .map((anbieter) => {
      const filteredFahrzeuge = anbieter.fahrzeuge.filter((fahrzeug) => {
        const matchesSearch =
          fahrzeug.marke.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fahrzeug.modell.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fahrzeug.kennzeichen.toLowerCase().includes(searchTerm.toLowerCase()) ||
          anbieter.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "alle" || fahrzeug.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
      })

      return {
        ...anbieter,
        fahrzeuge: filteredFahrzeuge,
      }
    })
    .filter((anbieter) => anbieter.fahrzeuge.length > 0)

  const toggleAnbieter = (anbieterId: number) => {
    setExpandedAnbieter((prev) =>
      prev.includes(anbieterId) ? prev.filter((id) => id !== anbieterId) : [...prev, anbieterId],
    )
  }

  const totalFahrzeuge = filteredAnbieter.reduce((sum, anbieter) => sum + anbieter.fahrzeuge.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fahrzeuge</h1>
          <p className="text-muted-foreground">Verwalten Sie alle Fahrzeuge auf der Plattform.</p>
        </div>
        <Link href="/admin/anbieter">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Fahrzeug hinzufügen
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fahrzeuge durchsuchen</CardTitle>
          <CardDescription>Filtern und durchsuchen Sie alle verfügbaren Fahrzeuge.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Marke, Modell, Kennzeichen..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle Status</SelectItem>
                <SelectItem value="verfügbar">Verfügbar</SelectItem>
                <SelectItem value="gebucht">Gebucht</SelectItem>
                <SelectItem value="wartung">Wartung</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fahrzeugliste</CardTitle>
          <CardDescription>{totalFahrzeuge} Fahrzeuge gefunden</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnbieter.map((anbieter) => (
              <Collapsible
                key={anbieter.id}
                open={expandedAnbieter.includes(anbieter.id)}
                onOpenChange={() => toggleAnbieter(anbieter.id)}
              >
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CarFront className="h-5 w-5" />
                          {anbieter.name}
                          <span className="text-sm font-normal text-muted-foreground">
                            ({anbieter.fahrzeuge.length} Fahrzeuge)
                          </span>
                        </CardTitle>
                        {expandedAnbieter.includes(anbieter.id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fahrzeug</TableHead>
                            <TableHead>Kennzeichen</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Preis/Tag</TableHead>
                            <TableHead className="text-right">Aktionen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {anbieter.fahrzeuge.map((fahrzeug) => (
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
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Link href={`/admin/anbieter/${anbieter.id}/fahrzeuge/${fahrzeug.id}/bilder`}>
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
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

