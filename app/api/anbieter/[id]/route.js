import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  const { id } = params

  const { data, error } = await supabaseAdmin.from("anbieter").select("*").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request, { params }) {
  const { id } = params
  const updates = await request.json()

  const { data, error } = await supabaseAdmin.from("anbieter").update(updates).eq("id", id).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const { id } = params

  const { error } = await supabaseAdmin.from("anbieter").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

