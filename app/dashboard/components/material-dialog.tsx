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
import type { Material } from "../data/dashboard-data"

const materialFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "O nome do material deve ter pelo menos 2 caracteres.",
  }),
  category: z.string().min(1, {
    message: "Por favor, selecione uma categoria.",
  }),
  quantity: z.coerce.number().int().nonnegative({
    message: "A quantidade deve ser um número inteiro não negativo.",
  }),
  unit: z.string().min(1, {
    message: "Por favor, insira uma unidade.",
  }),
  unitCost: z.coerce.number().positive({
    message: "O custo unitário deve ser um número positivo.",
  }),
  reorderLevel: z.coerce.number().int().nonnegative({
    message: "O nível de reposição deve ser um número inteiro não negativo.",
  }),
})

type MaterialFormValues = z.infer<typeof materialFormSchema>

interface MaterialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material: Material | null
  mode: "add" | "edit"
}

export function MaterialDialog({ open, onOpenChange, material, mode }: MaterialDialogProps) {
  const { dispatch, getNextId } = useDashboard()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<MaterialFormValues> = {
    id: material?.id || "",
    name: material?.name || "",
    category: material?.category || "",
    quantity: material?.quantity || 0,
    unit: material?.unit || "",
    unitCost: material?.unitCost || 0,
    reorderLevel: material?.reorderLevel || 10,
  }

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    defaultValues,
  })

  function onSubmit(data: MaterialFormValues) {
    setIsSubmitting(true)

    try {
      // Calcular valor total
      const totalValue = data.quantity * data.unitCost

      // Determinar status com base na quantidade e nível de reposição
      let status: "in-stock" | "low-stock" | "out-of-stock" = "in-stock"
      if (data.quantity === 0) {
        status = "out-of-stock"
      } else if (data.quantity <= data.reorderLevel) {
        status = "low-stock"
      }

      if (mode === "add") {
        const newMaterial: Material = {
          ...data,
          id: getNextId("material"),
          totalValue,
          status,
        }
        dispatch({ type: "ADD_MATERIAL", payload: newMaterial })
      } else if (mode === "edit" && material) {
        const updatedMaterial: Material = {
          ...data,
          id: material.id,
          totalValue,
          status,
        }
        dispatch({ type: "UPDATE_MATERIAL", payload: updatedMaterial })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar material:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Adicionar Novo Material" : "Editar Material"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Preencha os detalhes para adicionar um novo material ao inventário."
              : "Atualize as informações do material."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Material</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do material" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="Tinta">Tinta</SelectItem>
                        <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                        <SelectItem value="Suprimentos">Suprimentos</SelectItem>
                        <SelectItem value="Materiais">Materiais</SelectItem>
                        <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a unidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Galão">Galão</SelectItem>
                        <SelectItem value="Litro">Litro</SelectItem>
                        <SelectItem value="Unidade">Unidade</SelectItem>
                        <SelectItem value="Rolo">Rolo</SelectItem>
                        <SelectItem value="Caixa">Caixa</SelectItem>
                        <SelectItem value="Balde">Balde</SelectItem>
                        <SelectItem value="Conjunto">Conjunto</SelectItem>
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Unitário (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reorderLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Reposição</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} />
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
                {isSubmitting ? "Salvando..." : mode === "add" ? "Adicionar Material" : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

