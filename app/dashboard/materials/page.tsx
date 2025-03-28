import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MaterialsInventory } from "./materials-inventory"

export const metadata: Metadata = {
  title: "Materials Management - PaintPro Dashboard",
  description: "Materials and inventory management for PaintPro painting and remodeling company",
}

export default function MaterialsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Materials Management</h2>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="usage">Material Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>Track all materials and supplies in stock</CardDescription>
            </CardHeader>
            <CardContent>
              <MaterialsInventory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>Manage material orders and deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Purchase order management will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Management</CardTitle>
              <CardDescription>Manage supplier information and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Supplier management will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Usage</CardTitle>
              <CardDescription>Track material consumption by project</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Material usage tracking will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

