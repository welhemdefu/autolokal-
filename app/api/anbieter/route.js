import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request) {
  const { data, error } = await supabaseAdmin.from("anbieter").select("*").order("name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request) {
  const newAnbieter = await request.json()

  const { data, error } = await supabaseAdmin.from("anbieter").insert([newAnbieter]).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

