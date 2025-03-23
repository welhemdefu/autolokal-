import type React from "react"
import { Button } from "@/components/ui/button"
import { CarFront, Users, Calendar, BarChart3, Settings, LogOut, FileText, UserCog } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"

export const metadata = {
  title: "AutoLokal Admin",
  description: "Admin-Bereich für AutoLokal",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 font-bold text-xl p-4">
              <CarFront className="h-6 w-6" />
              <span>AutoLokal Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin">
                    <BarChart3 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/benutzer">
                    <Users className="h-5 w-5" />
                    <span>Kunden</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/anbieter">
                    <UserCog className="h-5 w-5" />
                    <span>Anbieter</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/admin/anbieter">Übersicht</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/admin/anbieter/fahrzeuge">Fahrzeuge</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/admin/bilder">Bilder</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/buchungen">
                    <Calendar className="h-5 w-5" />
                    <span>Buchungen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/blog">
                    <FileText className="h-5 w-5" />
                    <span>Blog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/einstellungen">
                    <Settings className="h-5 w-5" />
                    <span>Einstellungen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <div className="absolute bottom-6 left-6 right-6">
            <Link href="/">
              <Button variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Zurück zur Website
              </Button>
            </Link>
          </div>
          <SidebarRail />
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-white">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="md:hidden flex items-center gap-2 font-bold text-xl">
                <CarFront className="h-6 w-6" />
                <span>AutoLokal Admin</span>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm font-medium">Admin</span>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Abmelden
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

