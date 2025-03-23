"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
// ... andere Imports beibehalten ...

export default function SuchePage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [carType, setCarType] = useState("all")
  const [fuelType, setFuelType] = useState("all")
  const [sortBy, setSortBy] = useState("preis-aufsteigend")
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  
  // Neuer State für Fahrzeuge aus der Datenbank
  const [fahrzeuge, setFahrzeuge] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fahrzeuge aus der API laden
  useEffect(() => {
    async function loadFahrzeuge() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/fahrzeuge')
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Fahrzeuge')
        }
        const data = await response.json()
        setFahrzeuge(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFahrzeuge()
  }, [])
  
  // Filter und Sortierung der Fahrzeuge
  const filteredFahrzeuge = fahrzeuge
    .filter((fahrzeug) => {
      const matchesSearch =
        fahrzeug.marke.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fahrzeug.modell.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fahrzeug.anbieter.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrice = fahrzeug.preis >= priceRange[0] && fahrzeug.preis <= priceRange[1]
      const matchesType = carType === "all" || fahrzeug.typ.toLowerCase() === carType.toLowerCase()
      const matchesFuel = fuelType === "all" || fahrzeug.kraftstoff.toLowerCase() === fuelType.toLowerCase()

      return matchesSearch && matchesPrice && matchesType && matchesFuel
    })
    .sort((a, b) => {
      if (sortBy === "preis-aufsteigend") return a.preis - b.preis
      if (sortBy === "preis-absteigend") return b.preis - a.preis
      return 0
    })
  
  // Rest der Komponente bleibt gleich...
  // Nur die Datenquelle ändert sich von der statischen Variable zu filteredFahrzeuge
}
