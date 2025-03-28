"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, DollarSign, Users, Edit, Save, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useDashboard } from "../../context/dashboard-provider"
import { ProjectEmployees } from "./project-employees"
import { ProjectMaterials } from "./project-materials"
import { ProjectFinances } from "./project-finances"
import { ProjectNotes } from "./project-notes"
import { ProjectTimeline } from "./project-timeline"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { state, dispatch } = useDashboard()
  const projectId = params.id as string
  const [isEditing, setIsEditing] = useState(false)
  const [editedProject, setEditedProject] = useState<any>(null)
  const [previousPage, setPreviousPage] = useState<string>("/dashboard/projects")

  // Encontrar o projeto pelo ID
  const project = state.projects.find((p) => p.id === projectId)

  // Tentar obter a página anterior do sessionStorage
  useEffect(() => {
    const referrer = sessionStorage.getItem("projectReferrer") || "/dashboard/projects"
    setPreviousPage(referrer)

    // Limpar o referrer após uso
    return () => {
      sessionStorage.removeItem("projectReferrer")
    }
  }, [])

  // Se o projeto não for encontrado, redirecionar para a lista de projetos
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-2xl font-bold mb-4">Projeto não encontrado</h2>
        <Button onClick={() => router.push("/dashboard/projects")}>Voltar para Projetos</Button>
      </div>
    )
  }

  // Inicializar o estado de edição com os dados do projeto
  if (!editedProject && project) {
    setEditedProject({ ...project })
  }

  // Tradução dos status dos projetos
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-progress":
        return "Em Andamento"
      case "completed":
        return "Concluído"
      case "pending":
        return "Pendente"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  // Calcular dados financeiros do projeto
  const projectTransactions = state.financialTransactions.filter((t) => t.project === project.id)
  const projectIncome = projectTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const projectExpenses = projectTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const projectProfit = projectIncome - projectExpenses
  const profitMargin = projectIncome > 0 ? (projectProfit / projectIncome) * 100 : 0

  // Calcular dias restantes
  const today = new Date()
  const endDate = new Date(project.endDate)
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Calcular progresso do projeto (simulado)
  const progress =
    project.status === "completed"
      ? 100
      : project.status === "cancelled"
        ? 0
        : project.status === "pending"
          ? 10
          : Math.min(75, Math.max(25, 100 - (daysRemaining / 30) * 100))

  // Função para salvar as alterações
  const handleSaveChanges = () => {
    if (editedProject) {
      // Garantir que todos os campos numéricos sejam convertidos corretamente
      const updatedProject = {
        ...editedProject,
        value: typeof editedProject.value === "string" ? Number.parseFloat(editedProject.value) : editedProject.value,
      }

      dispatch({ type: "UPDATE_PROJECT", payload: updatedProject })
      setIsEditing(false)

      // Atualizar o projeto local para refletir as mudanças
      setEditedProject(updatedProject)
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push(previousPage)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <Input
              value={editedProject.name}
              onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
              className="text-2xl font-bold h-10"
            />
          ) : (
            <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          )}
          <Badge
            variant={
              project.status === "in-progress"
                ? "default"
                : project.status === "completed"
                  ? "success"
                  : project.status === "pending"
                    ? "warning"
                    : "destructive"
            }
            className="ml-2"
          >
            {getStatusLabel(project.status)}
          </Badge>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Editar Projeto
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Projeto</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.value)}
            </div>
            <p className="text-xs text-muted-foreground">Lucro Estimado: {profitMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.client}</div>
            <p className="text-xs text-muted-foreground">{project.type}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cronograma</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">Início: {new Date(project.startDate).toLocaleDateString("pt-BR")}</div>
            <div className="text-md font-medium">Término: {new Date(project.endDate).toLocaleDateString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {daysRemaining > 0
                ? `${daysRemaining} dias restantes`
                : daysRemaining === 0
                  ? "Último dia"
                  : `${Math.abs(daysRemaining)} dias de atraso`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            <div className="w-full h-2 bg-muted rounded-full mt-2">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="finances">Finanças</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Projeto</CardTitle>
              <CardDescription>Informações gerais sobre o projeto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informações Básicas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID do Projeto:</span>
                      <span className="font-medium">{project.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      {isEditing ? (
                        <Input
                          value={editedProject.client}
                          onChange={(e) => setEditedProject({ ...editedProject, client: e.target.value })}
                          className="w-[200px] h-8"
                        />
                      ) : (
                        <span className="font-medium">{project.client}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      {isEditing ? (
                        <Input
                          value={editedProject.type}
                          onChange={(e) => setEditedProject({ ...editedProject, type: e.target.value })}
                          className="w-[200px] h-8"
                        />
                      ) : (
                        <span className="font-medium">{project.type}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{getStatusLabel(project.status)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Resumo Financeiro</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor do Contrato:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProject.value}
                          onChange={(e) =>
                            setEditedProject({ ...editedProject, value: Number.parseFloat(e.target.value) })
                          }
                          className="w-[200px] h-8"
                        />
                      ) : (
                        <span className="font-medium">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.value)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Despesas Atuais:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(projectExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receitas Atuais:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(projectIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lucro Projetado:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(projectProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Cronograma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Início:</span>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedProject.startDate}
                        onChange={(e) => setEditedProject({ ...editedProject, startDate: e.target.value })}
                        className="w-[200px] h-8"
                      />
                    ) : (
                      <span className="font-medium">{new Date(project.startDate).toLocaleDateString("pt-BR")}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Término:</span>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedProject.endDate}
                        onChange={(e) => setEditedProject({ ...editedProject, endDate: e.target.value })}
                        className="w-[200px] h-8"
                      />
                    ) : (
                      <span className="font-medium">{new Date(project.endDate).toLocaleDateString("pt-BR")}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Descrição do Projeto</h3>
                {isEditing ? (
                  <Textarea
                    value={editedProject.description || ""}
                    onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                    placeholder="Adicione uma descrição detalhada do projeto..."
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {project.description || "Nenhuma descrição disponível para este projeto."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <ProjectEmployees projectId={projectId} />
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <ProjectMaterials projectId={projectId} />
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <ProjectFinances projectId={projectId} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <ProjectNotes projectId={projectId} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <ProjectTimeline projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

