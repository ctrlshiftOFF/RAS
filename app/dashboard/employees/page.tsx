"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter } from "lucide-react"
import { useDashboard } from "../context/dashboard-provider"
import { EmployeeDialog } from "../components/employee-dialog"
import { EmployeeDetailsDialog } from "./employee-details-dialog"

export default function EmployeesPage() {
  const { state } = useDashboard()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  // Filtrar funcionários com base na pesquisa e filtros
  const filteredEmployees = state.employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || employee.status === statusFilter
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Obter departamentos únicos para o filtro
  const departments = Array.from(new Set(state.employees.map((e) => e.department)))

  // Função para abrir o diálogo de detalhes do funcionário
  const handleViewEmployee = (employeeId: string) => {
    setSelectedEmployee(employeeId)
  }

  // Tradução dos status dos funcionários
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "on-leave":
        return "De Licença"
      case "terminated":
        return "Desligado"
      default:
        return status
    }
  }

  // Obter a variante do badge com base no status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "on-leave":
        return "warning"
      case "terminated":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Funcionários</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Funcionário
        </Button>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Diretório</TabsTrigger>
          <TabsTrigger value="payroll">Folha de Pagamento</TabsTrigger>
          <TabsTrigger value="scheduling">Agendamento</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diretório de Funcionários</CardTitle>
              <CardDescription>Gerencie informações e funções dos funcionários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar funcionários..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-[180px]">
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={statusFilter || ""}
                      onChange={(e) => setStatusFilter(e.target.value || null)}
                    >
                      <option value="">Todos os Status</option>
                      <option value="active">Ativos</option>
                      <option value="on-leave">De Licença</option>
                      <option value="terminated">Desligados</option>
                    </select>
                  </div>
                  <div className="w-[180px]">
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={departmentFilter || ""}
                      onChange={(e) => setDepartmentFilter(e.target.value || null)}
                    >
                      <option value="">Todos os Departamentos</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter(null)
                      setDepartmentFilter(null)
                    }}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Taxa Horária</TableHead>
                      <TableHead>Data de Contratação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <TableRow
                          key={employee.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleViewEmployee(employee.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40&text=${employee.name.charAt(0)}`}
                                />
                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-xs text-muted-foreground">{employee.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(employee.status)}>{getStatusLabel(employee.status)}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              employee.hourlyRate,
                            )}
                            /h
                          </TableCell>
                          <TableCell>{new Date(employee.hireDate).toLocaleDateString("pt-BR")}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhum funcionário encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Folha de Pagamento</CardTitle>
              <CardDescription>Acompanhe as horas dos funcionários e processe a folha de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>O módulo de folha de pagamento será implementado em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agendamento de Funcionários</CardTitle>
              <CardDescription>Agende funcionários para projetos e acompanhe a disponibilidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>O módulo de agendamento será implementado em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acompanhamento de Desempenho</CardTitle>
              <CardDescription>Monitore o desempenho e a produtividade dos funcionários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <p>O módulo de desempenho será implementado em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para adicionar funcionário */}
      <EmployeeDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} mode="add" />

      {/* Diálogo para visualizar detalhes do funcionário */}
      <EmployeeDetailsDialog
        employeeId={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      />
    </div>
  )
}

