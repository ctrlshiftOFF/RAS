"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Tipo para os orçamentos
interface Estimate {
  id: string
  client: string
  address: string
  type: string
  date: string
  time: string
  value: number
  status: "pending" | "approved" | "rejected" | "completed"
  source: "website" | "admin"
}

const estimateFormSchema = z.object({
  client: z.string().min(2, {
    message: "O nome do cliente deve ter pelo menos 2 caracteres.",
  }),
  address: z.string().min(5, {
    message: "O endereço deve ter pelo menos 5 caracteres.",
  }),
  type: z.string().min(1, {
    message: "Por favor, selecione um tipo de serviço.",
  }),
  date: z.string().min(1, {
    message: "Por favor, selecione uma data.",
  }),
  time: z.string().min(1, {
    message: "Por favor, selecione um horário.",
  }),
  value: z.coerce.number().positive({
    message: "O valor deve ser um número positivo.",
  }),
  notes: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "completed"], {
    required_error: "Por favor, selecione um status.",
  }),
  source: z.enum(["website", "admin"], {
    required_error: "Por favor, selecione uma origem.",
  }),
})

type EstimateFormValues = z.infer<typeof estimateFormSchema>

interface EstimateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  estimate?: Estimate
  mode?: "create" | "edit"
  defaultDate?: string
  onClose?: () => void
  onAddEstimate?: (estimate: Estimate) => void
}

export function EstimateDialog({
  open,
  onOpenChange,
  estimate,
  mode = "create",
  defaultDate,
  onClose,
  onAddEstimate,
}: EstimateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<EstimateFormValues> = {
    client: estimate?.client || "",
    address: estimate?.address || "",
    type: estimate?.type || "",
    date: defaultDate || estimate?.date || new Date().toISOString().split("T")[0],
    time: estimate?.time || "09:00",
    value: estimate?.value || 0,
    notes: "",
    status: estimate?.status || "pending",
    source: estimate?.source || "admin",
  }

  const form = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateFormSchema),
    defaultValues,
  })

  function onSubmit(values: EstimateFormValues) {
    setIsSubmitting(true)

    // Simular envio do formulário
    setTimeout(() => {
      // Criar um novo orçamento com os valores do formulário
      const newEstimate: Estimate = {
        id: mode === "edit" && estimate ? estimate.id : `EST-${Math.floor(Math.random() * 1000)}`,
        client: values.client,
        address: values.address,
        type: values.type,
        date: values.date,
        time: values.time,
        value: values.value,
        status: values.status,
        source: values.source,
      }

      // Chamar a função onAddEstimate se ela existir
      if (onAddEstimate) {
        onAddEstimate(newEstimate)
      }

      setIsSubmitting(false)
      onOpenChange(false)
      if (onClose) onClose()
    }, 1000)
  }

  const handleClose = () => {
    onOpenChange(false)
    if (onClose) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Adicionar Novo Orçamento" : "Editar Orçamento"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha os detalhes para criar um novo orçamento."
              : "Atualize as informações do orçamento."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Serviço</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pintura Externa">Pintura Externa</SelectItem>
                        <SelectItem value="Pintura Interna">Pintura Interna</SelectItem>
                        <SelectItem value="Pintura Comercial">Pintura Comercial</SelectItem>
                        <SelectItem value="Reforma de Banheiro">Reforma de Banheiro</SelectItem>
                        <SelectItem value="Reforma de Cozinha">Reforma de Cozinha</SelectItem>
                        <SelectItem value="Reforma Geral">Reforma Geral</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Estimado (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Origem do Orçamento</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="admin" />
                        </FormControl>
                        <FormLabel className="font-normal">Administrativo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="website" />
                        </FormControl>
                        <FormLabel className="font-normal">Site (Cliente)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações ou detalhes adicionais sobre o orçamento"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : mode === "create" ? "Adicionar Orçamento" : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

