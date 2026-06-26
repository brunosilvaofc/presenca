import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { EventRow } from "@/lib/types"
import { RsvpForm } from "@/components/rsvp-form"
import { Calendar, MapPin, User, Heart } from "lucide-react"

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
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center bg-[#fdfdfb] px-6 py-16 selection:bg-[#4a5d4e]/20">
      {/* Container principal com borda dupla sutil e fundo off-white clássico de convites */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e6e6df] bg-[#faf9f5] p-8 md:p-10 shadow-xl shadow-[#3a473d]/5 ring-1 ring-black/5">
        
        {/* Detalhe decorativo minimalista superior em Verde Oliva */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#556b2f]" />

        {/* Cabeçalho do Convite */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#556b2f]/10 text-[#556b2f]">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7c6e]">
            Com a alegria do nosso amor, convidamos você
          </p>
          
          <h1 className="font-serif text-3xl font-normal tracking-wide text-[#2c352e] text-balance sm:text-4xl">
            {event.title}
          </h1>
        </div>

        {/* Descrição / Mensagem aos convidados */}
        {event.description && (
          <p className="mt-6 text-center text-sm font-light italic leading-relaxed text-[#4a554c] text-pretty border-b border-[#e6e6df] pb-6">
            "{event.description}"
          </p>
        )}

        {/* Detalhes do Evento (Data, Local, Anfitrião) */}
        <div className="mt-6 flex flex-col gap-4 text-sm text-[#3d473f]">
          
          {/* Data */}
          <div className="flex items-start gap-4 rounded-xl bg-[#556b2f]/5 p-3.5 transition-colors duration-200">
            <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#556b2f]" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6b7c6e]">Data & Horário</span>
              <span className="capitalize font-medium text-[#2c352e]">{formatDate(event.event_date)}</span>
            </div>
          </div>

          {/* Local */}
          <div className="flex items-start gap-4 rounded-xl bg-[#556b2f]/5 p-3.5 transition-colors duration-200">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#556b2f]" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6b7c6e]">Local da Celebração</span>
              <span className="font-medium text-[#2c352e]">{event.location}</span>
              {event.address && (
                <span className="mt-0.5 text-xs text-[#5c695e]">{event.address}</span>
              )}
            </div>
          </div>

          {/* Anfitrião */}
          {event.host_name && (
            <div className="flex items-start gap-4 rounded-xl bg-[#556b2f]/5 p-3.5 transition-colors duration-200">
              <User className="mt-0.5 h-5 w-5 shrink-0 text-[#556b2f]" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wider text-[#6b7c6e]">Organizado por</span>
                <span className="font-medium text-[#2c352e]">{event.host_name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bloco do RSVP / Confirmação de Presença */}
        <div className="mt-10 border-t border-[#e6e6df] pt-8">
          <div className="mb-6 text-center">
            <h2 className="font-serif text-xl tracking-wide text-[#2c352e]">
              Confirmar Presença
            </h2>
            <p className="mt-1 text-xs text-[#6b7c6e]">
              Sua presença tornará nosso dia ainda mais inesquecível.
            </p>
          </div>
          
          {/* Área do formulário injetado sem mutação de props */}
          <div className="rsvp-form-wrapper [&_button]:bg-[#556b2f] [&_button]:hover:bg-[#425424] [&_button]:text-white [&_button]:font-medium [&_button]:rounded-xl [&_input]:rounded-xl [&_select]:rounded-xl">
            <RsvpForm eventId={event.id} />
          </div>
        </div>

      </div>
    </main>
  )
}