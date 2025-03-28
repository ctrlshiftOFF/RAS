"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EstimatesList } from "./estimates-list"
import { EstimateDialog } from "./estimate-dialog"
import { Plus, ChevronLeft, ChevronRight, ListIcon, CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Tipo para os orçamentos
interface Estimate {
  id: string
  client: string
  address: string
  type: string
  date: string
  time: string
  value: number
  status: "pending" | "approved" | "rejected" | "completed"
  source: "website" | "admin"
}

// Dados iniciais de orçamentos
const initialEstimates: Estimate[] = [
  {
    id: "EST-001",
    client: "João Silva",
    address: "Rua das Flores, 123",
    type: "Pintura Externa",
    date: "2023-08-05",
    time: "09:30",
    value: 4800,
    status: "pending",
    source: "website",
  },
  {
    id: "EST-002",
    client: "Maria Costa",
    address: "Av. Principal, 456, Apto 302",
    type: "Pintura Interna",
    date: "2023-08-10",
    time: "14:00",
    value: 3200,
    status: "approved",
    source: "admin",
  },
  {
    id: "EST-003",
    client: "Carlos Oliveira",
    address: "Rua dos Pinheiros, 789",
    type: "Reforma de Banheiro",
    date: "2023-08-15",
    time: "10:00",
    value: 7500,
    status: "rejected",
    source: "website",
  },
  {
    id: "EST-004",
    client: "Ana Santos",
    address: "Alameda das Árvores, 234",
    type: "Pintura Externa",
    date: "2023-08-22",
    time: "15:30",
    value: 5200,
    status: "pending",
    source: "admin",
  },
  {
    id: "EST-005",
    client: "Roberto Almeida",
    address: "Rua do Comércio, 567",
    type: "Pintura Comercial",
    date: "2023-08-28",
    time: "08:00",
    value: 9800,
    status: "approved",
    source: "website",
  },
  {
    id: "EST-006",
    client: "Fernanda Lima",
    address: "Av. das Palmeiras, 890",
    type: "Reforma de Cozinha",
    date: "2023-09-03",
    time: "11:00",
    value: 12500,
    status: "pending",
    source: "website",
  },
  {
    id: "EST-007",
    client: "Paulo Mendes",
    address: "Rua dos Ipês, 123",
    type: "Pintura Interna",
    date: "2023-09-08",
    time: "13:30",
    value: 4200,
    status: "completed",
    source: "admin",
  },
  {
    id: "EST-008",
    client: "Luciana Ferreira",
    address: "Av. Central, 456",
    type: "Pintura Externa",
    date: "2023-09-15",
    time: "09:00",
    value: 6800,
    status: "pending",
    source: "website",
  },
]

export default function EstimatesPage() {
  // Estados principais
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addingForDate, setAddingForDate] = useState<Date | null>(null)

  // Estados para notas
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [currentNoteDate, setCurrentNoteDate] = useState<Date | null>(null)
  const [noteText, setNoteText] = useState("")

  // Função para navegar entre meses
  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  // Função para formatar o mês e ano
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  }

  // Função para obter orçamentos para uma data específica
  const getEstimatesForDate = (date: Date) => {
    return estimates.filter((est) => {
      const estDate = new Date(est.date)
      return (
        estDate.getDate() === date.getDate() &&
        estDate.getMonth() === date.getMonth() &&
        estDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Função para lidar com o clique em um dia
  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
  }

  // Função para adicionar um orçamento para uma data específica
  const handleAddForDate = (date: Date) => {
    setAddingForDate(date)
    setIsAddDialogOpen(true)
  }

  // Função para adicionar uma nota
  const handleAddNote = (date: Date) => {
    setCurrentNoteDate(date)
    setNoteText(notes[date.toISOString().split("T")[0]] || "")
    setIsEditingNote(true)
  }

  // Função para salvar uma nota
  const saveNote = () => {
    if (currentNoteDate) {
      const dateKey = currentNoteDate.toISOString().split("T")[0]
      setNotes((prev) => ({
        ...prev,
        [dateKey]: noteText,
      }))
      setIsEditingNote(false)
      setCurrentNoteDate(null)
    }
  }

  // Função para adicionar um novo orçamento
  const handleAddEstimate = (newEstimate: Estimate) => {
    setEstimates((prev) => [...prev, newEstimate])
  }

  // Função para atualizar a lista de orçamentos
  const handleUpdateEstimates = (updatedEstimates: Estimate[]) => {
    setEstimates(updatedEstimates)
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orçamentos</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "calendar" ? "list" : "calendar")}
          >
            {viewMode === "calendar" ? <ListIcon className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-xl font-semibold capitalize">{formatMonthYear(currentMonth)}</h3>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="custom-calendar-wrapper">
                <style jsx global>{`
                  .custom-calendar-wrapper .react-calendar {
                    width: 100%;
                    border: none;
                  }
                  .custom-calendar-wrapper .react-calendar__month-view__weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: 0.8em;
                    padding: 8px 0;
                    border-bottom: 1px solid hsl(var(--border));
                  }
                  .custom-calendar-wrapper .react-calendar__month-view__days {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                  }
                  .custom-calendar-wrapper .react-calendar__tile {
                    height: 120px;
                    display: flex;
                    flex-direction: column;
                    padding: 8px;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid hsl(var(--border));
                  }
                  .custom-calendar-wrapper .react-calendar__tile--now {
                    background-color: hsl(var(--primary) / 0.1);
                  }
                  .custom-calendar-wrapper .react-calendar__tile--active {
                    background-color: hsl(var(--primary) / 0.2);
                  }
                  .custom-calendar-wrapper .day-content {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                  }
                  .custom-calendar-wrapper .day-number {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    font-size: 0.8rem;
                    font-weight: 500;
                  }
                  .custom-calendar-wrapper .day-events {
                    margin-top: 20px;
                    font-size: 0.75rem;
                    overflow: hidden;
                    flex-grow: 1;
                  }
                  .custom-calendar-wrapper .day-event {
                    margin-bottom: 4px;
                    padding: 2px 4px;
                    border-radius: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .custom-calendar-wrapper .day-event-website {
                    background-color: hsl(var(--primary) / 0.2);
                    color: hsl(var(--primary));
                  }
                  .custom-calendar-wrapper .day-event-admin {
                    background-color: hsl(var(--success) / 0.2);
                    color: hsl(var(--success));
                  }
                  .custom-calendar-wrapper .day-add-button {
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    opacity: 0;
                    transition: opacity 0.2s;
                  }
                  .custom-calendar-wrapper .react-calendar__tile:hover .day-add-button {
                    opacity: 1;
                  }
                  .custom-calendar-wrapper .day-note {
                    position: absolute;
                    bottom: 4px;
                    left: 4px;
                    font-size: 0.7rem;
                    color: hsl(var(--muted-foreground));
                    max-width: 80%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                `}</style>
                <div className="react-calendar">
                  <div className="react-calendar__month-view__weekdays">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
                      <div key={index} className="react-calendar__month-view__weekdays__weekday">
                        <abbr title={day}>{day}</abbr>
                      </div>
                    ))}
                  </div>
                  <div className="react-calendar__month-view__days">
                    {(() => {
                      // Gerar os dias do mês atual
                      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
                      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
                      const startingDayOfWeek = firstDayOfMonth.getDay()
                      const daysInMonth = lastDayOfMonth.getDate()

                      // Dias do mês anterior para preencher o início do calendário
                      const prevMonthDays = []
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        const day = new Date(firstDayOfMonth)
                        day.setDate(firstDayOfMonth.getDate() - (startingDayOfWeek - i))
                        prevMonthDays.push(day)
                      }

                      // Dias do mês atual
                      const currentMonthDays = []
                      for (let i = 1; i <= daysInMonth; i++) {
                        const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
                        currentMonthDays.push(day)
                      }

                      // Dias do próximo mês para preencher o final do calendário
                      const nextMonthDays = []
                      const totalDaysShown = 42 // 6 semanas * 7 dias
                      const remainingDays = totalDaysShown - (prevMonthDays.length + currentMonthDays.length)
                      for (let i = 1; i <= remainingDays; i++) {
                        const day = new Date(lastDayOfMonth)
                        day.setDate(lastDayOfMonth.getDate() + i)
                        nextMonthDays.push(day)
                      }

                      // Combinar todos os dias
                      const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]

                      return allDays.map((day, index) => {
                        const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
                        const isToday = day.toDateString() === new Date().toDateString()
                        const isSelected = selectedDay && day.toDateString() === selectedDay.toDateString()
                        const dayEstimates = getEstimatesForDate(day)

                        // Verificar se há uma anotação para este dia
                        const dateKey = day.toISOString().split("T")[0]
                        const hasNote = notes[dateKey] ? true : false
                        const dayNoteText = notes[dateKey] || ""

                        return (
                          <div
                            key={index}
                            className={`react-calendar__tile ${isToday ? "react-calendar__tile--now" : ""} ${
                              isSelected ? "react-calendar__tile--active" : ""
                            } ${!isCurrentMonth ? "text-muted-foreground/50" : ""}`}
                            onClick={() => handleDayClick(day)}
                            onDoubleClick={() => handleAddForDate(day)}
                          >
                            <div className="day-content">
                              <div className="day-number">{day.getDate()}</div>
                              <div className="day-events">
                                {dayEstimates.slice(0, 3).map((est, i) => (
                                  <div
                                    key={i}
                                    className={`day-event ${
                                      est.source === "website" ? "day-event-website" : "day-event-admin"
                                    }`}
                                    title={`${est.client} - ${est.type} - ${est.time}`}
                                  >
                                    {est.time} - {est.client}
                                  </div>
                                ))}
                                {dayEstimates.length > 3 && (
                                  <div className="text-xs text-muted-foreground">+{dayEstimates.length - 3} mais</div>
                                )}
                              </div>
                              {hasNote && (
                                <div className="day-note" title={dayNoteText}>
                                  {dayNoteText}
                                </div>
                              )}
                            </div>
                            <div className="day-add-button">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddForDate(day)
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Lista de Orçamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <EstimatesList estimates={estimates} onUpdateEstimates={handleUpdateEstimates} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Orçamentos</CardTitle>
            <CardDescription>Visualize e gerencie todos os orçamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <EstimatesList estimates={estimates} onUpdateEstimates={handleUpdateEstimates} />
          </CardContent>
        </Card>
      )}

      {isAddDialogOpen && (
        <EstimateDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          defaultDate={addingForDate ? addingForDate.toISOString().split("T")[0] : undefined}
          onClose={() => setAddingForDate(null)}
          onAddEstimate={handleAddEstimate}
        />
      )}

      {isEditingNote && currentNoteDate && (
        <Dialog open={isEditingNote} onOpenChange={setIsEditingNote}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Anotação</DialogTitle>
              <DialogDescription>
                Adicione uma anotação para o dia {currentNoteDate.toLocaleDateString("pt-BR")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Digite sua anotação aqui..."
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingNote(false)}>
                Cancelar
              </Button>
              <Button onClick={saveNote}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

