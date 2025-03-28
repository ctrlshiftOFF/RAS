"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Calendar, Clock } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ProjectTimelineProps {
  projectId: string
}

// Tipo para eventos da linha do tempo
interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: "milestone" | "task" | "issue" | "update" | "payment"
  status: "completed" | "in-progress" | "pending" | "cancelled"
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  // Estado local para simular eventos da linha do tempo
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "event-1",
      title: "Início do Projeto",
      description: "Reunião inicial com o cliente para definir escopo e expectativas.",
      date: "2023-07-15",
      type: "milestone",
      status: "completed",
    },
    {
      id: "event-2",
      title: "Compra de Materiais",
      description: "Aquisição de tintas, pincéis e outros materiais necessários.",
      date: "2023-07-18",
      type: "task",
      status: "completed",
    },
    {
      id: "event-3",
      title: "Preparação das Paredes",
      description: "Limpeza, lixamento e aplicação de massa corrida nas paredes.",
      date: "2023-07-20",
      type: "task",
      status: "in-progress",
    },
    {
      id: "event-4",
      title: "Problema com Infiltração",
      description: "Identificada infiltração na parede norte que precisa ser resolvida antes da pintura.",
      date: "2023-07-22",
      type: "issue",
      status: "pending",
    },
    {
      id: "event-5",
      title: "Pagamento Parcial",
      description: "Cliente realizou o pagamento de 50% do valor do projeto.",
      date: "2023-07-25",
      type: "payment",
      status: "completed",
    },
  ])

  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "task",
    status: "pending",
  })
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  // Função para adicionar um novo evento
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.type || !newEvent.status) return

    const event: TimelineEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      type: newEvent.type as "milestone" | "task" | "issue" | "update" | "payment",
      status: newEvent.status as "completed" | "in-progress" | "pending" | "cancelled",
    }

    setEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      type: "task",
      status: "pending",
    })
    setIsAddingEvent(false)
  }

  // Função para excluir um evento
  const handleDeleteEvent = () => {
    if (!eventToDelete) return

    setEvents(events.filter((event) => event.id !== eventToDelete))
    setEventToDelete(null)
  }

  // Função para obter a cor do tipo de evento
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "milestone":
        return "bg-blue-500"
      case "task":
        return "bg-green-500"
      case "issue":
        return "bg-red-500"
      case "update":
        return "bg-purple-500"
      case "payment":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Função para obter o rótulo do tipo de evento
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "milestone":
        return "Marco"
      case "task":
        return "Tarefa"
      case "issue":
        return "Problema"
      case "update":
        return "Atualização"
      case "payment":
        return "Pagamento"
      default:
        return type
    }
  }

  // Função para obter a variante do status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success"
      case "in-progress":
        return "default"
      case "pending":
        return "warning"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  // Função para obter o rótulo do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "in-progress":
        return "Em Andamento"
      case "pending":
        return "Pendente"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  // Ordenar eventos por data (mais recentes primeiro)
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Linha do Tempo</CardTitle>
          <CardDescription>Acompanhe o progresso e eventos importantes do projeto</CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsAddingEvent(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingEvent ? (
          <div className="border rounded-md p-4 mb-6">
            <h3 className="font-medium text-lg mb-4">Adicionar Novo Evento</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título do evento"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição detalhada do evento..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milestone">Marco</SelectItem>
                      <SelectItem value="task">Tarefa</SelectItem>
                      <SelectItem value="issue">Problema</SelectItem>
                      <SelectItem value="update">Atualização</SelectItem>
                      <SelectItem value="payment">Pagamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newEvent.status}
                    onValueChange={(value) => setNewEvent({ ...newEvent, status: value as any })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="in-progress">Em Andamento</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEvent}>Adicionar Evento</Button>
            </div>
          </div>
        ) : null}

        <div className="relative">
          {/* Linha vertical */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>

          <div className="space-y-8 relative">
            {sortedEvents.map((event, index) => (
              <div key={event.id} className="relative pl-10">
                {/* Círculo na linha do tempo */}
                <div
                  className={`absolute left-0 top-1.5 w-8 h-8 rounded-full flex items-center justify-center ${getEventTypeColor(event.type)}`}
                >
                  {event.type === "milestone" && <Calendar className="h-4 w-4 text-white" />}
                  {event.type === "task" && <Clock className="h-4 w-4 text-white" />}
                  {event.type === "issue" && <span className="text-white font-bold">!</span>}
                  {event.type === "update" && <span className="text-white font-bold">U</span>}
                  {event.type === "payment" && <span className="text-white font-bold">$</span>}
                </div>

                <div className="bg-card border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{event.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{getEventTypeLabel(event.type)}</Badge>
                        <Badge variant={getStatusVariant(event.status) as any}>{getStatusLabel(event.status)}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("pt-BR")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setEventToDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Dialog para confirmar exclusão de evento */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Evento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento da linha do tempo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

