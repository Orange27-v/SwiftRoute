import { LogisticsOrdersTabs } from "@/components/dashboard/LogisticsOrdersTabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAvailableOrdersForLogistics, getLogisticsCompanyDeliveries, getLogisticsWallet } from "@/lib/actions/order.actions";
import { getCurrentUser } from "@/lib/auth";
import { DollarSign, PackageCheck, PackageSearch } from "lucide-react";
import { redirect } from "next/navigation";
import { format } from 'date-fns';

export default async function LogisticsDashboardPage() {
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
              Your account is pending verification. You will be able to accept delivery requests once your account is approved by an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-600">Please check back later or contact support if you believe this is an error.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [availableOrders, myDeliveries, wallet] = await Promise.all([
    getAvailableOrdersForLogistics(),
    getLogisticsCompanyDeliveries(),
    getLogisticsWallet()
  ]);

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency }).format(amount / 100);
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Logistics Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user.name}! Manage your deliveries and earnings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wallet ? formatCurrency(wallet.balance, wallet.currency) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {wallet ? format(new Date(wallet.updated_at), "PPpp") : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Orders</CardTitle>
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              New delivery requests waiting for acceptance.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myDeliveries.filter(d => d.status === 'in_escrow' || d.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Deliveries currently in progress or awaiting confirmation.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Separator />

      <LogisticsOrdersTabs 
        initialAvailableOrders={availableOrders} 
        initialMyDeliveries={myDeliveries}
      />
    </div>
  );
}
