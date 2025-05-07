import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { DollarSign, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { getLogisticsWallet } from "@/lib/actions/order.actions";
import { format } from 'date-fns';

export default async function LogisticsEarningsPage() {
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
              Your account is pending verification. Earnings information will be available once approved.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const wallet = await getLogisticsWallet();
  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency }).format(amount / 100);
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Earnings</h1>
        <p className="text-muted-foreground">
          Track your earnings, view payout history, and manage your wallet.
        </p>
      </div>
       <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {wallet ? formatCurrency(wallet.balance, wallet.currency) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {wallet ? format(new Date(wallet.updated_at), "PPpp") : 'N/A'}
            </p>
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>
            Summary of your earnings and payout status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground rounded-lg border-2 border-dashed border-border">
            <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Detailed earnings breakdown is coming soon.</p>
            <p className="text-sm">You will be able to see graphs, payout history, and manage withdrawal settings here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
