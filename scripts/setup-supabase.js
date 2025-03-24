// This is a script to help you set up the necessary tables in Supabase
// You can run this manually in the Supabase SQL editor

/*
-- Create anbieter table
CREATE TABLE anbieter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefon TEXT,
  adresse TEXT,
  beschreibung TEXT,
  status TEXT DEFAULT 'Verifizierung ausstehend',
  registriert TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fahrzeuge table
CREATE TABLE fahrzeuge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anbieter_id UUID REFERENCES anbieter(id) ON DELETE CASCADE,
  marke TEXT NOT NULL,
  modell TEXT NOT NULL,
  baujahr INTEGER,
  kennzeichen TEXT,
  typ TEXT,
  preis DECIMAL(10, 2) NOT NULL,
  kraftstoff TEXT,
  sitze INTEGER,
  kofferraum TEXT,
  status TEXT DEFAULT 'Verfügbar',
  beschreibung TEXT,
  ausstattung TEXT[],
  hauptbild_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fahrzeug_bilder table
CREATE TABLE fahrzeug_bilder (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fahrzeug_id UUID REFERENCES fahrzeuge(id) ON DELETE CASCADE,
  anbieter_id UUID REFERENCES anbieter(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  dateiname TEXT NOT NULL,
  hauptbild BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create buchungen table
CREATE TABLE buchungen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fahrzeug_id UUID REFERENCES fahrzeuge(id) ON DELETE SET NULL,
  kunde_id UUID,
  abholdatum TIMESTAMP WITH TIME ZONE NOT NULL,
  rueckgabedatum TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'Bestätigt',
  gesamtpreis DECIMAL(10, 2) NOT NULL,
  extras JSONB,
  zusatzleistungen JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Storage bucket for vehicle images
-- Note: You'll need to create this through the Supabase dashboard or API
*/

