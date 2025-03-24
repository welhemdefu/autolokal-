"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, UserCheck, UserX, ExternalLink, CarFront } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function AdminAnbieterPage() {
  // Move state declarations outside of conditional blocks
  const [anbieter, setAnbieter] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("alle")
  const { toast } = useToast()

  // Filtern der Anbieter basierend auf Suchbegriff und Status
  const filteredAnbieter = anbieter.filter((anbieter) => {
    const matchesSearch =
      anbieter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anbieter.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "alle" || anbieter.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Add this useEffect to fetch providers
  useEffect(() => {
    const fetchAnbieter = async () => {
      try {
        const response = await fetch("/api/anbieter")
        if (!response.ok) throw new Error("Failed to fetch providers")
        const data = await response.json()
        setAnbieter(data)
      } catch (error) {
        console.error("Error fetching providers:", error)
        toast({
          title: "Fehler",
          description: "Anbieter konnten nicht geladen werden.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnbieter()
  }, [toast])

  // Add this function to handle provider updates
  const handleUpdateAnbieter = async (id, updates) => {
    try {
      const response = await fetch(`/api/anbieter/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed to update provider")

      // Update the local state
      setAnbieter((prev) => prev.map((anbieter) => (anbieter.id === id ? { ...anbieter, ...updates } : anbieter)))

      toast({
        title: "Erfolg",
        description: "Anbieter wurde aktualisiert.",
      })
    } catch (error) {
      console.error("Error updating provider:", error)
      toast({
        title: "Fehler",
        description: "Anbieter konnte nicht aktualisiert werden.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Anbieter</h1>
          <p className="text-muted-foreground">Verwalten Sie alle Anbieter auf der Plattform.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Anbieter hinzufügen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anbieter durchsuchen</CardTitle>
          <CardDescription>Filtern und durchsuchen Sie alle registrierten Anbieter.</CardDescription>
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
          <CardTitle>Anbieterliste</CardTitle>
          <CardDescription>{filteredAnbieter.length} Anbieter gefunden</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registriert am</TableHead>
                <TableHead>Fahrzeuge</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnbieter.map((anbieter) => (
                <TableRow key={anbieter.id}>
                  <TableCell>
                    <div className="font-medium">{anbieter.name}</div>
                  </TableCell>
                  <TableCell>{anbieter.email}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        anbieter.status === "Aktiv"
                          ? "bg-green-100 text-green-800"
                          : anbieter.status === "Verifizierung ausstehend"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {anbieter.status}
                    </div>
                  </TableCell>
                  <TableCell>{anbieter.registriert}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CarFront className="h-3 w-3 text-muted-foreground" />
                      <span>{anbieter.fahrzeuge}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/anbieter/${anbieter.id}`}>
                        <Button variant="ghost" size="icon" title="Details anzeigen">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {anbieter.status === "Aktiv" ? (
                        <Button variant="ghost" size="icon">
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : anbieter.status === "Gesperrt" ? (
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

