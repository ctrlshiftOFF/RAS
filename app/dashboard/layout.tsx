import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Home, LayoutDashboard, DollarSign, FileText, Users, BarChart, Settings, Briefcase } from "lucide-react"

import { DashboardNav } from "./dashboard-nav"
import { DashboardProvider } from "./context/dashboard-provider"

export const metadata: Metadata = {
  title: "Painel - R.A.S.",
  description: "Painel de gerenciamento financeiro para a empresa R.A.S. de pintura e reforma",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    {
      title: "Painel",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Orçamentos",
      href: "/dashboard/estimates",
      icon: FileText,
    },
    {
      title: "Projetos",
      href: "/dashboard/projects",
      icon: Briefcase,
    },
    {
      title: "Finanças",
      href: "/dashboard/finances",
      icon: DollarSign,
    },
    {
      title: "Funcionários",
      href: "/dashboard/employees",
      icon: Users,
    },
    {
      title: "Relatórios",
      href: "/dashboard/reports",
      icon: BarChart,
    },
    {
      title: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <DashboardProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                <span className="font-bold">R.A.S.</span>
              </Link>
              <span className="text-sm text-muted-foreground">Painel Financeiro</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard/profile" className="text-sm font-medium">
                Perfil
              </Link>
              <Link href="/" className="text-sm font-medium">
                Sair
              </Link>
            </nav>
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <DashboardNav items={navItems} />
          </aside>
          <main className="flex w-full flex-col overflow-hidden pt-6">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  )
}

