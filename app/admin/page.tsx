"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, Users, Car, Calendar, CreditCard, Download } from "lucide-react"

// Beispieldaten für die Diagramme
const bookingsData = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mär", value: 25 },
  { name: "Apr", value: 32 },
  { name: "Mai", value: 40 },
  { name: "Jun", value: 45 },
  { name: "Jul", value: 50 },
  { name: "Aug", value: 55 },
  { name: "Sep", value: 48 },
  { name: "Okt", value: 42 },
  { name: "Nov", value: 38 },
  { name: "Dez", value: 30 },
]

const revenueData = [
  { name: "Jan", value: 2500 },
  { name: "Feb", value: 3200 },
  { name: "Mär", value: 4100 },
  { name: "Apr", value: 4800 },
  { name: "Mai", value: 5500 },
  { name: "Jun", value: 6200 },
  { name: "Jul", value: 6800 },
  { name: "Aug", value: 7500 },
  { name: "Sep", value: 6900 },
  { name: "Okt", value: 6200 },
  { name: "Nov", value: 5500 },
  { name: "Dez", value: 4800 },
]

const vehicleTypeData = [
  { name: "Kleinwagen", value: 25 },
  { name: "Kompaktklasse", value: 35 },
  { name: "Mittelklasse", value: 20 },
  { name: "SUV", value: 15 },
  { name: "Luxusklasse", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("year")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Übersicht über alle wichtigen Kennzahlen</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Letzte Woche</SelectItem>
              <SelectItem value="month">Letzter Monat</SelectItem>
              <SelectItem value="quarter">Letztes Quartal</SelectItem>
              <SelectItem value="year">Letztes Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€58.350</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>12% gegenüber Vorjahr</span>
            </div>
            <div className="mt-3 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData.slice(-6)}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Buchungen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">386</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>8% gegenüber Vorjahr</span>
            </div>
            <div className="mt-3 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingsData.slice(-6)}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kunden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>18% gegenüber Vorjahr</span>
            </div>
            <div className="mt-3 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "Jul", value: 180 },
                    { name: "Aug", value: 195 },
                    { name: "Sep", value: 210 },
                    { name: "Okt", value: 225 },
                    { name: "Nov", value: 235 },
                    { name: "Dez", value: 245 },
                  ]}
                >
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verfügbare Fahrzeuge</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex items-center text-sm text-red-600 mt-1">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span>5% gegenüber Vormonat</span>
            </div>
            <div className="mt-3 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "Jul", value: 48 },
                    { name: "Aug", value: 50 },
                    { name: "Sep", value: 47 },
                    { name: "Okt", value: 45 },
                    { name: "Nov", value: 44 },
                    { name: "Dez", value: 42 },
                  ]}
                >
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="bookings">Buchungen</TabsTrigger>
          <TabsTrigger value="revenue">Umsatz</TabsTrigger>
          <TabsTrigger value="vehicles">Fahrzeuge</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buchungen nach Monat</CardTitle>
                <CardDescription>Anzahl der Buchungen im Jahresverlauf</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Umsatz nach Monat</CardTitle>
                <CardDescription>Umsatzentwicklung im Jahresverlauf (in €)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Anbieter</CardTitle>
                <CardDescription>Anbieter mit den meisten Buchungen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Premium Cars GmbH", value: 124, percentage: 32 },
                    { name: "City Rent GmbH", value: 98, percentage: 25 },
                    { name: "Eco Drive Berlin", value: 85, percentage: 22 },
                    { name: "Autohaus Schmidt", value: 42, percentage: 11 },
                    { name: "Mobility Solutions", value: 37, percentage: 10 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">{item.value} Buchungen</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fahrzeugtypen</CardTitle>
                <CardDescription>Verteilung nach Fahrzeugtyp</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehicleTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {vehicleTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Buchungen im Detail</CardTitle>
              <CardDescription>Detaillierte Analyse der Buchungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Buchungen" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Umsatzanalyse</CardTitle>
              <CardDescription>Detaillierte Analyse des Umsatzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Umsatz (€)" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <CardTitle>Fahrzeuganalyse</CardTitle>
              <CardDescription>Verteilung und Nutzung der Fahrzeuge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vehicleTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {vehicleTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "VW", value: 15 },
                        { name: "BMW", value: 12 },
                        { name: "Audi", value: 10 },
                        { name: "Mercedes", value: 8 },
                        { name: "Ford", value: 7 },
                        { name: "Andere", value: 5 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Anzahl" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Neueste Aktivitäten</CardTitle>
          <CardDescription>Die letzten Buchungen und Registrierungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                type: "booking",
                user: "Max Mustermann",
                vehicle: "BMW 3er",
                date: "Heute, 14:32",
                amount: "€150",
              },
              {
                type: "registration",
                user: "Anna Schmidt",
                date: "Heute, 11:15",
              },
              {
                type: "booking",
                user: "Thomas Weber",
                vehicle: "VW Golf",
                date: "Gestern, 18:45",
                amount: "€105",
              },
              {
                type: "booking",
                user: "Lisa Müller",
                vehicle: "Audi A4",
                date: "Gestern, 10:20",
                amount: "€165",
              },
              {
                type: "registration",
                user: "Michael Schneider",
                date: "22.03.2025, 09:30",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === "booking" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    }`}
                  >
                    {activity.type === "booking" ? <Calendar className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.type === "booking" ? `Hat ${activity.vehicle} gebucht` : "Hat sich registriert"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{activity.date}</p>
                  {activity.amount && <p className="font-medium">{activity.amount}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

