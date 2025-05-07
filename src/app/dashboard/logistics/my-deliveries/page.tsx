import { OrderCard } from "@/components/dashboard/OrderCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLogisticsCompanyDeliveries } from "@/lib/actions/order.actions";
import { getCurrentUser } from "@/lib/auth";
import { Truck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LogisticsMyDeliveriesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'logistics') {
    redirect('/login');
  }

  if (!user.is_verified) {
     return (
      <div className="space-y-6">
        <Card className="border-yellow-500 border-2 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700">Account Not Verified</CardTitle>
            <CardDescription className="text-yellow-600">
              Your account is pending verification. You will be able to manage deliveries once your account is approved.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const myDeliveries = await getLogisticsCompanyDeliveries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Deliveries</h1>
        <p className="text-muted-foreground">
          Manage and track all deliveries you have accepted.
        </p>
      </div>

      {myDeliveries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myDeliveries.map(order => (
            <OrderCard key={order.id} order={order} currentUserRole="logistics" />
          ))}
        </div>
      ) : (
        <Card className="col-span-full">
            <CardContent className="p-10 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Truck className="h-16 w-16 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Deliveries Yet</h3>
              <p>You haven&apos;t accepted any delivery orders. Check the "Available Orders" section.</p>
            </CardContent>
          </Card>
      )}
    </div>
  );
}
