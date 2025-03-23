import { redirect } from "next/navigation"

export default function FahrzeugRedirect() {
  redirect("/admin/anbieter/fahrzeuge")
}

