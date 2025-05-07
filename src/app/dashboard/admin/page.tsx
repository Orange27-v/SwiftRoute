import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, PackageSearch, AlertTriangle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser(); // Simulate admin user
  if (!user || user.role !== 'admin') {
    redirect('/login'); // Or to an unauthorized page
  }

  // In a real app, you'd fetch these counts from the database
  const totalUsers = 150; // Mock data
  const pendingApprovals = 5; // Mock data
  const openDisputes = 2; // Mock data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, delivery orders, and platform settings.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered businesses and logistics providers.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Logistics companies awaiting verification.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openDisputes}</div>
            <p className="text-xs text-muted-foreground">
              Delivery disputes requiring attention.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
          <CardDescription>
            Key metrics and quick actions for platform administration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Admin-specific components and data will be displayed here. This could include charts for user growth, order volume, revenue, etc.
            Quick links to manage users, view all orders, handle disputes, and configure settings.
          </p>
          {/* Placeholder for future admin components */}
          <div className="mt-4 p-6 border border-dashed rounded-md">
            <p className="text-center text-muted-foreground">Admin content area under construction.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
