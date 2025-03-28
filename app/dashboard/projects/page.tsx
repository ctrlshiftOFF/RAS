"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsTable } from "../projects-table"
import { ProjectsKanban } from "./projects-kanban"

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Projetos</CardTitle>
              <CardDescription>Visualize e gerencie todos os projetos da empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsTable showFilters={true} defaultPageSize={10} defaultFilter="all" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quadro Kanban</CardTitle>
              <CardDescription>Visualize o progresso dos projetos em um quadro Kanban</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsKanban />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Projetos</CardTitle>
              <CardDescription>Visualize os projetos em um calendário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Visualização de calendário será implementada em breve.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

