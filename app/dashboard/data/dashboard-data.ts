// Tipos de dados
export type Project = {
  id: string
  name: string
  client: string
  type: string
  status: "in-progress" | "completed" | "pending" | "cancelled"
  startDate: string
  endDate: string
  value: number
}

export type Employee = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: "active" | "on-leave" | "terminated"
  hireDate: string
  hourlyRate: number
}

export type Material = {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  unitCost: number
  totalValue: number
  reorderLevel: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}

export type FinancialTransaction = {
  id: string
  description: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  project?: string
  status?: "paid" | "pending" | "overdue"
}

// Dados de projetos
export const projectsData: Project[] = [
  {
    id: "PROJ-1234",
    name: "Johnson Residence",
    client: "Robert Johnson",
    type: "Residential Painting",
    status: "in-progress",
    startDate: "2023-07-15",
    endDate: "2023-08-20",
    value: 4500,
  },
  {
    id: "PROJ-1235",
    name: "Oakwood Office Complex",
    client: "Oakwood Properties",
    type: "Commercial Painting",
    status: "pending",
    startDate: "2023-08-22",
    endDate: "2023-10-15",
    value: 12800,
  },
  {
    id: "PROJ-1236",
    name: "Rivera Kitchen Remodel",
    client: "Maria Rivera",
    type: "Interior Remodeling",
    status: "in-progress",
    startDate: "2023-07-05",
    endDate: "2023-08-28",
    value: 8200,
  },
  {
    id: "PROJ-1237",
    name: "Sunset Apartments",
    client: "Sunset Properties LLC",
    type: "Exterior Painting",
    status: "pending",
    startDate: "2023-09-05",
    endDate: "2023-10-30",
    value: 15600,
  },
  {
    id: "PROJ-1238",
    name: "Thompson Bathroom Renovation",
    client: "James Thompson",
    type: "Interior Remodeling",
    status: "completed",
    startDate: "2023-06-10",
    endDate: "2023-07-15",
    value: 6800,
  },
  {
    id: "PROJ-1239",
    name: "Downtown Cafe",
    client: "Urban Brews LLC",
    type: "Commercial Painting",
    status: "completed",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    value: 9200,
  },
  {
    id: "PROJ-1240",
    name: "Greenview Community Center",
    client: "Greenview HOA",
    type: "Commercial Painting",
    status: "cancelled",
    startDate: "2023-07-20",
    endDate: "2023-09-15",
    value: 18500,
  },
]

// Dados de funcionários
export const employeesData: Employee[] = [
  {
    id: "EMP-001",
    name: "John Smith",
    email: "john.smith@paintpro.com",
    phone: "(555) 123-4567",
    role: "Lead Painter",
    department: "Residential",
    status: "active",
    hireDate: "2020-03-15",
    hourlyRate: 28.5,
  },
  {
    id: "EMP-002",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@paintpro.com",
    phone: "(555) 234-5678",
    role: "Project Manager",
    department: "Commercial",
    status: "active",
    hireDate: "2019-06-10",
    hourlyRate: 32.75,
  },
  {
    id: "EMP-003",
    name: "David Johnson",
    email: "david.johnson@paintpro.com",
    phone: "(555) 345-6789",
    role: "Painter",
    department: "Residential",
    status: "active",
    hireDate: "2021-02-22",
    hourlyRate: 24.0,
  },
  {
    id: "EMP-004",
    name: "Sarah Williams",
    email: "sarah.williams@paintpro.com",
    phone: "(555) 456-7890",
    role: "Interior Designer",
    department: "Remodeling",
    status: "active",
    hireDate: "2020-08-05",
    hourlyRate: 30.25,
  },
  {
    id: "EMP-005",
    name: "Michael Brown",
    email: "michael.brown@paintpro.com",
    phone: "(555) 567-8901",
    role: "Lead Painter",
    department: "Commercial",
    status: "on-leave",
    hireDate: "2018-11-12",
    hourlyRate: 29.5,
  },
  {
    id: "EMP-006",
    name: "Jennifer Davis",
    email: "jennifer.davis@paintpro.com",
    phone: "(555) 678-9012",
    role: "Painter",
    department: "Residential",
    status: "active",
    hireDate: "2022-01-10",
    hourlyRate: 23.75,
  },
  {
    id: "EMP-007",
    name: "Robert Wilson",
    email: "robert.wilson@paintpro.com",
    phone: "(555) 789-0123",
    role: "Carpenter",
    department: "Remodeling",
    status: "active",
    hireDate: "2021-05-18",
    hourlyRate: 27.0,
  },
  {
    id: "EMP-008",
    name: "Lisa Martinez",
    email: "lisa.martinez@paintpro.com",
    phone: "(555) 890-1234",
    role: "Office Manager",
    department: "Administration",
    status: "active",
    hireDate: "2019-03-20",
    hourlyRate: 26.5,
  },
  {
    id: "EMP-009",
    name: "James Taylor",
    email: "james.taylor@paintpro.com",
    phone: "(555) 901-2345",
    role: "Painter",
    department: "Commercial",
    status: "terminated",
    hireDate: "2020-07-14",
    hourlyRate: 24.25,
  },
  {
    id: "EMP-010",
    name: "Patricia Anderson",
    email: "patricia.anderson@paintpro.com",
    phone: "(555) 012-3456",
    role: "Estimator",
    department: "Sales",
    status: "active",
    hireDate: "2021-09-08",
    hourlyRate: 29.0,
  },
]

// Dados de materiais
export const materialsData: Material[] = [
  {
    id: "MAT-001",
    name: "Premium Interior Paint - White",
    category: "Paint",
    quantity: 48,
    unit: "Gallon",
    unitCost: 28.99,
    totalValue: 1391.52,
    reorderLevel: 20,
    status: "in-stock",
  },
  {
    id: "MAT-002",
    name: "Premium Interior Paint - Beige",
    category: "Paint",
    quantity: 32,
    unit: "Gallon",
    unitCost: 28.99,
    totalValue: 927.68,
    reorderLevel: 15,
    status: "in-stock",
  },
  {
    id: "MAT-003",
    name: "Premium Exterior Paint - White",
    category: "Paint",
    quantity: 18,
    unit: "Gallon",
    unitCost: 32.99,
    totalValue: 593.82,
    reorderLevel: 20,
    status: "low-stock",
  },
  {
    id: "MAT-004",
    name: "Premium Exterior Paint - Gray",
    category: "Paint",
    quantity: 24,
    unit: "Gallon",
    unitCost: 32.99,
    totalValue: 791.76,
    reorderLevel: 15,
    status: "in-stock",
  },
  {
    id: "MAT-005",
    name: "Paint Primer - Interior",
    category: "Paint",
    quantity: 12,
    unit: "Gallon",
    unitCost: 22.5,
    totalValue: 270.0,
    reorderLevel: 10,
    status: "in-stock",
  },
  {
    id: "MAT-006",
    name: "Paint Rollers - 9 inch",
    category: "Tools",
    quantity: 45,
    unit: "Each",
    unitCost: 4.99,
    totalValue: 224.55,
    reorderLevel: 20,
    status: "in-stock",
  },
  {
    id: "MAT-007",
    name: "Paint Brushes - 2 inch",
    category: "Tools",
    quantity: 36,
    unit: "Each",
    unitCost: 6.99,
    totalValue: 251.64,
    reorderLevel: 15,
    status: "in-stock",
  },
  {
    id: "MAT-008",
    name: "Drop Cloths - 9x12",
    category: "Supplies",
    quantity: 8,
    unit: "Each",
    unitCost: 12.99,
    totalValue: 103.92,
    reorderLevel: 10,
    status: "low-stock",
  },
  {
    id: "MAT-009",
    name: "Painter's Tape - 1.5 inch",
    category: "Supplies",
    quantity: 0,
    unit: "Roll",
    unitCost: 5.49,
    totalValue: 0,
    reorderLevel: 25,
    status: "out-of-stock",
  },
  {
    id: "MAT-010",
    name: "Drywall Compound",
    category: "Materials",
    quantity: 15,
    unit: "Bucket",
    unitCost: 18.99,
    totalValue: 284.85,
    reorderLevel: 8,
    status: "in-stock",
  },
]

// Dados de transações financeiras
export const financialTransactionsData: FinancialTransaction[] = [
  {
    id: "TRX-001",
    description: "Paint Supplies - Sherman Williams",
    type: "expense",
    category: "Materials",
    amount: 1245.0,
    date: "2023-08-12",
    project: "PROJ-1234",
  },
  {
    id: "TRX-002",
    description: "Johnson Residence - Deposit",
    type: "income",
    category: "Project Payment",
    amount: 2250.0,
    date: "2023-08-10",
    project: "PROJ-1234",
    status: "paid",
  },
  {
    id: "TRX-003",
    description: "Employee Payroll",
    type: "expense",
    category: "Labor",
    amount: 8540.0,
    date: "2023-08-05",
  },
  {
    id: "TRX-004",
    description: "Oakwood Office - Final Payment",
    type: "income",
    category: "Project Payment",
    amount: 6400.0,
    date: "2023-08-03",
    project: "PROJ-1235",
    status: "paid",
  },
  {
    id: "TRX-005",
    description: "Vehicle Maintenance",
    type: "expense",
    category: "Equipment",
    amount: 350.0,
    date: "2023-08-01",
  },
  {
    id: "TRX-006",
    description: "Office Rent",
    type: "expense",
    category: "Overhead",
    amount: 1800.0,
    date: "2023-08-01",
  },
  {
    id: "TRX-007",
    description: "Insurance Premium",
    type: "expense",
    category: "Insurance",
    amount: 750.0,
    date: "2023-07-28",
  },
  {
    id: "TRX-008",
    description: "Rivera Kitchen Remodel - Deposit",
    type: "income",
    category: "Project Payment",
    amount: 4100.0,
    date: "2023-07-05",
    project: "PROJ-1236",
    status: "paid",
  },
  {
    id: "TRX-009",
    description: "Thompson Bathroom - Final Payment",
    type: "income",
    category: "Project Payment",
    amount: 3400.0,
    date: "2023-07-15",
    project: "PROJ-1238",
    status: "paid",
  },
  {
    id: "TRX-010",
    description: "Sunset Apartments - Deposit",
    type: "income",
    category: "Project Payment",
    amount: 7800.0,
    date: "2023-07-10",
    project: "PROJ-1237",
    status: "overdue",
  },
]

