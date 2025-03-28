"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Dados estáticos para evitar problemas de renderização
const data = [
  { month: "Jan", revenue: 18500 },
  { month: "Fev", revenue: 22300 },
  { month: "Mar", revenue: 30200 },
  { month: "Abr", revenue: 27800 },
  { month: "Mai", revenue: 32100 },
  { month: "Jun", revenue: 38500 },
  { month: "Jul", revenue: 42300 },
  { month: "Ago", revenue: 45200 },
  { month: "Set", revenue: 0 },
  { month: "Out", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dez", revenue: 0 },
]

export function RevenueChart() {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Receita",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickFormatter={(value) => `R$${value / 1000}k`} tickLine={false} axisLine={false} tickMargin={8} />
          <Tooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value as number)
                }
              />
            }
          />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

