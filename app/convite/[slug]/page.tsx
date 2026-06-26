import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { EventRow } from "@/lib/types"
import { RsvpForm } from "@/components/rsvp-form"
import { Calendar, MapPin, User } from "lucide-react"

export const dynamic = "force-dynamic"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (!data) {
    notFound()
  }

  const event = data as EventRow

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Você está convidado
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          {event.title}
        </h1>

        {event.description && (
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm">
          <span className="flex items-center gap-3">
            <Calendar className="h-5 w-5 shrink-0 text-primary" />
            <span className="capitalize">{formatDate(event.event_date)}</span>
          </span>
          <span className="flex items-start gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <span>
              {event.location}
              {event.address && (
                <span className="block text-muted-foreground">{event.address}</span>
              )}
            </span>
          </span>
          {event.host_name && (
            <span className="flex items-center gap-3">
              <User className="h-5 w-5 shrink-0 text-primary" />
              <span>Anfitrião: {event.host_name}</span>
            </span>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <h2 className="mb-4 text-lg font-medium">Confirme sua presença</h2>
          <RsvpForm eventId={event.id} />
        </div>
      </div>
    </main>
  )
}
