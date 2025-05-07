import { OrderCard } from "@/components/dashboard/OrderCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessOrders } from "@/lib/actions/order.actions";
import { getCurrentUser } from "@/lib/auth";
import { Package, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BusinessOrdersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'business') {
    redirect('/login');
  }

  const orders = await getBusinessOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Delivery Orders</h1>
          <p className="text-muted-foreground">
            Track and manage all your past and current delivery requests.
          </p>
        </div>
        <Link href="/dashboard/business/create-order">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Order
          </Button>
        </Link>
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} currentUserRole="business" />
          ))}
        </div>
      ) : (
        <Card className="col-span-full">
            <CardContent className="p-10 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Package className="h-16 w-16 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="mb-4">You haven&apos;t created any delivery orders. Get started by creating one!</p>
              <Link href="/dashboard/business/create-order">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Order
                </Button>
              </Link>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
