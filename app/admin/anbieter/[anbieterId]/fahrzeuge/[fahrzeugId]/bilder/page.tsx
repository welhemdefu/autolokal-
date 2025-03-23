// Bildupload-Funktion hinzufügen
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('istHauptbild', i === 0 && uploadedImages.length === 0 ? 'true' : 'false')
      
      try {
        const response = await fetch(`/api/fahrzeuge/${fahrzeugId}/bilder`, {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error('Fehler beim Hochladen des Bildes')
        }
        
        const data = await response.json()
        // Aktualisiere die Bilderliste
        setUploadedImages(prev => [...prev, data.bild_url])
      } catch (error) {
        console.error('Fehler beim Hochladen:', error)
      }
    }
  }
}

// Ersetze die bestehende handleImageUpload-Funktion mit dieser
