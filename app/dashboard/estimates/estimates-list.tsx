"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { EstimateDialog } from "./estimate-dialog"
import { ConvertToProjectDialog } from "./convert-to-project-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Interface para os orçamentos
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

interface EstimatesListProps {
  estimates: Estimate[]
  onUpdateEstimates?: (estimates: Estimate[]) => void
}

export function EstimatesList({ estimates, onUpdateEstimates }: EstimatesListProps) {
  // Estados locais
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [estimateToDelete, setEstimateToDelete] = useState<string | null>(null)
  const [estimateToEdit, setEstimateToEdit] = useState<Estimate | null>(null)
  const [estimateToConvert, setEstimateToConvert] = useState<Estimate | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  // Filtrar orçamentos com base nos filtros selecionados
  const filteredEstimates = estimates.filter((estimate) => {
    const matchesStatus = statusFilter === "all" || estimate.status === statusFilter
    const matchesSource = sourceFilter === "all" || estimate.source === sourceFilter
    const matchesSearch =
      !columnFilters.length ||
      (table.getColumn("client")?.getFilterValue()
        ? estimate.client.toLowerCase().includes((table.getColumn("client")?.getFilterValue() as string).toLowerCase())
        : true)

    return matchesStatus && matchesSource && matchesSearch
  })

  // Função para excluir um orçamento
  const handleDeleteEstimate = (id: string) => {
    if (onUpdateEstimates) {
      onUpdateEstimates(estimates.filter((est) => est.id !== id))
    }
    setEstimateToDelete(null)
  }

  // Tradução dos status dos orçamentos
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "approved":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      case "completed":
        return "Concluído"
      default:
        return status
    }
  }

  // Definição das colunas da tabela
  const columns: ColumnDef<Estimate>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "client",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Cliente
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("client")}</div>,
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "address",
      header: "Endereço",
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("address")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return <div>{date.toLocaleDateString("pt-BR")}</div>
      },
    },
    {
      accessorKey: "time",
      header: "Hora",
      cell: ({ row }) => <div>{row.getValue("time")}</div>,
    },
    {
      accessorKey: "value",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("value"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string

        return (
          <Badge
            variant={
              status === "pending"
                ? "warning"
                : status === "approved"
                  ? "success"
                  : status === "completed"
                    ? "default"
                    : "destructive"
            }
          >
            {getStatusLabel(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "source",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Origem
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const source = row.getValue("source") as string

        return (
          <Badge variant={source === "website" ? "secondary" : "outline"}>
            {source === "website" ? "Site" : "Admin"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const estimate = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEstimateToEdit(estimate)}>Editar orçamento</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEstimateToDelete(estimate.id)}>Excluir orçamento</DropdownMenuItem>
              <DropdownMenuSeparator />
              {estimate.status === "approved" && (
                <DropdownMenuItem onClick={() => setEstimateToConvert(estimate)}>Converter em Projeto</DropdownMenuItem>
              )}
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredEstimates,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const resetFilters = () => {
    setStatusFilter("all")
    setSourceFilter("all")
    table.getColumn("client")?.setFilterValue("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar orçamentos..."
            value={(table.getColumn("client")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("client")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Origens</SelectItem>
              <SelectItem value="website">Site</SelectItem>
              <SelectItem value="admin">Administrativo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={resetFilters}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length} de {estimates.length} orçamentos
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Próximo
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!estimateToDelete} onOpenChange={(open) => !open && setEstimateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o orçamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteEstimate(estimateToDelete!)}
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Estimate Dialog */}
      {estimateToEdit && (
        <EstimateDialog
          open={!!estimateToEdit}
          onOpenChange={(open) => !open && setEstimateToEdit(null)}
          estimate={estimateToEdit}
          mode="edit"
          onAddEstimate={(updatedEstimate) => {
            if (onUpdateEstimates) {
              onUpdateEstimates(estimates.map((est) => (est.id === updatedEstimate.id ? updatedEstimate : est)))
            }
            setEstimateToEdit(null)
          }}
        />
      )}

      {/* Convert to Project Dialog */}
      {estimateToConvert && (
        <ConvertToProjectDialog
          open={!!estimateToConvert}
          onOpenChange={(open) => !open && setEstimateToConvert(null)}
          estimate={estimateToConvert}
        />
      )}
    </div>
  )
}

