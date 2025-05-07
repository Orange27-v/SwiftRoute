import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { PackageSearch } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">All Delivery Orders</h1>
        <p className="text-muted-foreground">
          Oversee all delivery orders placed on the platform.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order Overview</CardTitle>
          <CardDescription>
            Monitor order statuses, intervene if necessary, and view transaction details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground rounded-lg border-2 border-dashed border-border">
            <PackageSearch className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Order management interface is under construction.</p>
            <p className="text-sm">You will be able to view all orders, their current status, payment details, and associated users.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
