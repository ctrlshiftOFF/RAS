"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, User } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProjectEmployeesProps {
  projectId: string
}

// Tipo para funcionários do projeto
interface ProjectEmployee {
  employeeId: string
  role: string
  hoursAllocated: number
  startDate: string
}

export function ProjectEmployees({ projectId }: ProjectEmployeesProps) {
  const { state, dispatch } = useDashboard()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedRole, setSelectedRole] = useState("Pintor")
  const [hoursAllocated, setHoursAllocated] = useState("120")
  const [employeeToRemove, setEmployeeToRemove] = useState<string | null>(null)
  const [employeeToView, setEmployeeToView] = useState<string | null>(null)
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<any>(null)

  // Estado local para simular funcionários alocados ao projeto
  const [projectEmployees, setProjectEmployees] = useState<ProjectEmployee[]>([
    {
      employeeId: "EMP-001",
      role: "Pintor Líder",
      hoursAllocated: 160,
      startDate: "2023-07-15",
    },
    {
      employeeId: "EMP-003",
      role: "Pintor",
      hoursAllocated: 120,
      startDate: "2023-07-15",
    },
    {
      employeeId: "EMP-006",
      role: "Pintor",
      hoursAllocated: 120,
      startDate: "2023-07-20",
    },
  ])

  // Obter detalhes dos funcionários
  const employeeDetails = projectEmployees.map((pe) => {
    const employee = state.employees.find((e) => e.id === pe.employeeId)
    return {
      ...pe,
      name: employee?.name || "Funcionário não encontrado",
      email: employee?.email || "",
      hourlyRate: employee?.hourlyRate || 0,
      totalCost: (employee?.hourlyRate || 0) * pe.hoursAllocated,
    }
  })

  // Calcular custo total com mão de obra
  const totalLaborCost = employeeDetails.reduce((sum, e) => sum + e.totalCost, 0)

  // Funcionários disponíveis (não alocados ao projeto)
  const availableEmployees = state.employees.filter(
    (e) => e.status === "active" && !projectEmployees.some((pe) => pe.employeeId === e.id),
  )

  const handleAddEmployee = () => {
    if (!selectedEmployee || !selectedRole || !hoursAllocated) return

    // Adicionar funcionário ao projeto
    const newProjectEmployee: ProjectEmployee = {
      employeeId: selectedEmployee,
      role: selectedRole,
      hoursAllocated: Number.parseInt(hoursAllocated),
      startDate: new Date().toISOString().split("T")[0],
    }

    setProjectEmployees([...projectEmployees, newProjectEmployee])
    setIsDialogOpen(false)
    setSelectedEmployee("")
    setSelectedRole("Pintor")
    setHoursAllocated("120")
  }

  const handleRemoveEmployee = () => {
    if (!employeeToRemove) return

    // Remover funcionário do projeto
    setProjectEmployees(projectEmployees.filter((pe) => pe.employeeId !== employeeToRemove))
    setEmployeeToRemove(null)
  }

  // Função para visualizar detalhes do funcionário
  const handleViewEmployee = (employeeId: string) => {
    const employee = state.employees.find((e) => e.id === employeeId)
    if (employee) {
      setEditedEmployee({ ...employee })
      setEmployeeToView(employeeId)
    }
  }

  // Função para salvar as alterações do funcionário
  const handleSaveEmployeeChanges = () => {
    if (!editedEmployee) return

    // Atualizar o funcionário no estado global
    dispatch({
      type: "UPDATE_EMPLOYEE",
      payload: {
        ...editedEmployee,
        hourlyRate:
          typeof editedEmployee.hourlyRate === "string"
            ? Number.parseFloat(editedEmployee.hourlyRate)
            : editedEmployee.hourlyRate,
      },
    })

    setIsEditingEmployee(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Funcionários Alocados</CardTitle>
          <CardDescription>Equipe designada para este projeto</CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Funcionário
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs font-medium text-muted-foreground">Total de Funcionários</div>
              <div className="text-2xl font-bold">{employeeDetails.length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs font-medium text-muted-foreground">Horas Alocadas</div>
              <div className="text-2xl font-bold">
                {projectEmployees.reduce((sum, e) => sum + e.hoursAllocated, 0)}h
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs font-medium text-muted-foreground">Custo Total</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalLaborCost)}
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Taxa Horária</TableHead>
                  <TableHead className="text-right">Custo Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeDetails.map((employee, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewEmployee(employee.employeeId)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${employee.name.charAt(0)}`} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.hoursAllocated}h</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        employee.hourlyRate,
                      )}
                      /h
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        employee.totalCost,
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEmployeeToRemove(employee.employeeId)
                        }}
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

      {/* Dialog para adicionar funcionário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Funcionário ao Projeto</DialogTitle>
            <DialogDescription>Selecione um funcionário para adicionar a este projeto.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Funcionário</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Função no Projeto</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pintor Líder">Pintor Líder</SelectItem>
                  <SelectItem value="Pintor">Pintor</SelectItem>
                  <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hours">Horas Alocadas</Label>
              <Input
                id="hours"
                type="number"
                value={hoursAllocated}
                onChange={(e) => setHoursAllocated(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEmployee} disabled={!selectedEmployee}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para visualizar/editar funcionário */}
      <Dialog
        open={!!employeeToView}
        onOpenChange={(open) => {
          if (!open) {
            setEmployeeToView(null)
            setIsEditingEmployee(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {isEditingEmployee ? "Editar Funcionário" : "Detalhes do Funcionário"}
            </DialogTitle>
            <DialogDescription>
              {isEditingEmployee
                ? "Edite as informações do funcionário. As alterações serão refletidas em todo o sistema."
                : "Informações detalhadas sobre o funcionário."}
            </DialogDescription>
          </DialogHeader>

          {editedEmployee && (
            <Tabs defaultValue="info" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="work">Trabalho</TabsTrigger>
                <TabsTrigger value="project">Projeto</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${editedEmployee.name.charAt(0)}`} />
                    <AvatarFallback className="text-xl">{editedEmployee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditingEmployee ? (
                    <Input
                      value={editedEmployee.name}
                      onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
                      className="flex-1"
                    />
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold">{editedEmployee.name}</h3>
                      <p className="text-muted-foreground">{editedEmployee.role}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditingEmployee ? (
                      <Input
                        id="email"
                        value={editedEmployee.email}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 border rounded-md">{editedEmployee.email}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    {isEditingEmployee ? (
                      <Input
                        id="phone"
                        value={editedEmployee.phone}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 border rounded-md">{editedEmployee.phone}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditingEmployee ? (
                    <Select
                      value={editedEmployee.status}
                      onValueChange={(value) => setEditedEmployee({ ...editedEmployee, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="on-leave">De Licença</SelectItem>
                        <SelectItem value="terminated">Desligado</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 border rounded-md">
                      <Badge
                        variant={
                          editedEmployee.status === "active"
                            ? "default"
                            : editedEmployee.status === "on-leave"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {editedEmployee.status === "active"
                          ? "Ativo"
                          : editedEmployee.status === "on-leave"
                            ? "De Licença"
                            : "Desligado"}
                      </Badge>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Cargo</Label>
                    {isEditingEmployee ? (
                      <Input
                        id="role"
                        value={editedEmployee.role}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, role: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 border rounded-md">{editedEmployee.role}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    {isEditingEmployee ? (
                      <Select
                        value={editedEmployee.department}
                        onValueChange={(value) => setEditedEmployee({ ...editedEmployee, department: value })}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Residencial">Residencial</SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                          <SelectItem value="Reforma">Reforma</SelectItem>
                          <SelectItem value="Administração">Administração</SelectItem>
                          <SelectItem value="Vendas">Vendas</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">{editedEmployee.department}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Data de Contratação</Label>
                    {isEditingEmployee ? (
                      <Input
                        id="hireDate"
                        type="date"
                        value={editedEmployee.hireDate}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, hireDate: e.target.value })}
                      />
                    ) : (
                      <div className="p-2 border rounded-md">
                        {new Date(editedEmployee.hireDate).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Taxa Horária (R$)</Label>
                    {isEditingEmployee ? (
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={editedEmployee.hourlyRate}
                        onChange={(e) =>
                          setEditedEmployee({ ...editedEmployee, hourlyRate: Number.parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      <div className="p-2 border rounded-md">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          editedEmployee.hourlyRate,
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="project" className="space-y-4 mt-4">
                {projectEmployees.find((pe) => pe.employeeId === employeeToView) && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Função no Projeto</Label>
                        <div className="p-2 border rounded-md">
                          {projectEmployees.find((pe) => pe.employeeId === employeeToView)?.role}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Horas Alocadas</Label>
                        <div className="p-2 border rounded-md">
                          {projectEmployees.find((pe) => pe.employeeId === employeeToView)?.hoursAllocated}h
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Início no Projeto</Label>
                      <div className="p-2 border rounded-md">
                        {new Date(
                          projectEmployees.find((pe) => pe.employeeId === employeeToView)?.startDate || "",
                        ).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Custo Total para o Projeto</Label>
                      <div className="p-2 border rounded-md font-medium">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          (editedEmployee.hourlyRate || 0) *
                            (projectEmployees.find((pe) => pe.employeeId === employeeToView)?.hoursAllocated || 0),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            {isEditingEmployee ? (
              <>
                <Button variant="outline" onClick={() => setIsEditingEmployee(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEmployeeChanges}>Salvar Alterações</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEmployeeToView(null)}>
                  Fechar
                </Button>
                <Button onClick={() => setIsEditingEmployee(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar Funcionário
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar remoção de funcionário */}
      <AlertDialog open={!!employeeToRemove} onOpenChange={(open) => !open && setEmployeeToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Funcionário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este funcionário do projeto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveEmployee} className="bg-destructive text-destructive-foreground">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

