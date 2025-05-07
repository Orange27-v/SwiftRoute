import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { UserCircle, Banknote } from "lucide-react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function LogisticsProfilePage() {
  const user = await getCurrentUser(); 
  if (!user || user.role !== 'logistics') {
    redirect('/login');
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Company Profile</h1>
        <p className="text-muted-foreground">
          Manage your company information, verification status, and payout details.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png?size=128`} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>
                {user.email} - 
                <span className={`ml-1 font-semibold ${user.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.is_verified ? "Verified" : "Pending Verification"}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-2">Company Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue={user.name} />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} readOnly />
                </div>
              </div>
               {/* Add more fields like phone, address, company registration documents upload etc. */}
              <Button disabled className="bg-accent hover:bg-accent/90 text-accent-foreground">Update Company Info (Coming Soon)</Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center"><Banknote className="mr-2 h-5 w-5 text-primary" /> Payout Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage your bank account details for receiving payouts. This information is securely stored.</p>
            {/* Payout details form would go here - Bank name, account number, account name */}
            <div className="p-6 border border-dashed rounded-md text-center">
              <p className="text-muted-foreground">Payout settings management is under construction.</p>
              <p className="text-xs text-muted-foreground">You will be able to add and update your bank details here.</p>
            </div>
             <Button disabled className="mt-4">Save Payout Settings (Coming Soon)</Button>
          </div>


           {!user.is_verified && (
            <>
            <Separator />
            <Card className="border-yellow-500 bg-yellow-50/50 p-4">
                <CardHeader className="p-2">
                    <CardTitle className="text-yellow-700 text-md">Verification Pending</CardTitle>
                </CardHeader>
                <CardContent className="p-2 text-sm text-yellow-600">
                    Your account is currently awaiting verification by our admin team. 
                    During this period, you can set up your profile, but you won&apos;t be able to accept delivery orders or receive payouts.
                    We appreciate your patience.
                </CardContent>
            </Card>
            </>
           )}

        </CardContent>
      </Card>
    </div>
  );
}
