"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { useDashboard } from "../../context/dashboard-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Combobox } from "@/components/ui/combobox"

interface ProjectMaterialsProps {
  projectId: string
}

// Tipo para materiais do projeto
interface ProjectMaterial {
  materialId: string
  quantity: number
  unitCost: number
  totalCost: number
  dateAdded: string
}

export function ProjectMaterials({ projectId }: ProjectMaterialsProps) {
  const { state, dispatch, getNextId } = useDashboard()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [newMaterialName, setNewMaterialName] = useState("")
  const [newMaterialCategory, setNewMaterialCategory] = useState("Tinta")
  const [newMaterialUnit, setNewMaterialUnit] = useState("Galão")
  const [newMaterialUnitCost, setNewMaterialUnitCost] = useState("0")
  const [quantity, setQuantity] = useState("1")
  const [materialToRemove, setMaterialToRemove] = useState<string | null>(null)
  const [isCreatingNewMaterial, setIsCreatingNewMaterial] = useState(false)

  // Estado local para simular materiais alocados ao projeto
  const [projectMaterials, setProjectMaterials] = useState<ProjectMaterial[]>([
    {
      materialId: "MAT-001",
      quantity: 24,
      unitCost: 28.99,
      totalCost: 695.76,
      dateAdded: "2023-07-15",
    },
    {
      materialId: "MAT-003",
      quantity: 12,
      unitCost: 32.99,
      totalCost: 395.88,
      dateAdded: "2023-07-15",
    },
    {
      materialId: "MAT-006",
      quantity: 20,
      unitCost: 4.99,
      totalCost: 99.8,
      dateAdded: "2023-07-20",
    },
    {
      materialId: "MAT-007",
      quantity: 15,
      unitCost: 6.99,
      totalCost: 104.85,
      dateAdded: "2023-07-20",
    },
  ])

  // Obter detalhes dos materiais
  const materialDetails = projectMaterials.map((pm) => {
    const material = state.materials.find((m) => m.id === pm.materialId)
    return {
      ...pm,
      name: material?.name || "Material não encontrado",
      category: material?.category || "",
      unit: material?.unit || "",
    }
  })

  // Calcular custo total com materiais
  const totalMaterialCost = materialDetails.reduce((sum, m) => sum + m.totalCost, 0)

  // Materiais disponíveis
  const availableMaterials = state.materials.filter((m) => m.status !== "out-of-stock")

  // Opções para o combobox
  const materialOptions = availableMaterials.map((material) => ({
    value: material.id,
    label: `${material.name} (${material.quantity} ${material.unit} disponíveis)`,
  }))

  // Função para criar um novo material
  const handleCreateNewMaterial = () => {
    if (!newMaterialName || !newMaterialCategory || !newMaterialUnit || !newMaterialUnitCost) return

    const unitCost = Number.parseFloat(newMaterialUnitCost)
    if (isNaN(unitCost) || unitCost <= 0) return

    // Criar novo material
    const newMaterialId = getNextId("material")
    const newMaterial = {
      id: newMaterialId,
      name: newMaterialName,
      category: newMaterialCategory,
      quantity: 100, // Quantidade inicial padrão
      unit: newMaterialUnit,
      unitCost: unitCost,
      totalValue: 100 * unitCost,
      reorderLevel: 10,
      status: "in-stock" as "in-stock" | "low-stock" | "out-of-stock",
    }

    // Adicionar ao estado global
    dispatch({ type: "ADD_MATERIAL", payload: newMaterial })

    // Selecionar o novo material
    setSelectedMaterial(newMaterialId)

    // Limpar campos
    setNewMaterialName("")
    setNewMaterialCategory("Tinta")
    setNewMaterialUnit("Galão")
    setNewMaterialUnitCost("0")

    // Voltar para a seleção
    setIsCreatingNewMaterial(false)
  }

  const handleAddMaterial = () => {
    if (!selectedMaterial || !quantity) return

    // Encontrar o material selecionado
    const material = state.materials.find((m) => m.id === selectedMaterial)
    if (!material) return

    // Calcular o custo total
    const qty = Number.parseInt(quantity)
    const totalCost = material.unitCost * qty

    // Adicionar material ao projeto
    const newProjectMaterial: ProjectMaterial = {
      materialId: selectedMaterial,
      quantity: qty,
      unitCost: material.unitCost,
      totalCost: totalCost,
      dateAdded: new Date().toISOString().split("T")[0],
    }

    setProjectMaterials([...projectMaterials, newProjectMaterial])
    setIsDialogOpen(false)
    setSelectedMaterial("")
    setQuantity("1")
  }

  const handleRemoveMaterial = () => {
    if (!materialToRemove) return

    // Remover material do projeto
    setProjectMaterials(projectMaterials.filter((pm) => pm.materialId !== materialToRemove))
    setMaterialToRemove(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Materiais Utilizados</CardTitle>
          <CardDescription>Materiais alocados para este projeto</CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Material
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs font-medium text-muted-foreground">Total de Materiais</div>
              <div className="text-2xl font-bold">{materialDetails.length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs font-medium text-muted-foreground">Quantidade Total</div>
              <div className="text-2xl font-bold">{projectMaterials.reduce((sum, m) => sum + m.quantity, 0)} itens</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs font-medium text-muted-foreground">Custo Total</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalMaterialCost)}
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Custo Unitário</TableHead>
                  <TableHead>Custo Total</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialDetails.map((material, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{material.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {material.quantity} {material.unit}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(material.unitCost)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        material.totalCost,
                      )}
                    </TableCell>
                    <TableCell>{new Date(material.dateAdded).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setMaterialToRemove(material.materialId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* Dialog para adicionar material */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Material ao Projeto</DialogTitle>
            <DialogDescription>
              Selecione um material existente ou crie um novo para adicionar a este projeto.
            </DialogDescription>
          </DialogHeader>

          {isCreatingNewMaterial ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="materialName">Nome do Material</Label>
                <Input
                  id="materialName"
                  placeholder="Digite o nome do material"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="materialCategory">Categoria</Label>
                  <Select value={newMaterialCategory} onValueChange={setNewMaterialCategory}>
                    <SelectTrigger id="materialCategory">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tinta">Tinta</SelectItem>
                      <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                      <SelectItem value="Suprimentos">Suprimentos</SelectItem>
                      <SelectItem value="Materiais">Materiais</SelectItem>
                      <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="materialUnit">Unidade</Label>
                  <Select value={newMaterialUnit} onValueChange={setNewMaterialUnit}>
                    <SelectTrigger id="materialUnit">
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
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
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="materialUnitCost">Custo Unitário (R$)</Label>
                <Input
                  id="materialUnitCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newMaterialUnitCost}
                  onChange={(e) => setNewMaterialUnitCost(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade para o Projeto</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsCreatingNewMaterial(false)}>
                  Voltar
                </Button>
                <Button
                  onClick={handleCreateNewMaterial}
                  disabled={!newMaterialName || Number.parseFloat(newMaterialUnitCost) <= 0}
                >
                  Criar e Selecionar
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="material">Material</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Combobox
                      items={materialOptions}
                      value={selectedMaterial}
                      onChange={setSelectedMaterial}
                      placeholder="Selecione ou digite para criar um material"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setIsCreatingNewMaterial(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Novo
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddMaterial} disabled={!selectedMaterial}>
                  Adicionar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar remoção de material */}
      <AlertDialog open={!!materialToRemove} onOpenChange={(open) => !open && setMaterialToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Material</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este material do projeto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMaterial} className="bg-destructive text-destructive-foreground">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

