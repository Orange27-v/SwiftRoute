import { CreateOrderForm } from '@/components/forms/CreateOrderForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function CreateOrderPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'business') {
    redirect('/login'); 
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Create New Delivery Order</h1>
        <p className="text-muted-foreground">
          Fill in the details below to request a new delivery.
        </p>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Provide pickup, dropoff, item information, and your offered price.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}
