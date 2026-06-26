"use client"

import { useState, useTransition, useRef } from "react"
import { rsvp } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle2, HeartCrack } from "lucide-react"

export function RsvpForm({ eventId }: { eventId: string }) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState<"confirmed" | "declined" | null>(null)
  
  // Estados para controlar o comportamento do Modal
  const [showModal, setShowModal] = useState(false)
  const [pendingData, setPendingData] = useState<FormData | null>(null)
  
  // Referência para ler os valores dos campos antes do clique
  const formRef = useRef<HTMLFormElement>(null)

  function executeSubmit(formData: FormData, status: "confirmed" | "declined") {
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

  function handleActionAttempt(formData: FormData, status: "confirmed" | "declined") {
    // Validação básica nativa antes de qualquer coisa para evitar campos vazios abrindo o modal
    const fullName = String(formData.get("full_name") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    
    if (!fullName || !phone) {
      toast.error("Por favor, preencha o nome completo e o telefone primeiro.")
      return
    }

    if (status === "declined") {
      // Guarda os dados preenchidos e abre o modal em vez de enviar direto
      setPendingData(formData)
      setShowModal(true)
      return
    }

    // Se confirmou presença, segue o fluxo normal imediatamente
    executeSubmit(formData, "confirmed")
  }

  // Função chamada de dentro do modal quando o usuário clica em "Confirmar Ausência"
  function handleConfirmAusencia() {
    setShowModal(false)
    if (pendingData) {
      executeSubmit(pendingData, "declined")
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-[#556b2f]/5 p-6 text-center border border-[#e6e6df]">
        <CheckCircle2 className="h-10 w-10 text-[#556b2f]" />
        <p className="font-serif text-base text-[#2c352e]">
          {done === "confirmed"
            ? "Presença confirmada! Obrigado."
            : "Resposta registrada. Sentiremos sua falta!"}
        </p>
      </div>
    )
  }

  return (
    <>
      <form ref={formRef} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="full_name" className="text-xs font-medium text-[#6b7c6e] uppercase tracking-wider">
            Nome completo *
          </Label>
          <Input 
            id="full_name" 
            name="full_name" 
            placeholder="Seu nome completo" 
            required 
          
            className="border-[#e6e6df] focus-visible:ring-[#556b2f] bg-white text-[#2c352e] placeholder:text-[#6b7c6e]/50"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="text-xs font-medium text-[#6b7c6e] uppercase tracking-wider">
            Telefone *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            required
            
            className="border-[#e6e6df] focus-visible:ring-[#556b2f] bg-white text-[#2c352e] placeholder:text-[#6b7c6e]/50"
          />
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-[#556b2f] hover:bg-[#425424] text-white"
            formAction={(fd) => handleActionAttempt(fd, "confirmed")}
          >
            {isPending ? "Enviando..." : "Confirmar presença"}
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={isPending}
            className="flex-1 border-[#e6e6df] text-[#4a554c] hover:bg-[#556b2f]/5 hover:text-[#2c352e]"
            formAction={(fd) => handleActionAttempt(fd, "declined")}
          >
            Não poderei ir
          </Button>
        </div>
      </form>

      {/* --- RENDERIZAÇÃO DO MODAL INTEGRADO --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop esmaecido */}
          <div 
            className="absolute inset-0 bg-[#2c352e]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />

          {/* Caixa do Modal */}
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl border border-[#e6e6df] bg-[#faf9f5] p-6 text-center shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#556b2f]/10 text-[#556b2f]">
              <HeartCrack className="h-6 w-6" />
            </div>

            <h3 className="font-serif text-lg font-normal tracking-wide text-[#2c352e]">
              Tem certeza que não poderá ir?
            </h3>
            <p className="mt-2 text-sm text-[#6b7c6e] leading-relaxed">
              Sentiremos muito a sua falta nesse dia tão especial! Se quiser mudar de ideia, pode fechar este aviso.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
              <button
                type="button"
                onClick={handleConfirmAusencia}
                className="w-full rounded-xl bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Confirmar Ausência
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl border border-[#e6e6df] bg-white px-4 py-2.5 text-sm font-medium text-[#4a554c] hover:bg-[#faf9f5] transition-colors"
              >
                Mudei de ideia
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}