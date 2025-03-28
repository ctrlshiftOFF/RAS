"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Dados estáticos para evitar problemas de renderização
const data = [
  { name: "Materiais", value: 89456.32, color: "#3b82f6" },
  { name: "Mão de Obra", value: 78234.5, color: "#10b981" },
  { name: "Equipamentos", value: 12450.75, color: "#f59e0b" },
  { name: "Despesas Gerais", value: 18750.0, color: "#6366f1" },
  { name: "Seguros", value: 8450.61, color: "#ec4899" },
]

export function ExpensesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
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
  )
}

