// src/components/dashboard/SettingsPopover.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Settings, LogOut, User as UserIcon, LifeBuoy, Loader2 } from 'lucide-react';
import { handleLogout as performLogoutServerAction } from '@/lib/actions/auth.actions';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';
import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';

interface SettingsPopoverProps {
  user: User;
}

export function SettingsPopover({ user }: SettingsPopoverProps) {
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { state: sidebarState, isMobile } = useSidebar();

  const dashboardPath = user.role === 'business' ? '/dashboard/business' : 
                        user.role === 'logistics' ? '/dashboard/logistics' : 
                        '/dashboard/admin';

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      await performLogoutServerAction();
      // If performLogoutServerAction redirects, this part of the try block might not be reached.
      // The redirect itself is the primary indication of success.
      // A success toast here (like "Logged Out") might be preempted or cause issues.
    } catch (error) {
      // This will catch genuine errors from performLogoutServerAction.
      console.error("Popover logout error:", error);
      toast({ title: "Logout Failed", description: "An error occurred during logout.", variant: "destructive" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const triggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground 
                 group-data-[state=expanded]:w-full group-data-[state=expanded]:justify-start group-data-[state=expanded]:px-2
                 group-data-[state=expanded]:text-sidebar-foreground group-data-[state=expanded]:hover:bg-sidebar-accent group-data-[state=expanded]:hover:text-sidebar-accent-foreground"
    >
      <Settings className="h-5 w-5" />
      <span className="ml-2 hidden group-data-[state=expanded]:inline">Settings</span>
      <span className="sr-only">Settings</span>
    </Button>
  );

  return (
    <Popover>
      {sidebarState === 'collapsed' && !isMobile ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Settings
          </TooltipContent>
        </Tooltip>
      ) : (
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      )}
      <PopoverContent className="w-56 p-2 bg-popover text-popover-foreground" side="top" align="start" sideOffset={10}>
        <div className="flex flex-col space-y-1">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
          <Button variant="ghost" asChild className="w-full justify-start px-2 py-1.5 text-sm h-auto">
            <Link href={dashboardPath}>
              <UserIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start px-2 py-1.5 text-sm h-auto">
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
           <Button variant="ghost" asChild className="w-full justify-start px-2 py-1.5 text-sm h-auto" disabled>
            <Link href="/support">
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support
            </Link>
          </Button>
          <hr className="my-1 border-border" />
          <Button 
            variant="ghost" 
            onClick={onLogout} 
            disabled={isLoggingOut} 
            className="w-full justify-start px-2 py-1.5 text-sm h-auto text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:text-destructive focus-visible:bg-destructive/10"
          >
            {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}