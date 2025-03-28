"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useDashboard } from "../context/dashboard-provider"

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
}

const projectFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do projeto deve ter pelo menos 2 caracteres.",
  }),
  client: z.string().min(2, {
    message: "O nome do cliente deve ter pelo menos 2 caracteres.",
  }),
  type: z.string().min(1, {
    message: "Por favor, selecione um tipo de projeto.",
  }),
  status: z.enum(["in-progress", "completed", "pending", "cancelled"], {
    required_error: "Por favor, selecione um status.",
  }),
  startDate: z.string().min(1, {
    message: "Por favor, selecione uma data de início.",
  }),
  endDate: z.string().min(1, {
    message: "Por favor, selecione uma data de término.",
  }),
  value: z.coerce.number().positive({
    message: "O valor deve ser um número positivo.",
  }),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ConvertToProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  estimate: Estimate
}

export function ConvertToProjectDialog({ open, onOpenChange, estimate }: ConvertToProjectDialogProps) {
  const { dispatch, getNextId } = useDashboard()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Calcular data de término estimada (30 dias após a data do orçamento)
  const startDate = new Date(estimate.date)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 30)

  const defaultValues: Partial<ProjectFormValues> = {
    name: `${estimate.type} - ${estimate.client}`,
    client: estimate.client,
    type: estimate.type,
    status: "pending",
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    value: estimate.value,
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  })

  function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true)

    try {
      // Criar novo projeto a partir do orçamento
      const newProject = {
        ...data,
        id: getNextId("project"),
      }

      // Adicionar o projeto ao estado
      dispatch({ type: "ADD_PROJECT", payload: newProject })

      // Fechar o diálogo e redirecionar para a página do projeto
      setTimeout(() => {
        onOpenChange(false)
        router.push(`/dashboard/projects/${newProject.id}`)
      }, 1000)
    } catch (error) {
      console.error("Erro ao converter orçamento em projeto:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Converter Orçamento em Projeto</DialogTitle>
          <DialogDescription>
            Preencha os detalhes adicionais para converter este orçamento em um projeto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
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
                    <FormLabel>Tipo de Projeto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de projeto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pintura Residencial">Pintura Residencial</SelectItem>
                        <SelectItem value="Pintura Comercial">Pintura Comercial</SelectItem>
                        <SelectItem value="Reforma de Interiores">Reforma de Interiores</SelectItem>
                        <SelectItem value="Pintura Externa">Pintura Externa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Valor do Projeto (R$)</FormLabel>
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
                        <SelectItem value="in-progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Convertendo..." : "Converter em Projeto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

