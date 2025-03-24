import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const fahrzeugId = formData.get("fahrzeugId")
    const anbieterId = formData.get("anbieterId")
    const isMainImage = formData.get("isMainImage") === "true"

    if (!file || !fahrzeugId || !anbieterId) {
      return NextResponse.json({ error: "File, fahrzeugId, and anbieterId are required" }, { status: 400 })
    }

    // Create a unique file name
    const fileName = `${Date.now()}_${file.name}`

    // Convert the file to an array buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("fahrzeug-bilder")
      .upload(`${anbieterId}/${fahrzeugId}/${fileName}`, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("fahrzeug-bilder").getPublicUrl(`${anbieterId}/${fahrzeugId}/${fileName}`)

    // Save image reference in the database
    const { data: imageData, error: imageError } = await supabaseAdmin
      .from("fahrzeug_bilder")
      .insert([
        {
          fahrzeug_id: fahrzeugId,
          anbieter_id: anbieterId,
          url: publicUrl,
          dateiname: fileName,
          hauptbild: isMainImage,
        },
      ])
      .select()

    if (imageError) {
      console.error("Database error:", imageError)
      return NextResponse.json({ error: imageError.message }, { status: 500 })
    }

    // If this is the main image, update the fahrzeug table
    if (isMainImage) {
      const { error: updateError } = await supabaseAdmin
        .from("fahrzeuge")
        .update({ hauptbild_url: publicUrl })
        .eq("id", fahrzeugId)

      if (updateError) {
        console.error("Update error:", updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      image: {
        id: imageData[0].id,
        url: publicUrl,
        isMainImage,
      },
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

