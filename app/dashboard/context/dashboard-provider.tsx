"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import {
  projectsData,
  employeesData,
  materialsData,
  financialTransactionsData,
  type Project,
  type Employee,
  type Material,
  type FinancialTransaction,
} from "../data/dashboard-data"

// Define o tipo do estado
type DashboardState = {
  projects: Project[]
  employees: Employee[]
  materials: Material[]
  financialTransactions: FinancialTransaction[]
}

// Define as ações possíveis
type DashboardAction =
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "ADD_EMPLOYEE"; payload: Employee }
  | { type: "UPDATE_EMPLOYEE"; payload: Employee }
  | { type: "DELETE_EMPLOYEE"; payload: string }
  | { type: "ADD_MATERIAL"; payload: Material }
  | { type: "UPDATE_MATERIAL"; payload: Material }
  | { type: "DELETE_MATERIAL"; payload: string }
  | { type: "ADD_TRANSACTION"; payload: FinancialTransaction }
  | { type: "UPDATE_TRANSACTION"; payload: FinancialTransaction }
  | { type: "DELETE_TRANSACTION"; payload: string }

// Estado inicial
const initialState: DashboardState = {
  projects: projectsData,
  employees: employeesData,
  materials: materialsData,
  financialTransactions: financialTransactionsData,
}

// Reducer para gerenciar o estado
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...state.projects, action.payload],
      }
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) => (project.id === action.payload.id ? action.payload : project)),
      }
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload),
      }
    case "ADD_EMPLOYEE":
      return {
        ...state,
        employees: [...state.employees, action.payload],
      }
    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.map((employee) => (employee.id === action.payload.id ? action.payload : employee)),
      }
    case "DELETE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.filter((employee) => employee.id !== action.payload),
      }
    case "ADD_MATERIAL":
      return {
        ...state,
        materials: [...state.materials, action.payload],
      }
    case "UPDATE_MATERIAL":
      return {
        ...state,
        materials: state.materials.map((material) => (material.id === action.payload.id ? action.payload : material)),
      }
    case "DELETE_MATERIAL":
      return {
        ...state,
        materials: state.materials.filter((material) => material.id !== action.payload),
      }
    case "ADD_TRANSACTION":
      return {
        ...state,
        financialTransactions: [...state.financialTransactions, action.payload],
      }
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        financialTransactions: state.financialTransactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        ),
      }
    case "DELETE_TRANSACTION":
      return {
        ...state,
        financialTransactions: state.financialTransactions.filter((transaction) => transaction.id !== action.payload),
      }
    default:
      return state
  }
}

// Tipo do contexto
type DashboardContextType = {
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
  getNextId: (type: "project" | "employee" | "material" | "transaction") => string
}

// Criar o contexto
const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Função para gerar o próximo ID
  const getNextId = (type: "project" | "employee" | "material" | "transaction") => {
    let prefix = ""
    let items: { id: string }[] = []

    switch (type) {
      case "project":
        prefix = "PROJ-"
        items = state.projects
        break
      case "employee":
        prefix = "EMP-"
        items = state.employees
        break
      case "material":
        prefix = "MAT-"
        items = state.materials
        break
      case "transaction":
        prefix = "TRX-"
        items = state.financialTransactions
        break
    }

    // Encontrar o maior número de ID atual
    const maxId = items.reduce((max, item) => {
      const idNumber = Number.parseInt(item.id.split("-")[1])
      return idNumber > max ? idNumber : max
    }, 0)

    // Formatar o novo ID com zeros à esquerda
    return `${prefix}${String(maxId + 1).padStart(3, "0")}`
  }

  return <DashboardContext.Provider value={{ state, dispatch, getNextId }}>{children}</DashboardContext.Provider>
}

// Hook para usar o contexto
export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

