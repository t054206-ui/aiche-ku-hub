/**
 * Public Supabase connection details (safe to commit: the publishable key is
 * designed for browsers and Row Level Security controls what it can do).
 * Environment variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY override these.
 * Leave both empty to run the site fully from the static files in src/data.
 */
export const SUPABASE_PUBLIC = {
  url: 'https://njrysdonstvtmnocmqsx.supabase.co',
  publishableKey: 'sb_publishable_KnGg3df902c3pGuktGtk-w_YskXM7w5',
}
