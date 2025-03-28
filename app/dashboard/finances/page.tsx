"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExpensesChart } from "./expenses-chart"
import { FinancialSummary } from "./financial-summary"
import { useDashboard } from "../context/dashboard-provider"

export default function FinancesPage() {
  const { state } = useDashboard()

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestão Financeira</h2>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <FinancialSummary />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Distribuição de Despesas</CardTitle>
                <CardDescription>Distribuição de despesas por categoria</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ExpensesChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas atividades financeiras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.financialTransactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map((transaction, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className={`mr-4 rounded-full p-2 ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          <div
                            className={`h-4 w-4 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div
                          className={`text-sm font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                            transaction.amount,
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Receitas</CardTitle>
              <CardDescription>Monitore todas as fontes de receita e status de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs font-medium text-muted-foreground">Receita Total (Ano)</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        state.financialTransactions
                          .filter((t) => t.type === "income")
                          .reduce((sum, t) => sum + t.amount, 0),
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs font-medium text-muted-foreground">Faturas Pendentes</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        state.financialTransactions
                          .filter((t) => t.type === "income" && t.status === "pending")
                          .reduce((sum, t) => sum + t.amount, 0),
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs font-medium text-muted-foreground">Valor Médio de Projeto</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        state.projects.length > 0
                          ? state.projects.reduce((sum, p) => sum + p.value, 0) / state.projects.length
                          : 0,
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center p-8">
                  <p className="text-muted-foreground">Clique no botão abaixo para gerenciar transações</p>
                  <Button className="mt-4">Gerenciar Transações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Despesas</CardTitle>
              <CardDescription>Acompanhe e categorize todas as despesas do negócio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs font-medium text-muted-foreground">Despesas Totais (Ano)</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        state.financialTransactions
                          .filter((t) => t.type === "expense")
                          .reduce((sum, t) => sum + t.amount, 0),
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs font-medium text-muted-foreground">Custo de Materiais</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        state.financialTransactions
                          .filter((t) => t.type === "expense" && t.category === "Materiais")
                          .reduce((sum, t) => sum + t.amount, 0),
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs font-medium text-muted-foreground">Custo de Mão de Obra</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        state.financialTransactions
                          .filter((t) => t.type === "expense" && t.category === "Mão de Obra")
                          .reduce((sum, t) => sum + t.amount, 0),
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center p-8">
                  <p className="text-muted-foreground">Clique no botão abaixo para gerenciar despesas</p>
                  <Button className="mt-4">Gerenciar Despesas</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>Gere e visualize relatórios financeiros detalhados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Demonstrativo de Resultados</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Visualize as receitas, custos e despesas da sua empresa em um período específico
                    </p>
                    <Button variant="outline">Gerar Relatório</Button>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Fluxo de Caixa</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Acompanhe como o dinheiro está entrando e saindo do seu negócio
                    </p>
                    <Button variant="outline">Gerar Relatório</Button>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Lucratividade de Projetos</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analise a lucratividade de projetos individuais
                    </p>
                    <Button variant="outline">Gerar Relatório</Button>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Análise de Despesas</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detalhe as despesas por categoria e identifique oportunidades de redução de custos
                    </p>
                    <Button variant="outline">Gerar Relatório</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

