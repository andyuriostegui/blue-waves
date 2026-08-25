import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://jzaldlodozcpdevmplco.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseAnonKey) {
  console.error("❌ ¡Faltan las llaves de Supabase en el .env.local!")
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'public-anon-key-missing',
)