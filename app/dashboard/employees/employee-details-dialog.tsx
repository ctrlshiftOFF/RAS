"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, User, Briefcase, Calendar, Clock, FileText, BarChart } from "lucide-react"
import { useDashboard } from "../context/dashboard-provider"
import { EmployeeDialog } from "../components/employee-dialog"

interface EmployeeDetailsDialogProps {
  employeeId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeDetailsDialog({ employeeId, open, onOpenChange }: EmployeeDetailsDialogProps) {
  const { state } = useDashboard()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Encontrar o funcionário pelo ID
  const employee = employeeId ? state.employees.find((e) => e.id === employeeId) : null

  // Encontrar projetos associados a este funcionário (simulado)
  const employeeProjects = [
    { id: "PROJ-1234", name: "Johnson Residence", role: "Pintor Líder", hours: 160, startDate: "2023-07-15" },
    { id: "PROJ-1236", name: "Rivera Kitchen Remodel", role: "Pintor", hours: 80, startDate: "2023-08-10" },
  ]

  // Histórico de pagamentos (simulado)
  const paymentHistory = [
    { id: "PAY-001", date: "2023-07-31", hours: 160, amount: employee?.hourlyRate ? employee.hourlyRate * 160 : 0 },
    { id: "PAY-002", date: "2023-08-31", hours: 168, amount: employee?.hourlyRate ? employee.hourlyRate * 168 : 0 },
    { id: "PAY-003", date: "2023-09-30", hours: 152, amount: employee?.hourlyRate ? employee.hourlyRate * 152 : 0 },
  ]

  // Histórico de avaliações (simulado)
  const performanceHistory = [
    {
      date: "2023-09-15",
      rating: 4.8,
      evaluator: "Maria Rodriguez",
      comments: "Excelente trabalho no projeto Johnson. Demonstrou grande habilidade técnica e atenção aos detalhes.",
    },
    {
      date: "2023-06-10",
      rating: 4.5,
      evaluator: "Carlos Santos",
      comments: "Bom trabalho, mas pode melhorar na comunicação com a equipe.",
    },
    {
      date: "2023-03-05",
      rating: 4.2,
      evaluator: "Maria Rodriguez",
      comments: "Desempenho consistente, cumpre prazos e mantém qualidade.",
    },
  ]

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

  if (!employee) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5" /> Detalhes do Funcionário
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6 mt-4">
            {/* Informações básicas */}
            <div className="md:w-1/3">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`/placeholder.svg?height=96&width=96&text=${employee.name.charAt(0)}`} />
                  <AvatarFallback className="text-2xl">{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">{employee.role}</p>
                <Badge variant={getStatusVariant(employee.status)} className="mt-2">
                  {getStatusLabel(employee.status)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm">{employee.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Telefone</Label>
                  <p className="text-sm">{employee.phone}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Departamento</Label>
                  <p className="text-sm">{employee.department}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Data de Contratação</Label>
                  <p className="text-sm">{new Date(employee.hireDate).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Taxa Horária</Label>
                  <p className="text-sm font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(employee.hourlyRate)}
                    /h
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={() => setIsEditDialogOpen(true)} className="w-full">
                  <Edit className="mr-2 h-4 w-4" /> Editar Funcionário
                </Button>
              </div>
            </div>

            {/* Abas de detalhes */}
            <div className="md:w-2/3">
              <Tabs defaultValue="overview" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="overview">Resumo</TabsTrigger>
                  <TabsTrigger value="projects">Projetos</TabsTrigger>
                  <TabsTrigger value="payroll">Pagamentos</TabsTrigger>
                  <TabsTrigger value="performance">Desempenho</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" /> Resumo Profissional
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="rounded-lg border p-3">
                          <div className="text-xs font-medium text-muted-foreground">Projetos Ativos</div>
                          <div className="text-xl font-bold">{employeeProjects.length}</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="text-xs font-medium text-muted-foreground">Horas Trabalhadas (Mês)</div>
                          <div className="text-xl font-bold">168h</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Especialidades</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline">Pintura Residencial</Badge>
                          <Badge variant="outline">Pintura Comercial</Badge>
                          <Badge variant="outline">Acabamento Fino</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Observações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Adicione observações sobre este funcionário..."
                        className="min-h-[100px]"
                        defaultValue="Funcionário experiente com excelentes habilidades técnicas. Prefere trabalhar em projetos residenciais. Disponível para horas extras quando necessário."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Calendar className="h-4 w-4 mr-2" /> Projetos Atuais e Anteriores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Projeto</TableHead>
                              <TableHead>Função</TableHead>
                              <TableHead>Horas Alocadas</TableHead>
                              <TableHead>Data de Início</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employeeProjects.map((project, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell>{project.role}</TableCell>
                                <TableCell>{project.hours}h</TableCell>
                                <TableCell>{new Date(project.startDate).toLocaleDateString("pt-BR")}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payroll" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> Histórico de Pagamentos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Horas</TableHead>
                              <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paymentHistory.map((payment, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{payment.id}</TableCell>
                                <TableCell>{new Date(payment.date).toLocaleDateString("pt-BR")}</TableCell>
                                <TableCell>{payment.hours}h</TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    payment.amount,
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <BarChart className="h-4 w-4 mr-2" /> Avaliações de Desempenho
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {performanceHistory.map((review, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm font-medium">
                                  {new Date(review.date).toLocaleDateString("pt-BR")}
                                </p>
                                <p className="text-xs text-muted-foreground">Avaliador: {review.evaluator}</p>
                              </div>
                              <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-md">
                                <span className="text-sm font-bold">{review.rating}</span>
                                <span className="text-xs ml-1">/5.0</span>
                              </div>
                            </div>
                            <p className="text-sm">{review.comments}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar funcionário */}
      <EmployeeDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} employee={employee} mode="edit" />
    </>
  )
}

