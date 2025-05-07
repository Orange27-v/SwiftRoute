// src/components/shared/Navbar.tsx
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { UserNav } from '@/components/shared/UserNav';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <Logo />
        
        <nav className="flex items-center gap-2"> {/* Main navigation container for right side items */}
          
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
            
            <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>

            {!user && (
              <>
                <Link href="/#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </Link>
                <Link href="/#testimonials" className="text-muted-foreground transition-colors hover:text-foreground">
                  Testimonials
                </Link>
              </>
            )}
          </div>

          {/* UserNav (if logged in) or Login button (if logged out, for desktop) */}
          {/* UserNav component handles its own display and is suitable for all screen sizes. */}
          {/* The explicit Login button here is primarily for desktop when not logged in. */}
          {user ? (
            <UserNav /> 
          ) : (
            // This Login button is hidden on small screens, mobile login is via hamburger.
            <Link href="/login" className="hidden md:inline-flex"> 
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )}
          
          {/* Mobile Navigation Menu Trigger */}
          <div className="md:hidden"> {/* Only show on mobile screens (hidden on md and up) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/register">Get Started</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/#features">Features</Link>
                </DropdownMenuItem>
                {!user && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/#pricing">Pricing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/#testimonials">Testimonials</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {/* If user is not logged in, provide a Login link in the mobile menu. */}
                {/* UserNav (if logged in) handles its own settings/logout links. */}
                {!user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  );
}
