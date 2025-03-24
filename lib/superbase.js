import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that need more privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

