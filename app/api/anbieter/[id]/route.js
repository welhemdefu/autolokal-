import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })

  const { id } = params

  const { data, error } = await supabase.from("anbieter").select("*").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })

  const { id } = params
  const updates = await request.json()

  const { data, error } = await supabase.from("anbieter").update(updates).eq("id", id).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies })

  const { id } = params

  const { error } = await supabase.from("anbieter").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

