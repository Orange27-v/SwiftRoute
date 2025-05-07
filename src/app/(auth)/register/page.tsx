'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'logistics' ? 'logistics' : 'business';
  const [accountType, setAccountType] = useState(initialType);

  useEffect(() => {
    setAccountType(initialType);
  }, [initialType]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
           <div className="flex justify-center mb-4">
            <Logo textSize="text-2xl" />
          </div>
          <CardTitle className="text-2xl">Create your SwiftRoute Account</CardTitle>
          <CardDescription>Join us as a Business or Logistics Partner.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name / Company Name</Label>
            <Input id="name" placeholder="Your Name or Company LLC" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountType">I want to register as a</Label>
            <Select value={accountType} onValueChange={(value) => setAccountType(value as 'business' | 'logistics')}>
              <SelectTrigger id="accountType">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business (to ship goods)</SelectItem>
                <SelectItem value="logistics">Logistics Company (to offer delivery)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Create Account</Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
