import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ipnaikwgrigfstrbfwbg.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_iquYp6BriiA2yK7N8ykg1w_Vo7vsFSn"
  )
}
