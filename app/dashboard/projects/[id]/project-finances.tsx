"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "../../context/dashboard-provider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowDown, ArrowUp, DollarSign, HardHat, Package, Receipt, Wallet } from "lucide-react"

interface ProjectFinancesProps {
  projectId: string
}

export function ProjectFinances({ projectId }: ProjectFinancesProps) {
  const { state } = useDashboard()
  const [activeTab, setActiveTab] = useState("overview")

  // Obter o projeto atual
  const project = state.projects.find((p) => p.id === projectId)
  if (!project) return null

  // Obter transações relacionadas ao projeto
  const projectTransactions = state.financialTransactions
    .filter((t) => t.project === projectId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calcular totais de transações
  const totalIncome = projectTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = projectTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  // Obter funcionários alocados ao projeto (simulado)
  const projectEmployees = [
    { employeeId: "EMP-001", role: "Pintor Líder", hoursAllocated: 160, startDate: "2023-07-15" },
    { employeeId: "EMP-003", role: "Pintor", hoursAllocated: 120, startDate: "2023-07-15" },
    { employeeId: "EMP-006", role: "Pintor", hoursAllocated: 120, startDate: "2023-07-20" },
  ]

  // Calcular custos de mão de obra
  const laborCosts = projectEmployees.reduce((sum, pe) => {
    const employee = state.employees.find((e) => e.id === pe.employeeId)
    return sum + (employee?.hourlyRate || 0) * pe.hoursAllocated
  }, 0)

  // Obter materiais alocados ao projeto (simulado)
  const projectMaterials = [
    { materialId: "MAT-001", quantity: 24, unitCost: 28.99, totalCost: 695.76, dateAdded: "2023-07-15" },
    { materialId: "MAT-003", quantity: 12, unitCost: 32.99, totalCost: 395.88, dateAdded: "2023-07-15" },
    { materialId: "MAT-006", quantity: 20, unitCost: 4.99, totalCost: 99.8, dateAdded: "2023-07-20" },
    { materialId: "MAT-007", quantity: 15, unitCost: 6.99, totalCost: 104.85, dateAdded: "2023-07-20" },
  ]

  // Calcular custos de materiais
  const materialCosts = projectMaterials.reduce((sum, pm) => sum + pm.totalCost, 0)

  // Calcular outros custos operacionais (transações de despesa que não são materiais ou mão de obra)
  const otherExpenses = projectTransactions
    .filter((t) => t.type === "expense" && t.category !== "Materiais" && t.category !== "Mão de Obra")
    .reduce((sum, t) => sum + t.amount, 0)

  // Calcular custos totais operacionais
  const totalOperationalCosts = laborCosts + materialCosts + otherExpenses

  // Calcular lucro líquido e margem
  const netProfit = totalIncome - totalOperationalCosts
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

  // Calcular porcentagem do orçamento utilizado
  const budgetUsedPercentage = (totalOperationalCosts / project.value) * 100

  // Dados para o gráfico de distribuição de custos
  const costDistributionData = [
    { name: "Mão de Obra", value: laborCosts, color: "#4f46e5" },
    { name: "Materiais", value: materialCosts, color: "#0ea5e9" },
    { name: "Outros Custos", value: otherExpenses, color: "#f59e0b" },
  ]

  // Dados para o gráfico de receitas vs despesas
  const incomeVsExpensesData = [
    { name: "Receitas", value: totalIncome, color: "#10b981" },
    { name: "Despesas", value: totalOperationalCosts, color: "#ef4444" },
  ]

  // Categorias de despesas para o resumo
  const expenseCategories = {
    "Mão de Obra": laborCosts,
    Materiais: materialCosts,
    Transporte: projectTransactions
      .filter((t) => t.type === "expense" && t.category === "Transporte")
      .reduce((sum, t) => sum + t.amount, 0),
    Equipamentos: projectTransactions
      .filter((t) => t.type === "expense" && t.category === "Equipamentos")
      .reduce((sum, t) => sum + t.amount, 0),
    "Despesas Gerais": projectTransactions
      .filter((t) => t.type === "expense" && t.category === "Despesas Gerais")
      .reduce((sum, t) => sum + t.amount, 0),
    Outros:
      otherExpenses -
      projectTransactions
        .filter(
          (t) =>
            t.type === "expense" &&
            (t.category === "Transporte" || t.category === "Equipamentos" || t.category === "Despesas Gerais"),
        )
        .reduce((sum, t) => sum + t.amount, 0),
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="costs">Custos Operacionais</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Cards de resumo financeiro */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-green-700 dark:text-green-300">
                  <Wallet className="h-4 w-4 mr-2" /> Valor do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.value)}
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-green-600 dark:text-green-400 flex justify-between">
                    <span>Orçamento Utilizado:</span>
                    <span>{budgetUsedPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={budgetUsedPercentage} className="h-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-blue-700 dark:text-blue-300">
                  <ArrowUp className="h-4 w-4 mr-2" /> Receitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalIncome)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {totalIncome > 0
                    ? `${((totalIncome / project.value) * 100).toFixed(1)}% do valor total`
                    : "Sem receitas registradas"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-red-700 dark:text-red-300">
                  <ArrowDown className="h-4 w-4 mr-2" /> Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalOperationalCosts)}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {totalOperationalCosts > 0
                    ? `${((totalOperationalCosts / project.value) * 100).toFixed(1)}% do valor total`
                    : "Sem despesas registradas"}
                </p>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${netProfit >= 0 ? "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800" : "from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 border-rose-200 dark:border-rose-800"}`}
            >
              <CardHeader className="pb-2">
                <CardTitle
                  className={`text-sm font-medium flex items-center ${netProfit >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}
                >
                  <DollarSign className="h-4 w-4 mr-2" /> Lucro Líquido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${netProfit >= 0 ? "text-emerald-800 dark:text-emerald-200" : "text-rose-800 dark:text-rose-200"}`}
                >
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(netProfit)}
                </div>
                <p
                  className={`text-xs ${netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"} mt-1`}
                >
                  Margem de Lucro: {profitMargin.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Custos</CardTitle>
                <CardDescription>Análise dos custos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                {costDistributionData.some((item) => item.value > 0) ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {costDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(value as number)
                          }
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Nenhuma despesa registrada</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>Comparação entre receitas e despesas</CardDescription>
              </CardHeader>
              <CardContent>
                {incomeVsExpensesData.some((item) => item.value > 0) ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeVsExpensesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {incomeVsExpensesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(value as number)
                          }
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Nenhuma transação registrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Custos Operacionais</CardTitle>
              <CardDescription>Detalhamento dos custos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resumo de custos por categoria */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <HardHat className="h-4 w-4 mr-2 text-blue-600" /> Mão de Obra
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(laborCosts)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalOperationalCosts > 0
                          ? `${((laborCosts / totalOperationalCosts) * 100).toFixed(1)}% do total`
                          : "0%"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-cyan-200 dark:border-cyan-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Package className="h-4 w-4 mr-2 text-cyan-600" /> Materiais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(materialCosts)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalOperationalCosts > 0
                          ? `${((materialCosts / totalOperationalCosts) * 100).toFixed(1)}% do total`
                          : "0%"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Receipt className="h-4 w-4 mr-2 text-amber-600" /> Outros Custos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(otherExpenses)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalOperationalCosts > 0
                          ? `${((otherExpenses / totalOperationalCosts) * 100).toFixed(1)}% do total`
                          : "0%"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabela detalhada de custos */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">% do Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(expenseCategories).map(([category, amount], index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{category}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {totalOperationalCosts > 0
                              ? `${((amount / totalOperationalCosts) * 100).toFixed(1)}%`
                              : "0%"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="font-bold">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            totalOperationalCosts,
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold">100%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Detalhamento de mão de obra */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Detalhamento de Mão de Obra</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Funcionário</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Horas Alocadas</TableHead>
                            <TableHead>Taxa Horária</TableHead>
                            <TableHead className="text-right">Custo Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projectEmployees.map((pe, index) => {
                            const employee = state.employees.find((e) => e.id === pe.employeeId)
                            const hourlyRate = employee?.hourlyRate || 0
                            const totalCost = hourlyRate * pe.hoursAllocated

                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {employee?.name || "Funcionário não encontrado"}
                                </TableCell>
                                <TableCell>{pe.role}</TableCell>
                                <TableCell>{pe.hoursAllocated}h</TableCell>
                                <TableCell>
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    hourlyRate,
                                  )}
                                  /h
                                </TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    totalCost,
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={4} className="font-bold">
                              Total de Mão de Obra
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                laborCosts,
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Detalhamento de materiais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Detalhamento de Materiais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Custo Unitário</TableHead>
                            <TableHead className="text-right">Custo Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projectMaterials.map((pm, index) => {
                            const material = state.materials.find((m) => m.id === pm.materialId)

                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {material?.name || "Material não encontrado"}
                                </TableCell>
                                <TableCell>
                                  {pm.quantity} {material?.unit || "unid."}
                                </TableCell>
                                <TableCell>
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    pm.unitCost,
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    pm.totalCost,
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={3} className="font-bold">
                              Total de Materiais
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                materialCosts,
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Financeiras</CardTitle>
              <CardDescription>Histórico de todas as transações do projeto</CardDescription>
            </CardHeader>
            <CardContent>
              {projectTransactions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectTransactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === "income" ? "success" : "destructive"}>
                              {transaction.type === "income" ? "Receita" : "Despesa"}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`text-right ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              transaction.amount,
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px]">
                  <p className="text-muted-foreground">Nenhuma transação registrada para este projeto</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

