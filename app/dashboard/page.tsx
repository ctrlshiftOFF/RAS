"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDashboard } from "./context/dashboard-provider"
import { ArrowUpRight, Building2, Calendar, Clock, DollarSign, HardHat, Package, Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const { state } = useDashboard()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeProjects: 0,
    teamMembers: 0,
    materialExpenses: 0,
  })

  // Calcular estatísticas do dashboard
  useEffect(() => {
    try {
      // Calcular receita total (soma de todas as transações de receita)
      const totalRevenue = state.financialTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)

      // Calcular projetos ativos
      const activeProjects = state.projects.filter((p) => p.status === "in-progress" || p.status === "pending").length

      // Número de funcionários ativos
      const teamMembers = state.employees.filter((e) => e.status === "active").length

      // Despesas com materiais
      const materialExpenses = state.financialTransactions
        .filter((t) => t.type === "expense" && t.category === "Materials")
        .reduce((sum, t) => sum + t.amount, 0)

      setStats({
        totalRevenue,
        activeProjects,
        teamMembers,
        materialExpenses,
      })
    } catch (error) {
      console.error("Erro ao calcular estatísticas:", error)
    }
  }, [state])

  // Obter projetos ativos
  const activeProjects = state.projects
    .filter((p) => p.status === "in-progress" || p.status === "pending")
    .sort((a, b) => {
      // Ordenar por data de término (mais próximos primeiro)
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    })

  // Calcular saldo e progresso para cada projeto
  const projectsWithDetails = activeProjects.map((project) => {
    // Transações do projeto
    const projectTransactions = state.financialTransactions.filter((t) => t.project === project.id)
    const income = projectTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = projectTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const balance = income - expenses

    // Calcular dias restantes
    const today = new Date()
    const endDate = new Date(project.endDate)
    const totalDays =
      (new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24)
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Calcular progresso (baseado no tempo decorrido)
    const progress =
      project.status === "completed"
        ? 100
        : project.status === "cancelled"
          ? 0
          : Math.min(100, Math.max(0, Math.round(((totalDays - daysRemaining) / totalDays) * 100)))

    return {
      ...project,
      income,
      expenses,
      balance,
      daysRemaining,
      progress,
    }
  })

  // Calcular totais
  const totalProjectValue = projectsWithDetails.reduce((sum, p) => sum + p.value, 0)
  const totalProjectIncome = projectsWithDetails.reduce((sum, p) => sum + p.income, 0)
  const totalProjectExpenses = projectsWithDetails.reduce((sum, p) => sum + p.expenses, 0)
  const totalProjectBalance = totalProjectIncome - totalProjectExpenses

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Painel</h2>
        <Button onClick={() => router.push("/dashboard/projects/")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-700 dark:text-blue-300">
              <Building2 className="h-4 w-4 mr-2" /> Projetos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{stats.activeProjects}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Valor total:{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalProjectValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-700 dark:text-green-300">
              <DollarSign className="h-4 w-4 mr-2" /> Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 dark:text-green-200">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalProjectBalance)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Receitas:{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalProjectIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-amber-700 dark:text-amber-300">
              <HardHat className="h-4 w-4 mr-2" /> Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-800 dark:text-amber-200">{stats.teamMembers}</div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Funcionários ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-red-700 dark:text-red-300">
              <Package className="h-4 w-4 mr-2" /> Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800 dark:text-red-200">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalProjectExpenses)}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Materiais e mão de obra</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de projetos ativos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Projetos em Andamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projectsWithDetails.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum projeto ativo no momento.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/projects/")}>
                  <Plus className="mr-2 h-4 w-4" /> Criar Novo Projeto
                </Button>
              </div>
            ) : (
              projectsWithDetails.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => {
                    // Salvar a página atual no sessionStorage para poder voltar depois
                    sessionStorage.setItem("projectReferrer", window.location.pathname)
                    router.push(`/dashboard/projects/${project.id}`)
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                    </div>
                    <Badge variant={project.status === "in-progress" ? "default" : "warning"}>
                      {project.status === "in-progress" ? "Em Andamento" : "Pendente"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor do Projeto</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Saldo Atual</p>
                      <p className={`font-medium ${project.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.balance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Prazo</p>
                      <p className="font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {project.daysRemaining > 0
                          ? `${project.daysRemaining} dias restantes`
                          : project.daysRemaining === 0
                            ? "Último dia"
                            : `${Math.abs(project.daysRemaining)} dias de atraso`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Término Previsto</p>
                      <p className="font-medium">{new Date(project.endDate).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progresso</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {/* Avatares da equipe (simulado) */}
                      {[...Array(3)].map((_, i) => (
                        <Avatar key={i} className="border-2 border-background w-8 h-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32&text=${String.fromCharCode(65 + i)}`}
                          />
                          <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                        </Avatar>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                        +{Math.floor(Math.random() * 5) + 2}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <span>Ver Detalhes</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Próximos eventos e atividades */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="min-w-10 text-center">
                    <div className="text-sm font-bold">{new Date(Date.now() + i * 24 * 60 * 60 * 1000).getDate()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleString("pt-BR", { month: "short" })}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">
                      {["Reunião com Cliente", "Entrega de Materiais", "Inspeção de Qualidade"][i]}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {["10:00 - Projeto Johnson", "14:30 - Depósito Central", "16:00 - Projeto Rivera"][i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Equipe em Campo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.employees
                .filter((e) => e.status === "active")
                .slice(0, 4)
                .map((employee, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${employee.name.charAt(0)}`} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-medium">{employee.name}</h4>
                        <p className="text-xs text-muted-foreground">{employee.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {["Projeto Johnson", "Projeto Rivera", "Projeto Oakwood", "Projeto Thompson"][i]}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

