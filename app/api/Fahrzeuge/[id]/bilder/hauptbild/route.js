import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function PUT(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })

  const { id } = params
  const { imageUrl } = await request.json()

  // First, reset all images to not be the main image
  const { error: resetError } = await supabase
    .from("fahrzeug_bilder")
    .update({ hauptbild: false })
    .eq("fahrzeug_id", id)

  if (resetError) {
    return NextResponse.json({ error: resetError.message }, { status: 500 })
  }

  // Set the selected image as the main image
  const { error: updateImageError } = await supabase
    .from("fahrzeug_bilder")
    .update({ hauptbild: true })
    .eq("fahrzeug_id", id)
    .eq("url", imageUrl)

  if (updateImageError) {
    return NextResponse.json({ error: updateImageError.message }, { status: 500 })
  }

  // Update the fahrzeug table with the main image URL
  const { error: updateFahrzeugError } = await supabase
    .from("fahrzeuge")
    .update({ hauptbild_url: imageUrl })
    .eq("id", id)

  if (updateFahrzeugError) {
    return NextResponse.json({ error: updateFahrzeugError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

