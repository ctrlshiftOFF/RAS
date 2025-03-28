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
import type { FinancialTransaction } from "../data/dashboard-data"

const transactionFormSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(2, {
    message: "A descrição deve ter pelo menos 2 caracteres.",
  }),
  type: z.enum(["income", "expense"], {
    required_error: "Por favor, selecione um tipo.",
  }),
  category: z.string().min(1, {
    message: "Por favor, selecione uma categoria.",
  }),
  amount: z.coerce.number().positive({
    message: "O valor deve ser um número positivo.",
  }),
  date: z.string().min(1, {
    message: "Por favor, selecione uma data.",
  }),
  project: z.string().optional(),
  status: z.enum(["paid", "pending", "overdue"]).optional(),
})

type TransactionFormValues = z.infer<typeof transactionFormSchema>

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: FinancialTransaction | null
  mode: "add" | "edit"
}

export function TransactionDialog({ open, onOpenChange, transaction, mode }: TransactionDialogProps) {
  const { state, dispatch, getNextId } = useDashboard()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<TransactionFormValues> = {
    id: transaction?.id || "",
    description: transaction?.description || "",
    type: transaction?.type || "expense",
    category: transaction?.category || "",
    amount: transaction?.amount || 0,
    date: transaction?.date || new Date().toISOString().split("T")[0],
    project: transaction?.project || undefined,
    status: transaction?.status,
  }

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  })

  // Observar mudanças no tipo de transação para mostrar/ocultar campos relevantes
  const transactionType = form.watch("type")

  // Obter lista de projetos para o select
  const projectOptions = state.projects.map((project) => ({
    value: project.id,
    label: project.name,
  }))

  function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true)

    try {
      if (mode === "add") {
        const newTransaction: FinancialTransaction = {
          ...data,
          id: getNextId("transaction"),
        }
        dispatch({ type: "ADD_TRANSACTION", payload: newTransaction })
      } else if (mode === "edit" && transaction) {
        const updatedTransaction: FinancialTransaction = {
          ...data,
          id: transaction.id,
        }
        dispatch({ type: "UPDATE_TRANSACTION", payload: updatedTransaction })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar transação:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Adicionar Nova Transação" : "Editar Transação"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Preencha os detalhes para adicionar uma nova transação financeira."
              : "Atualize as informações da transação."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a descrição da transação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Receita</SelectItem>
                        <SelectItem value="expense">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transactionType === "income" ? (
                          <>
                            <SelectItem value="Pagamento de Projeto">Pagamento de Projeto</SelectItem>
                            <SelectItem value="Adiantamento">Adiantamento</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="Materiais">Materiais</SelectItem>
                            <SelectItem value="Mão de Obra">Mão de Obra</SelectItem>
                            <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                            <SelectItem value="Despesas Gerais">Despesas Gerais</SelectItem>
                            <SelectItem value="Transporte">Transporte</SelectItem>
                            <SelectItem value="Seguros">Seguros</SelectItem>
                          </>
                        )}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projeto Relacionado (opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um projeto (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {projectOptions.map((project) => (
                        <SelectItem key={project.value} value={project.value}>
                          {project.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {transactionType === "income" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status do Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="overdue">Atrasado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : mode === "add" ? "Adicionar Transação" : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

