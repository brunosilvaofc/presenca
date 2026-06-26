import { createClient } from "@/lib/supabase/server"
import type { EventRow } from "@/lib/types"
import { CreateEventForm } from "@/components/create-event-form"
import { EventCard } from "@/components/event-card"
import { CalendarDays } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })

  const list = (events ?? []) as EventRow[]

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      <header className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Confirmação de Presença
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie eventos e compartilhe o link de confirmação.
          </p>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Novo evento
          </h2>
          <CreateEventForm />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Seus eventos
          </h2>
          {list.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Nenhum evento ainda. Crie o primeiro ao lado.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {list.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
