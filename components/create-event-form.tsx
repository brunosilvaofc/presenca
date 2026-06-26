"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createEvent } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export function CreateEventForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formKey, setFormKey] = useState(0)

  function action(formData: FormData) {
    startTransition(async () => {
      const result = await createEvent(formData)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Evento criado com sucesso!")
      setFormKey((k) => k + 1)
      router.refresh()
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form key={formKey} action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Nome do evento *</Label>
            <Input id="title" name="title" placeholder="Aniversário da Maria" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event_date">Data e hora *</Label>
            <Input id="event_date" name="event_date" type="datetime-local" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Local *</Label>
            <Input id="location" name="location" placeholder="Salão de festas" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" name="address" placeholder="Rua das Flores, 123" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="host_name">Anfitrião</Label>
            <Input id="host_name" name="host_name" placeholder="Maria Silva" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Detalhes adicionais sobre o evento..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Criando..." : "Criar evento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
