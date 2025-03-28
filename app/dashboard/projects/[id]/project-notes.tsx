"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit, Save } from "lucide-react"
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

interface ProjectNotesProps {
  projectId: string
}

// Tipo para notas do projeto
interface ProjectNote {
  id: string
  title: string
  content: string
  date: string
  author: string
}

export function ProjectNotes({ projectId }: ProjectNotesProps) {
  // Estado local para simular notas do projeto
  const [notes, setNotes] = useState<ProjectNote[]>([
    {
      id: "note-1",
      title: "Reunião Inicial",
      content:
        "Cliente solicitou que a pintura seja concluída antes do feriado. Precisamos ajustar o cronograma para atender a essa demanda.",
      date: "2023-07-15",
      author: "João Silva",
    },
    {
      id: "note-2",
      title: "Alteração de Cores",
      content:
        "Cliente mudou a escolha de cores para a sala de estar. Agora será utilizado o tom 'Azul Sereno' ao invés do 'Azul Oceano' inicialmente escolhido.",
      date: "2023-07-20",
      author: "Maria Oliveira",
    },
    {
      id: "note-3",
      title: "Problema com Fornecedor",
      content:
        "O fornecedor de tintas informou que haverá atraso na entrega. Precisamos verificar alternativas para não atrasar o cronograma.",
      date: "2023-07-25",
      author: "Carlos Santos",
    },
  ])

  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editedNote, setEditedNote] = useState<ProjectNote | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

  // Função para adicionar uma nova nota
  const handleAddNote = () => {
    if (!newNote.title || !newNote.content) return

    const note: ProjectNote = {
      id: `note-${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      date: new Date().toISOString().split("T")[0],
      author: "Usuário Atual", // Em uma aplicação real, isso viria do usuário logado
    }

    setNotes([...notes, note])
    setNewNote({ title: "", content: "" })
    setIsAddingNote(false)
  }

  // Função para iniciar a edição de uma nota
  const handleStartEdit = (note: ProjectNote) => {
    setEditingNoteId(note.id)
    setEditedNote({ ...note })
  }

  // Função para salvar a edição de uma nota
  const handleSaveEdit = () => {
    if (!editedNote) return

    setNotes(notes.map((note) => (note.id === editingNoteId ? editedNote : note)))
    setEditingNoteId(null)
    setEditedNote(null)
  }

  // Função para excluir uma nota
  const handleDeleteNote = () => {
    if (!noteToDelete) return

    setNotes(notes.filter((note) => note.id !== noteToDelete))
    setNoteToDelete(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Anotações do Projeto</CardTitle>
          <CardDescription>Registre informações importantes, alterações e decisões</CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsAddingNote(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Anotação
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingNote ? (
          <div className="border rounded-md p-4 mb-4">
            <Input
              placeholder="Título da anotação"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="mb-2"
            />
            <Textarea
              placeholder="Conteúdo da anotação..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-[100px] mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddNote}>Salvar Anotação</Button>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma anotação registrada para este projeto.</p>
              <Button variant="outline" className="mt-2" onClick={() => setIsAddingNote(true)}>
                Adicionar Primeira Anotação
              </Button>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="border rounded-md p-4">
                {editingNoteId === note.id ? (
                  <>
                    <Input
                      value={editedNote?.title || ""}
                      onChange={(e) => setEditedNote({ ...editedNote!, title: e.target.value })}
                      className="mb-2 font-medium text-lg"
                    />
                    <Textarea
                      value={editedNote?.content || ""}
                      onChange={(e) => setEditedNote({ ...editedNote!, content: e.target.value })}
                      className="min-h-[100px] mb-2"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setEditingNoteId(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{note.title}</h3>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartEdit(note)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setNoteToDelete(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{note.content}</p>
                    <div className="mt-4 text-xs text-muted-foreground flex justify-between">
                      <span>Por: {note.author}</span>
                      <span>{new Date(note.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Dialog para confirmar exclusão de nota */}
      <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Anotação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

