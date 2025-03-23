"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react"

// Beispieldaten für Benutzer
const kunden = [
  {
    id: 1,
    name: "Max Mustermann",
    email: "max.mustermann@example.com",
    status: "Aktiv",
    registriert: "15.03.2025",
    buchungen: 3,
  },
  {
    id: 2,
    name: "Anna Schmidt",
    email: "anna.schmidt@example.com",
    status: "Aktiv",
    registriert: "20.03.2025",
    buchungen: 1,
  },
  {
    id: 5,
    name: "Thomas Weber",
    email: "thomas.weber@example.com",
    status: "Gesperrt",
    registriert: "01.03.2025",
    buchungen: 0,
  },
]

export default function AdminBenutzerPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState<string>("kunden")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("alle")

  // Filtern der Benutzer basierend auf Suchbegriff und Status
  const filteredKunden = kunden.filter((kunde) => {
    const matchesSearch =
      kunde.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kunde.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "alle" || kunde.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kunden</h1>
          <p className="text-muted-foreground">Verwalten Sie alle Kunden auf der Plattform.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Kunde hinzufügen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kunden durchsuchen</CardTitle>
          <CardDescription>Filtern und durchsuchen Sie alle registrierten Kunden.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Name, E-Mail..."
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
                <SelectItem value="aktiv">Aktiv</SelectItem>
                <SelectItem value="verifizierung ausstehend">Verifizierung ausstehend</SelectItem>
                <SelectItem value="gesperrt">Gesperrt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kundenliste</CardTitle>
          <CardDescription>{filteredKunden.length} Kunden gefunden</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registriert am</TableHead>
                <TableHead>Buchungen</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKunden.map((kunde) => (
                <TableRow key={kunde.id}>
                  <TableCell>
                    <div className="font-medium">{kunde.name}</div>
                  </TableCell>
                  <TableCell>{kunde.email}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${
                      kunde.status === "Aktiv"
                        ? "bg-green-100 text-green-800"
                        : kunde.status === "Verifizierung ausstehend"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                    >
                      {kunde.status}
                    </div>
                  </TableCell>
                  <TableCell>{kunde.registriert}</TableCell>
                  <TableCell>{kunde.buchungen}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {kunde.status === "Aktiv" ? (
                        <Button variant="ghost" size="icon">
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : kunde.status === "Gesperrt" ? (
                        <Button variant="ghost" size="icon">
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      ) : null}
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
    </div>
  )
}

