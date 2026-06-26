"use client"

import { useState, useTransition } from "react"
import { rsvp } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"

export function RsvpForm({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState<"confirmed" | "declined" | null>(null)

  function submit(formData: FormData, status: "confirmed" | "declined") {
    formData.set("event_id", eventId)
    formData.set("status", status)
    startTransition(async () => {
      const result = await rsvp(formData)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      setDone(status)
    })
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-secondary p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <p className="font-medium">
          {done === "confirmed"
            ? "Presença confirmada! Obrigado."
            : "Resposta registrada. Sentiremos sua falta!"}
        </p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name">Nome completo *</Label>
        <Input id="full_name" name="full_name" placeholder="Seu nome completo" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(11) 99999-9999"
          required
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1"
          formAction={(fd) => submit(fd, "confirmed")}
        >
          {isPending ? "Enviando..." : "Confirmar presença"}
        </Button>
        <Button
          type="submit"
          variant="outline"
          disabled={isPending}
          className="flex-1"
          formAction={(fd) => submit(fd, "declined")}
        >
          Não poderei ir
        </Button>
      </div>
    </form>
  )
}
