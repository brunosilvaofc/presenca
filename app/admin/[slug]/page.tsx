import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { EventRow, GuestRow } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, X, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EventGuestsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (!eventData) {
    notFound()
  }

  const event = eventData as EventRow

  const { data: guestData } = await supabase
    .from("guests")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false })

  const guests = (guestData ?? []) as GuestRow[]
  const confirmed = guests.filter((g) => g.status === "confirmed")
  const declined = guests.filter((g) => g.status === "declined")

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-balance">
        {event.title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Lista de confirmações</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-semibold">{guests.length}</p>
            <p className="text-xs text-muted-foreground">Respostas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-semibold text-primary">{confirmed.length}</p>
            <p className="text-xs text-muted-foreground">Confirmados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-semibold text-muted-foreground">
              {declined.length}
            </p>
            <p className="text-xs text-muted-foreground">Não vão</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        {guests.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
            <Users className="h-8 w-8" />
            <p className="text-sm">Nenhuma confirmação ainda.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {guests.map((guest) => (
              <li
                key={guest.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{guest.full_name}</p>
                  <p className="text-sm text-muted-foreground">{guest.phone}</p>
                </div>
                {guest.status === "confirmed" ? (
                  <Badge className="shrink-0 gap-1">
                    <Check className="h-3 w-3" />
                    Confirmado
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <X className="h-3 w-3" />
                    Não vai
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
