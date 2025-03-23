import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Einzelnes Fahrzeug abrufen
export async function GET(request, { params }) {
  const { id } = params
  
  const { data, error } = await supabase
    .from('fahrzeuge')
    .select(`
      *,
      anbieter:anbieter_id (id, name, telefon, adresse, beschreibung),
      fahrzeug_ausstattung (ausstattung),
      fahrzeug_bilder (id, bild_url, ist_hauptbild),
      fahrzeug_bewertungen (id, user_id, bewertung, kommentar, erstellt_am)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Extras für Buchungen abrufen
  const { data: extras, error: extrasError } = await supabase
    .from('extras')
    .select('*')
    .eq('aktiv', true)
  
  if (extrasError) {
    return NextResponse.json({ error: extrasError.message }, { status: 500 })
  }
  
  return NextResponse.json({ ...data, extras })
}
