import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ipnaikwgrigfstrbfwbg.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_iquYp6BriiA2yK7N8ykg1w_Vo7vsFSn",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component; can be ignored.
          }
        },
      },
    },
  )
}
