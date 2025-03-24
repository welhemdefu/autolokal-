import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Alle Fahrzeuge abrufen
export async function GET() {
  const { data, error } = await supabase
    .from('fahrzeuge')
    .select(`
      *,
      anbieter:anbieter_id (id, name),
      fahrzeug_ausstattung (ausstattung),
      fahrzeug_bilder (id, bild_url, ist_hauptbild)
    `)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
