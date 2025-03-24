import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  const { id } = params

  const { data, error } = await supabaseAdmin
    .from("fahrzeug_bilder")
    .select("*")
    .eq("fahrzeug_id", id)
    .order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const { id } = params
  const { imageUrl } = await request.json()

  // First, get the image record to find the filename
  const { data: imageData, error: fetchError } = await supabaseAdmin
    .from("fahrzeug_bilder")
    .select("*")
    .eq("fahrzeug_id", id)
    .eq("url", imageUrl)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  if (!imageData) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }

  // Delete the image from storage
  const { error: storageError } = await supabaseAdmin.storage
    .from("fahrzeug-bilder")
    .remove([`${imageData.anbieter_id}/${id}/${imageData.dateiname}`])

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 })
  }

  // Delete the image record from the database
  const { error: dbError } = await supabaseAdmin.from("fahrzeug_bilder").delete().eq("id", imageData.id)

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
