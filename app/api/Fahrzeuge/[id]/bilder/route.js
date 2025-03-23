import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Bilder für ein Fahrzeug hochladen
export async function POST(request, { params }) {
  const { id } = params
  const formData = await request.formData()
  const file = formData.get('file')
  const istHauptbild = formData.get('istHauptbild') === 'true'
  
  if (!file) {
    return NextResponse.json({ error: 'Keine Datei gefunden' }, { status: 400 })
  }
  
  // Datei in einen Buffer umwandeln
  const fileBuffer = await file.arrayBuffer()
  const fileArray = new Uint8Array(fileBuffer)
  
  // Eindeutigen Dateinamen generieren
  const fileExt = file.name.split('.').pop()
  const fileName = `${id}/${Date.now()}.${fileExt}`
  
  // Bild in Supabase Storage hochladen
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('fahrzeug-bilder')
    .upload(fileName, fileArray, {
      contentType: file.type
    })
  
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }
  
  // Öffentliche URL des Bildes abrufen
  const { data: { publicUrl } } = supabase
    .storage
    .from('fahrzeug-bilder')
    .getPublicUrl(fileName)
  
  // Bild-URL in der Datenbank speichern
  const { data: bildData, error: bildError } = await supabase
    .from('fahrzeug_bilder')
    .insert([{
      fahrzeug_id: id,
      bild_url: publicUrl,
      ist_hauptbild: istHauptbild
    }])
    .select()
  
  if (bildError) {
    return NextResponse.json({ error: bildError.message }, { status: 500 })
  }
  
  return NextResponse.json(bildData[0])
}
