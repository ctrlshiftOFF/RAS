"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingDown, TrendingUp } from "lucide-react"

// Dados estáticos para evitar problemas de renderização
const stats = {
  totalRevenue: 256489.32,
  totalExpenses: 187342.18,
  netProfit: 69147.14,
  profitMargin: 27.0,
  revenueChange: 18.2,
  expensesChange: 12.5,
  profitChange: 8.7,
  marginChange: -2.3,
}

export function FinancialSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total (Ano)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalRevenue)}
          </div>
          <div className="flex items-center pt-1 text-xs text-green-600">
            <ArrowUpIcon className="mr-1 h-3 w-3" />
            <span>{stats.revenueChange}% em relação ao ano anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Totais (Ano)</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.totalExpenses)}
          </div>
          <div className="flex items-center pt-1 text-xs text-red-600">
            <ArrowUpIcon className="mr-1 h-3 w-3" />
            <span>{stats.expensesChange}% em relação ao ano anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Líquido (Ano)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(stats.netProfit)}
          </div>
          <div className="flex items-center pt-1 text-xs text-green-600">
            <ArrowUpIcon className="mr-1 h-3 w-3" />
            <span>{stats.profitChange}% em relação ao ano anterior</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.profitMargin.toFixed(1)}%</div>
          <div className="flex items-center pt-1 text-xs text-red-600">
            <ArrowDownIcon className="mr-1 h-3 w-3" />
            <span>{Math.abs(stats.marginChange)}% em relação ao ano anterior</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

