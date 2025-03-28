"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useDashboard } from "../context/dashboard-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign } from "lucide-react"

export function ProjectsKanban() {
  const { state } = useDashboard()
  const router = useRouter()

  // Organizar projetos por status
  const pendingProjects = state.projects.filter((p) => p.status === "pending")
  const inProgressProjects = state.projects.filter((p) => p.status === "in-progress")
  const completedProjects = state.projects.filter((p) => p.status === "completed")
  const cancelledProjects = state.projects.filter((p) => p.status === "cancelled")

  // Estado para controlar os projetos em cada coluna
  const [columns, setColumns] = useState({
    pending: {
      id: "pending",
      title: "Pendentes",
      items: pendingProjects,
    },
    inProgress: {
      id: "in-progress",
      title: "Em Andamento",
      items: inProgressProjects,
    },
    completed: {
      id: "completed",
      title: "Concluídos",
      items: completedProjects,
    },
    cancelled: {
      id: "cancelled",
      title: "Cancelados",
      items: cancelledProjects,
    },
  })

  // Função para lidar com o arrastar e soltar
  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    // Se o projeto foi movido para uma coluna diferente
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as keyof typeof columns]
      const destColumn = columns[destination.droppableId as keyof typeof columns]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })

      // Aqui você implementaria a lógica para atualizar o status do projeto no banco de dados
      console.log(`Projeto ${removed.id} movido de ${source.droppableId} para ${destination.droppableId}`)
    } else {
      // Se o projeto foi reordenado dentro da mesma coluna
      const column = columns[source.droppableId as keyof typeof columns]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  // Função para navegar para a página de detalhes do projeto
  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`)
  }

  return (
    <div className="h-[600px] overflow-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full pb-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="min-w-[300px] w-1/4 flex flex-col">
              <h3 className="font-medium text-sm mb-2 p-2 bg-muted rounded-t-md">
                {column.title} ({column.items.length})
              </h3>
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 p-2 rounded-b-md space-y-2 min-h-[200px] ${
                      snapshot.isDraggingOver ? "bg-muted/50" : "bg-muted/20"
                    }`}
                  >
                    {column.items.map((project, index) => (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-2 min-h-[100px] rounded-md border ${
                              snapshot.isDragging ? "bg-background shadow-lg" : "bg-background"
                            }`}
                            onClick={() => handleViewProject(project.id)}
                          >
                            <div className="flex flex-col h-full">
                              <div className="font-medium mb-1">{project.name}</div>
                              <div className="text-xs text-muted-foreground mb-2">{project.client}</div>
                              <div className="flex items-center text-xs mb-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(project.startDate).toLocaleDateString("pt-BR")}</span>
                                <span className="mx-1">-</span>
                                <span>{new Date(project.endDate).toLocaleDateString("pt-BR")}</span>
                              </div>
                              <div className="flex items-center text-xs mb-2">
                                <DollarSign className="h-3 w-3 mr-1" />
                                <span>
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                                    project.value,
                                  )}
                                </span>
                              </div>
                              <div className="mt-auto pt-2 border-t flex justify-between items-center">
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
                                  className="text-xs"
                                >
                                  {project.status === "in-progress"
                                    ? "Em Andamento"
                                    : project.status === "completed"
                                      ? "Concluído"
                                      : project.status === "pending"
                                        ? "Pendente"
                                        : "Cancelado"}
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-6 px-2">
                                  Ver
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

