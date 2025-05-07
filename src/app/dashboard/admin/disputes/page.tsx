import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminDisputesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manage Disputes</h1>
        <p className="text-muted-foreground">
          Review and resolve disputes between businesses and logistics providers.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Open Disputes</CardTitle>
          <CardDescription>
            Address ongoing disputes and facilitate resolutions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground rounded-lg border-2 border-dashed border-border">
            <AlertTriangle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Dispute resolution system is under construction.</p>
            <p className="text-sm">You will be able to view dispute details, communicate with parties, and make final decisions here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
