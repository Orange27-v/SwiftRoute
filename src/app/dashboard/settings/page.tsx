import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { Settings } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Preferences</CardTitle>
          <CardDescription>
            Update your personal information, notification settings, and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground rounded-lg border-2 border-dashed border-border">
            <Settings className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Settings page is under construction.</p>
            <p className="text-sm">You will be able to manage your profile, notifications, and security settings here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
