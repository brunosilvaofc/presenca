export type EventRow = {
  id: string
  title: string
  description: string | null
  location: string
  address: string | null
  event_date: string
  host_name: string | null
  slug: string
  created_at: string
}

export type GuestRow = {
  id: string
  event_id: string
  full_name: string
  phone: string
  status: "confirmed" | "declined"
  created_at: string
}
