import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { Users } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manage Users</h1>
        <p className="text-muted-foreground">
          View, verify, and manage all registered users on the platform.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Filter, search, and take actions on user accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground rounded-lg border-2 border-dashed border-border">
            <Users className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">User management interface is under construction.</p>
            <p className="text-sm">You will be able to approve logistics companies, view user details, and manage roles here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
