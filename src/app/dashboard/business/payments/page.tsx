import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BusinessPaymentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'business') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Payment History</h1>
        <p className="text-muted-foreground">
          View your transaction history for delivery services.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            A list of all your payments made for delivery services through SwiftRoute&apos;s escrow system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground rounded-lg border-2 border-dashed border-border">
            <CreditCard className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Payment history feature is coming soon.</p>
            <p className="text-sm">You will be able to see all your escrow payments and their statuses here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
