import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBusinessOrders } from "@/lib/actions/order.actions";
import { getCurrentUser } from "@/lib/auth";
import { ArrowRight, Package, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderCard } from "@/components/dashboard/OrderCard"; 

export default async function BusinessDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'business') {
    redirect('/login');
  }

  const orders = await getBusinessOrders();
  const recentOrders = orders.slice(0, 3); 

  const activeOrdersCount = orders.filter(o => 
    o.status === 'pending_acceptance' || 
    o.status === 'pending_payment' || 
    o.status === 'in_escrow' ||
    o.status === 'delivered' 
  ).length;

  const completedOrdersCount = orders.filter(o => o.status === 'confirmed_by_business').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Business Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Manage your deliveries and track their progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrdersCount}</div>
            <p className="text-xs text-muted-foreground">
              Orders currently in progress or awaiting action.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrdersCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered and confirmed orders.
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center items-center bg-primary/5 hover:bg-primary/10 transition-colors">
            <CardContent className="p-6 text-center">
                 <Link href="/dashboard/business/create-order">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create New Delivery
                    </Button>
                 </Link>
            </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/dashboard/business/orders">
                <Button variant="outline" size="sm">View All Orders <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {recentOrders.map(order => (
              <OrderCard key={order.id} order={order} currentUserRole="business" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>You haven&apos;t created any delivery orders yet.</p>
              <Link href="/dashboard/business/create-order" className="mt-2">
                <Button variant="default" className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">Create Your First Order</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
