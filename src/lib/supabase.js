import { createClient } from '@supabase/supabase-js'
import { SUPABASE_PUBLIC } from '../data/supabase-config'

const url = import.meta.env.VITE_SUPABASE_URL || SUPABASE_PUBLIC.url
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_PUBLIC.publishableKey

/** Browser client, or null when Supabase is not configured (site then uses src/data). */
export const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

export const isSupabaseConfigured = () => supabase !== null
