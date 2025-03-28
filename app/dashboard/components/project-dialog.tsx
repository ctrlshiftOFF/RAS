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
import { useDashboard } from "../context/dashboard-provider"
import type { Project } from "../data/dashboard-data"

const projectFormSchema = z.object({
  id: z.string().optional(),
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

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
  mode: "add" | "edit"
}

export function ProjectDialog({ open, onOpenChange, project, mode }: ProjectDialogProps) {
  const { dispatch, getNextId } = useDashboard()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<ProjectFormValues> = {
    id: project?.id || "",
    name: project?.name || "",
    client: project?.client || "",
    type: project?.type || "",
    status: project?.status || "pending",
    startDate: project?.startDate || new Date().toISOString().split("T")[0],
    endDate: project?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    value: project?.value || 0,
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  })

  function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true)

    try {
      if (mode === "add") {
        const newProject: Project = {
          ...data,
          id: getNextId("project"),
        }
        dispatch({ type: "ADD_PROJECT", payload: newProject })
      } else if (mode === "edit" && project) {
        const updatedProject: Project = {
          ...data,
          id: project.id,
        }
        dispatch({ type: "UPDATE_PROJECT", payload: updatedProject })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar projeto:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Adicionar Novo Projeto" : "Editar Projeto"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Preencha os detalhes para criar um novo projeto."
              : "Atualize as informações do projeto."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : mode === "add" ? "Adicionar Projeto" : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

