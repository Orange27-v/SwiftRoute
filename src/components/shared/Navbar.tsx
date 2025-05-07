// src/components/shared/Navbar.tsx
'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { UserNav } from '@/components/shared/UserNav';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { getCurrentUser } from '@/lib/auth'; // Keep this for initial server render hint if needed, but client will fetch
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '../ui/separator';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }
    fetchUser();
  }, []);

  const commonLinks = (
    <>
      <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground block py-2" onClick={() => setIsMobileMenuOpen(false)}>
        Features
      </Link>
      {!user && (
        <>
          <Link href="/#pricing" className="text-muted-foreground transition-colors hover:text-foreground block py-2" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </Link>
          <Link href="/#testimonials" className="text-muted-foreground transition-colors hover:text-foreground block py-2" onClick={() => setIsMobileMenuOpen(false)}>
            Testimonials
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <Logo />
        
        <nav className="flex items-center gap-2">
          {/* Desktop-only navigation links */}
          <div className="hidden md:flex items-center gap-4 text-sm lg:gap-6">
            {user ? (
              <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
            ) : (
              <Link href="/register" className="text-muted-foreground transition-colors hover:text-foreground">
                Get Started
              </Link>
            )}
            {commonLinks}
          </div>

          {/* UserNav (if logged in) or Login button (if logged out, for desktop) */}
          {isLoading ? (
             <div className="h-8 w-20 rounded-md bg-muted animate-pulse hidden md:block" />
          ) : user ? (
            <UserNav /> 
          ) : (
            <Link href="/login" className="hidden md:inline-flex"> 
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )}
          
          {/* Mobile Navigation Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <SheetTitle><Logo /></SheetTitle>
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon">
                         <X className="h-5 w-5" />
                         <span className="sr-only">Close menu</span>
                       </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="p-4 space-y-2">
                  {user ? (
                     <Link href="/dashboard" className="font-medium text-primary block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                       Dashboard
                     </Link>
                  ) : (
                    <Link href="/register" className="font-medium text-primary block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  )}
                  {commonLinks}
                  <Separator className="my-4" />
                  {user ? (
                    // If user is logged in, UserNav component inside Sheet is complex.
                    // Logout is handled by UserNav. For mobile, maybe a direct logout link or a profile link.
                    // For simplicity, we'll rely on UserNav if they click the avatar, or add a simple logout.
                    // <UserNav /> // This might be too much for a simple sheet.
                    // Alternative:
                     <Link href="/dashboard/settings" className="text-muted-foreground transition-colors hover:text-foreground block py-2" onClick={() => setIsMobileMenuOpen(false)}>
                       Account Settings
                     </Link>
                    // And a logout button would call the handleLogout action.
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Login</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
