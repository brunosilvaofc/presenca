"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  const title = String(formData.get("title") || "").trim()
  const location = String(formData.get("location") || "").trim()
  const eventDate = String(formData.get("event_date") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const address = String(formData.get("address") || "").trim()
  const hostName = String(formData.get("host_name") || "").trim()

  if (!title || !location || !eventDate) {
    return { error: "Título, local e data são obrigatórios." }
  }

  // 1. Gerar o slug de forma limpa a partir do título
  const slug = title
    .toLowerCase()
    .normalize("NFD")                  // Separa acentos dos caracteres (ex: 'ã' vira 'a' + '~')
    .replace(/[\u0300-\u036f]/g, "")   // Remove os acentos removidos acima
    .replace(/[^a-z0-9 -]/g, "")       // Remove caracteres especiais que não sejam números, letras ou espaços
    .replace(/\s+/g, "-")              // Troca espaços por hífens
    .replace(/-+/g, "-")               // Evita hífens duplicados (-- vira -)
    .trim()

  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      location,
      event_date: new Date(eventDate).toISOString(),
      description: description || null,
      address: address || null,
      host_name: hostName || null,
      slug, // 👈 2. AGORA SIM salvando o slug gerado no banco!
    })
    .select("slug")
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  return { slug: data.slug }
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/")
  return { success: true }
}

export async function rsvp(formData: FormData) {
  const supabase = await createClient()

  const eventId = String(formData.get("event_id") || "")
  const fullName = String(formData.get("full_name") || "").trim()
  const phone = String(formData.get("phone") || "").trim()
  const status = String(formData.get("status") || "confirmed")

  if (!eventId || !fullName || !phone) {
    return { error: "Nome completo e telefone são obrigatórios." }
  }

  if (status !== "confirmed" && status !== "declined") {
    return { error: "Status inválido." }
  }

  const { error } = await supabase.from("guests").insert({
    event_id: eventId,
    full_name: fullName,
    phone,
    status,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
