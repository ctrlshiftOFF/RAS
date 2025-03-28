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
import type { Employee } from "../data/dashboard-data"

const employeeFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um endereço de email válido.",
  }),
  phone: z.string().min(10, {
    message: "Por favor, insira um número de telefone válido.",
  }),
  role: z.string().min(1, {
    message: "Por favor, selecione um cargo.",
  }),
  department: z.string().min(1, {
    message: "Por favor, selecione um departamento.",
  }),
  status: z.enum(["active", "on-leave", "terminated"], {
    required_error: "Por favor, selecione um status.",
  }),
  hireDate: z.string().min(1, {
    message: "Por favor, selecione uma data de contratação.",
  }),
  hourlyRate: z.coerce.number().positive({
    message: "A taxa horária deve ser um número positivo.",
  }),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  mode: "add" | "edit"
}

export function EmployeeDialog({ open, onOpenChange, employee, mode }: EmployeeDialogProps) {
  const { dispatch, getNextId } = useDashboard()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<EmployeeFormValues> = {
    id: employee?.id || "",
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    role: employee?.role || "",
    department: employee?.department || "",
    status: employee?.status || "active",
    hireDate: employee?.hireDate || new Date().toISOString().split("T")[0],
    hourlyRate: employee?.hourlyRate || 0,
  }

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
  })

  function onSubmit(data: EmployeeFormValues) {
    setIsSubmitting(true)

    try {
      if (mode === "add") {
        const newEmployee: Employee = {
          ...data,
          id: getNextId("employee"),
        }
        dispatch({ type: "ADD_EMPLOYEE", payload: newEmployee })
      } else if (mode === "edit" && employee) {
        const updatedEmployee: Employee = {
          ...data,
          id: employee.id,
        }
        dispatch({ type: "UPDATE_EMPLOYEE", payload: updatedEmployee })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Adicionar Novo Funcionário" : "Editar Funcionário"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Preencha os detalhes para adicionar um novo funcionário."
              : "Atualize as informações do funcionário."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o endereço de email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o número de telefone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pintor">Pintor</SelectItem>
                        <SelectItem value="Pintor Líder">Pintor Líder</SelectItem>
                        <SelectItem value="Gerente de Projeto">Gerente de Projeto</SelectItem>
                        <SelectItem value="Designer de Interiores">Designer de Interiores</SelectItem>
                        <SelectItem value="Carpinteiro">Carpinteiro</SelectItem>
                        <SelectItem value="Gerente de Escritório">Gerente de Escritório</SelectItem>
                        <SelectItem value="Orçamentista">Orçamentista</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Residencial">Residencial</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                        <SelectItem value="Reforma">Reforma</SelectItem>
                        <SelectItem value="Administração">Administração</SelectItem>
                        <SelectItem value="Vendas">Vendas</SelectItem>
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
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="on-leave">De Licença</SelectItem>
                        <SelectItem value="terminated">Desligado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Contratação</FormLabel>
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
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa Horária (R$)</FormLabel>
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
                {isSubmitting ? "Salvando..." : mode === "add" ? "Adicionar Funcionário" : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

