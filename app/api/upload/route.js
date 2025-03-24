import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })

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

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fahrzeug-bilder")
      .upload(`${anbieterId}/${fahrzeugId}/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("fahrzeug-bilder").getPublicUrl(`${anbieterId}/${fahrzeugId}/${fileName}`)

    // Save image reference in the database
    const { data: imageData, error: imageError } = await supabase
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
      const { error: updateError } = await supabase
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

