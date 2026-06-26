"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { EventRow } from "@/lib/types"
import { deleteEvent } from "@/lib/actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Calendar, MapPin, Copy, Check, Trash2, Users } from "lucide-react"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function EventCard({ event }: { event: EventRow }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function copyLink() {
    const url = `${window.location.origin}/convite/${event.slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Link copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDelete() {
    if (!confirm("Excluir este evento e todas as confirmações?")) return
    startTransition(async () => {
      const result = await deleteEvent(event.id)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Evento excluído.")
      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-balance">{event.title}</CardTitle>
        <div className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            {formatDate(event.event_date)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            {event.location}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copiar link
          </Button>
          <Link
            href={`/convite/${event.slug}`}
            target="_blank"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Abrir convite
          </Link>
          <Link
            href={`/admin/${event.slug}`}
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            <Users className="h-4 w-4" />
            Confirmações
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
