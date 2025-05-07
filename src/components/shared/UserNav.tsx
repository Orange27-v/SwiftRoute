'use client';

import type { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Settings, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth'; 
import { handleLogout as performLogoutServerAction } from '@/lib/actions/auth.actions'; // Updated import
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true); // Ensure loading state is true at the start of fetch
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }
    fetchUser();
  }, []); // Removed router from dependencies as it's stable, re-fetching should be triggered by router.refresh or navigation

  const handleLogout = async () => {
    setIsLoading(true); // Set loading state for logout
    try {
      await performLogoutServerAction(); // Call the server action
      // The server action now handles redirect and revalidation.
      // Client-side redirect via router.push('/login') is handled by the server action's redirect().
      // router.refresh() is also implicitly handled by revalidatePath and redirect.
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      // setUser(null) can be done for immediate optimistic UI update, but server redirect should handle it.
      // Forcing client-side state update to ensure UI reflects logged out state before full navigation if needed.
       setUser(null); 
    } catch (error) {
      toast({ title: "Logout Failed", description: "An error occurred during logout.", variant: "destructive" });
      console.error("Logout error:", error);
    } finally {
       setIsLoading(false); // Reset loading state
       // router.refresh(); // Ensure client-side components re-evaluate after logout action
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        {/* <div className="h-4 w-20 rounded bg-muted animate-pulse" /> */}
      </div>
    );
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">Login</Button>
      </Link>
    );
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const dashboardPath = user.role === 'business' ? '/dashboard/business' : 
                        user.role === 'logistics' ? '/dashboard/logistics' : 
                        '/dashboard/admin';


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png?size=64`} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize pt-1">
              Role: {user.role} {user.role === 'logistics' && `(${user.is_verified ? 'Verified' : 'Unverified'})`}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={dashboardPath}>
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings">
             <DropdownMenuItem> 
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         <Link href="/support">
            <DropdownMenuItem disabled> {/* Disabled for now */}
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
          </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}