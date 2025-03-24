import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

// Client for browser usage (with anonymous key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server operations (with service key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

